import {init} from "./db";
import {BetMGM} from "./clients/betmgm";
import {fixtures} from "./tasks/fixtures";
import {fetchMGMCollegeBasketball} from "./tasks/fetch";

const dotenv = require('dotenv');
dotenv.config();

(async () => {
  await init();
  console.log("App is up...confirming fixtures...");
  await fixtures();
  console.log('Trying BetMGM...');
  await fetchMGMCollegeBasketball();
  console.log('BetMGM done!');
  console.log('Sleeping for 300 sec');
  await new Promise(resolve => setTimeout(resolve, 300 * 1000));
  process.exit(0);
})();