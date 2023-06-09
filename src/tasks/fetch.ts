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

    if(process.env.DEBUG) {
      log(`Could not find contest: ${keys[0]}`);
    }

    contest = new Contest();
    contest.key = keys[0];
    contest.title = item.title;
    contest.contestantOne = item.contestantOne;
    contest.contestantTwo = item.contestantTwo;
    contest.startTime = item.startTime;
  }

  contest.isLive = item.isLive;
  await datasource.manager.save(contest);

  return contest;
}

async function contestDTOBetToContestBet(contest: Contest, bet: ContestBetDto): Promise<{isNew: boolean, contestBet: ContestBet}> {
  const datasource = getDatasource();
  const key = `${bet.type}-${bet.title}`;
  let contestBet = await datasource.getRepository(ContestBet).findOneBy({key: key, contest: {id: contest.id}});

  const isNew = contestBet ? false : true;
  if(!contestBet) {
    if(process.env.DEBUG) {
      log(`Could not find bet: ${contest.title} ${key}`);
    }

    contestBet = new ContestBet();
    contestBet.pairId = bet.pairId;
    contestBet.contest = contest;
    contestBet.key = key;
    contestBet.title = bet.title;
    contestBet.type = bet.type;
  }

  contestBet.isLatest = true;
  await datasource.manager.save(contestBet);

  return {isNew, contestBet};
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
    odds = new ContestBetOdds();
    odds.sportsbook = sportsbook;
    odds.contestBet = contestBet;
    odds.odds = contestBetDto.odds;
    odds.isArb = false;
  }

  odds.isLatest = true;
  await datasource.manager.save(odds);

  return {isNew, odds};
}

export async function fetchWynn() {
  log('fetchWynn: starting...');

  const sportsbook = await getDatasource().getRepository(Sportsbook).findOneByOrFail({name: Wynn.NAME});
  const wynn = new Wynn();

  let newBets = 0;
  let newOdds = 0;
  const matches = await wynn.getAllGames();

  fs.writeFileSync('/tmp/fetchWynn.json', JSON.stringify(matches, null, 4));
  log(`fetchWynn: found ${matches.length} games`);

  for(const match of matches) {
    const contest = await contestDTOToContest(match);
    for(const bet of match.bets) {
      const result = await contestDTOBetToContestBet(contest, bet);
      if(result.isNew) {
        newBets += 1;
      }
      const contestBet = result.contestBet;
      const odds = await contestDTOBetOddsToContestBetOdds(sportsbook, contestBet, bet);
      if(odds.isNew) {
        newOdds += 1;
      }
    }
  }

  log(`Found ${newBets} new bets and ${newOdds} new lines!`);
}

export async function fetchMGM() {
  log('fetchMGM: starting...');
  const sportsbook = await getDatasource().getRepository(Sportsbook).findOneByOrFail({name: BetMGM.NAME});
  const betMgm = new BetMGM();
  let newOdds = 0;
  let newBets = 0;

  const results = await betMgm.getAllGames();

  fs.writeFileSync('/tmp/fetchMGM.json', JSON.stringify(results, null, 4));

  log(`fetchMGM: found ${results.length} games`);

  for(const item of results) {
    const contest = await contestDTOToContest(item);

    for(const bet of item.bets) {
      const result = await contestDTOBetToContestBet(contest, bet);
      const contestBet = result.contestBet;
      if(result.isNew) {
        newBets += 1;
      }
      const odds = await contestDTOBetOddsToContestBetOdds(sportsbook, contestBet, bet);
      if(odds.isNew) {
        newOdds += 1;
      }
    }
  }

  log(`Found ${newBets} new bets and ${newOdds} new lines!`);
}
