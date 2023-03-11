import {init} from "./db";

const dotenv = require('dotenv');
dotenv.config();

(async () => {
  await init();
  console.log("We're up!");
})();