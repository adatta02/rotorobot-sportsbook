import {getDatasource} from "../db";
import {Contest} from "../entity/contest";
import {log} from "../utils/logger";
import {ContestBet} from "../entity/contestBet";
import {ContestBetOdds} from "../entity/contestBetOdds";
import {convertDecimalToAmerican} from "../utils";

export async function findArbs() {
  const datasource = getDatasource();
  const futureContests = await datasource.getRepository(Contest)
                                         .createQueryBuilder('u')
    .where('u.startTime > NOW() OR u.isLive = true')
    .orderBy('u.title', 'ASC')
    .getMany();

  log(`findArbs: found ${futureContests.length} contests.`);

  const foundArbs: Map<Contest, ContestBetOdds[]> = new Map<Contest, ContestBetOdds[]>();

  for(const contest of futureContests) {
    const contestBets = await datasource
                              .getRepository(ContestBet)
                              .findBy({contest: {id: contest.id}, isLatest: true});
    const byPairId: Record<string, ContestBet[]> = {};

    for(const bet of contestBets) {
      if(!byPairId[bet.pairId]) {
        byPairId[bet.pairId] = [];
      }

      byPairId[bet.pairId].push(bet);
    }

    for(const key of Object.keys(byPairId)) {
      const bets = byPairId[key];
      if(bets.length < 2) {
        continue;
      }

      const aOdds = await datasource.getRepository(ContestBetOdds).findBy({contestBet: {id: bets[0].id}, isLatest: true});
      const bOdds = await datasource.getRepository(ContestBetOdds).findBy({contestBet: {id: bets[1].id}, isLatest: true});

      if(process.env.DEBUG) {
        log(`Checking ${contest.title}: ${bets[0].title} (${aOdds.length}) vs. ${bets[1].title} (${bOdds.length})`);
      }

      const aOddsBySportsBook: Record<number, ContestBetOdds> = {};
      const bOddsBySportsBook: Record<number, ContestBetOdds> = {};
      for(const odd of aOdds) {
        aOddsBySportsBook[odd.sportsbook.id] = odd;
      }

      for(const odd of bOdds) {
        bOddsBySportsBook[odd.sportsbook.id] = odd;
      }

      for(const odd of aOdds) {
        for(const bodd of bOdds) {
          if(odd.sportsbook !== bodd.sportsbook) {
            const val = (1 / odd.odds) + (1 / bodd.odds );
            if(val < 1) {
              const lst = foundArbs.get(contest) ?? [];
              if(odd.odds < bodd.odds) {
                odd.coverBet = bodd;
                lst.push(odd);
              }else{
                bodd.coverBet = odd;
                lst.push(bodd);
              }

              odd.arbEv = val;
              bodd.arbEv = val;
              odd.isArb = true;
              bodd.isArb = true;

              await datasource.manager.save([odd, bodd]);
              foundArbs.set(contest, lst);
            }
          }
        }
      }
    }
  }

  if(foundArbs.size === 0) {
    log('findArbs: No arbs!');
  }

  for(const contest of foundArbs.keys()) {
    const bets = foundArbs.get(contest) ?? [];
    log(`${contest.title}: ${bets.length} arbs`);

    for(const odd of bets) {
      const bodd = odd.coverBet;
      const arbEv = odd.arbEv;

      if(!bodd || !arbEv) {
        log(`${odd.id}: Missing arbEv or coverBet`);
        continue;
      }

      const profit = ((500 / arbEv) - 500).toFixed(2);
      const cover = (500 * (odd.odds / bodd.odds)).toFixed(2);

      log(`\tProfit: ${profit}`);
      log(`\t${odd.sportsbook.name}: '${odd.contestBet.title}' (${convertDecimalToAmerican(odd.odds)}) Bet $500`);
      log(`\t${bodd.sportsbook.name}: '${bodd.contestBet.title}' (${convertDecimalToAmerican(bodd.odds)}) Bet $${cover}`);
    }
  }

}
