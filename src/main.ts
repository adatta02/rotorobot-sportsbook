import {init} from "./db";
import {BetMGM} from "./clients/betmgm";

const dotenv = require('dotenv');
dotenv.config();

(async () => {
  await init();
  console.log("We're up!");
  const betMGM = new BetMGM();

  const mgmCollegeBasketball = await betMGM.getCollegeBasketballGames();
  console.log( mgmCollegeBasketball );
})();