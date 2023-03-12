import axios from 'axios';
import * as moment from 'moment';
import {ISport} from "../types";
import {IWynnCategoryResponse} from "./types";

// Looks like this is built on https://www.whitehatgaming.com/
export class Wynn {

  public static readonly NAME = "Wynn";

  public async getMatches(categoryId: string) {
    const url = `https://fo.wynnbet-ma-web.gansportsbook.com/s/sbgate/sports/fo-category/?categoryId=${categoryId}&country=US&isMobile=0&language=us&layout=AMERICAN&limit=6&province`;

  }

  public async getSports(): Promise<ISport[]> {
    const url = `https://fo.wynnbet-ma-web.gansportsbook.com/s/sbgate/category/fo-tree/us?country=US`;
    try {
      const result = await axios.get<IWynnCategoryResponse>(url, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }});
      const sports: ISport[] = [];
      for(const s of result.data.children) {
        sports.push({id: `${s.id}`, name: s.name});
      }
      return sports;
    }catch(e) {
      console.error(e);
      process.exit(-1);
    }
  }
}