import {BetMGM} from "../clients/betmgm";
import {getDatasource} from "../db";
import {Contest} from "../entity/contest";
import {ContestBet} from "../entity/contestBet";
import {ContestBetOdds} from "../entity/contestBetOdds";
import {Sportsbook} from "../entity/sportsbook";

export async function fetchMGMCollegeBasketball() {
  const sportsbook = await getDatasource().getRepository(Sportsbook).findOneByOrFail({name: BetMGM.NAME});
  const datasource = getDatasource();
  const betMgm = new BetMGM();

  const results = await betMgm.getCollegeBasketballGames();
  for(const item of results) {
    const key = `${item.title}-${item.startTime.toJSON()}`;
    let contest = await datasource.getRepository(Contest).findOneBy({key});
    if(!contest) {
      contest = new Contest();
      contest.key = key;
      contest.title = item.title;
      contest.contestantOne = item.contestantOne;
      contest.contestantTwo = item.contestantTwo;
      contest.startTime = item.startTime;
      contest.isLive = item.isLive;
    }

    await datasource.manager.save(contest);
    for(const bet of item.bets) {
      const key = `${bet.type}-${bet.title}`;
      let contestBet = await datasource.getRepository(ContestBet).findOneBy({key: key, contest: {id: contest.id}});
      if(!contestBet) {
        contestBet = new ContestBet();
        contestBet.contest = contest;
        contestBet.key = key;
        contestBet.title = bet.title;
        contestBet.type = bet.type;
      }

      await datasource.manager.save(contestBet);
      let odds = await datasource
                              .getRepository(ContestBetOdds)
                              .findOneBy({contestBet: {id: contestBet.id}, sportsbook: {id: sportsbook.id}, odds: bet.odds});
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
        odds.odds = bet.odds;
        odds.isLatest = true;
        await datasource.manager.save(odds);
      }
    }
  }
}