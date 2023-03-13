import {BetMGM} from "../clients/betmgm";
import {getDatasource} from "../db";
import {Contest} from "../entity/contest";
import {ContestBet} from "../entity/contestBet";
import {ContestBetOdds} from "../entity/contestBetOdds";
import {Sportsbook} from "../entity/sportsbook";
import {log} from "../utils/logger";
import {Wynn} from "../clients/wynn";
import * as moment from 'moment';
import {ContestDto} from "../dto/contestDto";
import {ContestBetDto} from "../dto/contestBet.dto";
import * as fs from 'fs';

async function contestDTOToContest(item: ContestDto): Promise<Contest> {
  const datasource = getDatasource();
  const startTime = moment(item.startTime).format('Y-MM-DD');
  const keys = [
    `${item.contestantOne} | ${item.contestantTwo} | ${startTime}`,
    `${item.contestantTwo} | ${item.contestantOne} | ${startTime}`,
  ]

  let contest = await datasource.getRepository(Contest)
                                .createQueryBuilder('u').where('u.key IN (:keys)')
                                .setParameters({keys})
                                .getOne()
  if(!contest) {
    log(`Could not find contest: ${keys[0]}`);

    contest = new Contest();
    contest.key = keys[0];
    contest.title = item.title;
    contest.contestantOne = item.contestantOne;
    contest.contestantTwo = item.contestantTwo;
    contest.startTime = item.startTime;
    contest.isLive = item.isLive;

    await datasource.manager.save(contest);
  }

  return contest;
}

async function contestDTOBetToContestBet(contest: Contest, bet: ContestBetDto): Promise<ContestBet> {
  const datasource = getDatasource();
  const key = `${bet.type}-${bet.title}`;
  let contestBet = await datasource.getRepository(ContestBet).findOneBy({key: key, contest: {id: contest.id}});
  if(!contestBet) {
    // log(`Could not find bet: ${key}`);
    contestBet = new ContestBet();
    contestBet.pairId = bet.pairId;
    contestBet.contest = contest;
    contestBet.key = key;
    contestBet.title = bet.title;
    contestBet.type = bet.type;

    await datasource.manager.save(contestBet);
  }

  return contestBet;
}

async function contestDTOBetOddsToContestBetOdds(sportsbook: Sportsbook,
                                                 contestBet: ContestBet,
                                                 contestBetDto: ContestBetDto): Promise<{isNew: boolean, odds: ContestBetOdds}> {
  const datasource = getDatasource();
  let odds = await datasource
    .getRepository(ContestBetOdds)
    .createQueryBuilder('u')
    .where('u.contestBet.id = :contestBetId AND u.sportsbook.id = :sportsbookId AND u.odds = :odds')
    .setParameters({contestBetId: contestBet.id, sportsbookId: sportsbook.id, odds: contestBetDto.odds})
    .getOne();

  const isNew = odds ? false : true;
  if(!odds) {
    await datasource.createQueryBuilder()
      .update(ContestBetOdds)
      .set({isLatest: false})
      .where('contestBet.id = :contestBetId AND sportsbook.id = :sportsbookId')
      .setParameters({sportsbookId: sportsbook.id, contestBetId: contestBet.id})
      .execute();

    odds = new ContestBetOdds();
    odds.sportsbook = sportsbook;
    odds.contestBet = contestBet;
    odds.odds = contestBetDto.odds;
    odds.isLatest = true;
    odds.isArb = false;
    await datasource.manager.save(odds);
  }

  return {isNew, odds};
}

export async function fetchWynn() {
  const sportsbook = await getDatasource().getRepository(Sportsbook).findOneByOrFail({name: Wynn.NAME});
  const datasource = getDatasource();
  const wynn = new Wynn();

  let newOdds = 0;
  const matches = await wynn.getAllGames();

  fs.writeFileSync('/tmp/fetchWynn.json', JSON.stringify(matches, null, 4));

  for(const match of matches) {
    if(match.bets.length === 0) {
      log(`No bets for: ${match.title}`);
      continue;
    }

    const contest = await contestDTOToContest(match);
    for(const bet of match.bets) {
      const contestBet = await contestDTOBetToContestBet(contest, bet);
      const odds = await contestDTOBetOddsToContestBetOdds(sportsbook, contestBet, bet);
      if(odds.isNew) {
        newOdds += 1;
      }
    }
  }

  log(`Found ${newOdds} new lines!`);
}

export async function fetchMGM() {
  const sportsbook = await getDatasource().getRepository(Sportsbook).findOneByOrFail({name: BetMGM.NAME});
  const datasource = getDatasource();
  const betMgm = new BetMGM();
  let newOdds = 0;

  const results = await betMgm.getAllGames();

  fs.writeFileSync('/tmp/fetchMGM.json', JSON.stringify(results, null, 4));

  log(`fetchMGM: found ${results.length} games`);

  for(const item of results) {
    const contest = await contestDTOToContest(item);

    for(const bet of item.bets) {
      const contestBet = await contestDTOBetToContestBet(contest, bet);
      const odds = await contestDTOBetOddsToContestBetOdds(sportsbook, contestBet, bet);
      if(odds.isNew) {
        newOdds += 1;
      }
    }
  }

  log(`Found ${newOdds} new lines!`);
}