import {getDatasource} from "../db";
import {Sportsbook} from "../entity/sportsbook";
import {BetMGM} from "../clients/betmgm";
import {Wynn} from "../clients/wynn";
import {ContestBet} from "../entity/contestBet";
import {Contest} from "../entity/contest";
import {ContestBetOdds} from "../entity/contestBetOdds";

export async function fixtures() {
  const datasource = getDatasource();
  for(const sportsbook of [BetMGM.NAME, Wynn.NAME]) {
    let book = await datasource.getRepository(Sportsbook).findOneBy({name: sportsbook});
    if(!book) {
      book = new Sportsbook();
      book.name = sportsbook;
      await datasource.manager.save(book);
    }
  }

  await datasource.createQueryBuilder()
    .update(Contest)
    .set({isLive: false})
    .execute();

  await datasource.createQueryBuilder()
    .update(ContestBet)
    .set({isLatest: false})
    .execute();

  await datasource.createQueryBuilder()
      .update(ContestBetOdds)
      .set({isLatest: false})
      .execute();
}
