import {init} from "./db";
import {BetMGM} from "./clients/betmgm";
import {fixtures} from "./tasks/fixtures";
import {fetchMGM, fetchWynn} from "./tasks/fetch";
import {log} from "./utils/logger";
import {findArbs} from "./tasks/findArbs";
import {convertDecimalToAmerican} from "./utils";

const dotenv = require('dotenv');
dotenv.config();

(async () => {
  await init();

  log(`App is up...confirming fixtures...`);
  await fixtures();

  await fetchMGM();

  await fetchWynn();

  await findArbs();

  log('Sleeping for 60 sec');
  await new Promise(resolve => setTimeout(resolve, 60 * 1000));
  process.exit(0);
})();
