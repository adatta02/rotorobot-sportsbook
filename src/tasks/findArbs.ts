import {getDatasource} from "../db";
import {Contest} from "../entity/contest";
import {log} from "../utils/logger";
import {ContestBet} from "../entity/contestBet";
import {ContestBetOdds} from "../entity/contestBetOdds";

export async function findArbs() {
  const datasource = getDatasource();
  const futureContests = await datasource.getRepository(Contest)
                                         .createQueryBuilder('u')
    .where('u.startTime > NOW()')
    .orderBy('u.title', 'ASC')
    .getMany();

  log(`Found ${futureContests.length} contests`);

  for(const contest of futureContests) {
    const contestBets = await datasource.getRepository(ContestBet).findBy({contest: {id: contest.id}});
    const byPairId: Record<string, ContestBet[]> = {};

    for(const bet of contestBets) {
      if(!byPairId[bet.pairId]) {
        byPairId[bet.pairId] = [];
      }

      byPairId[bet.pairId].push(bet);
    }

    log(`Checking arbs - ${contest.title}`);

    for(const key of Object.keys(byPairId)) {
      const bets = byPairId[key];
      if(bets.length < 2) {
        continue;
      }
      const aOdds = await datasource.getRepository(ContestBetOdds).findBy({contestBet: {id: bets[0].id}, isLatest: true});
      const bOdds = await datasource.getRepository(ContestBetOdds).findBy({contestBet: {id: bets[1].id}, isLatest: true});

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
              log(`Found arb!`);
              if(odd.odds < bodd.odds) {
                const cover = (100 * (odd.odds / bodd.odds)).toFixed(2);
                log(`Bet $100 on ${odd.contestBet.title} and ${cover} on ${bodd.contestBet.title}`);
              }else{
                const cover = (100 * (bodd.odds/ odd.odds)).toFixed(2);
                log(`Bet $100 on ${bodd.contestBet.title} and ${cover} on ${odd.contestBet.title}`);
              }
              odd.isArb = true;
              bodd.isArb = true;
              await datasource.manager.save([odd, bodd]);
            }
          }
        }
      }
    }
  }
}