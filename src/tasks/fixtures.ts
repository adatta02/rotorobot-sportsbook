import {getDatasource} from "../db";
import {Sportsbook} from "../entity/sportsbook";
import {BetMGM} from "../clients/betmgm";
import {Wynn} from "../clients/wynn";
import {ContestBet} from "../entity/contestBet";

export async function fixtures() {
  for(const sportsbook of [BetMGM.NAME, Wynn.NAME]) {
    let book = await getDatasource().getRepository(Sportsbook).findOneBy({name: sportsbook});
    if(!book) {
      book = new Sportsbook();
      book.name = sportsbook;
      await getDatasource().manager.save(book);
    }
  }

  await getDatasource().createQueryBuilder()
    .update(ContestBet)
    .set({isLatest: false})
    .execute();
}