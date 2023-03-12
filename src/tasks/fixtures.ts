import {getDatasource} from "../db";
import {Sportsbook} from "../entity/sportsbook";
import {BetMGM} from "../clients/betmgm";

export async function fixtures() {
  for(const sportsbook of [BetMGM.NAME]) {
    let book = await getDatasource().getRepository(Sportsbook).findOneBy({name: sportsbook});
    if(!book) {
      book = new Sportsbook();
      book.name = sportsbook;
      await getDatasource().manager.save(book);
    }
  }
}