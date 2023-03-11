// NOTE: BetMGM is a white label of Bwin, https://sports.bwin.com/en/sports
import axios from 'axios';
import {IBwinBettingOffer, IBwinClientConfig} from "./types";
import {ISport} from "../types";

const BASE_URL = 'https://sports.ma.betmgm.com';

export class BetMGM {

  private _clientConfig: IBwinClientConfig;

  public async getSports(): Promise<ISport[]> {
    const clientConfig = await this.getClientConfig();
    const url = `https://sports.ma.betmgm.com/cds-api/bettingoffer/counts?x-bwin-accessid=${clientConfig.msApp.publicAccessId}&lang=en-us&country=US&userCountry=US&subdivision=US-Massachusetts&state=Latest&tagTypes=Sport&extendedTags=Sport&sortBy=Tags&supportVirtual=false`;
    try {
      const result = await axios.get<IBwinBettingOffer[]>(url, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
        }});
      const sports = result.data.filter(item => item.tag.type === 'Sport').map(item => {
        return {id: item.tag.id, name: item.tag.name.value}
      });

      return sports;
    }catch(e) {
      console.error(e);
      process.exit(-1);
    }

  }

  // https://sports.ma.betmgm.com/cds-api/offer-grouping/grid-view/all?x-bwin-accessid=OWEyNDIxNjctYzIzNC00MGE4LWIxODMtMTMyNzIyNTQ5ZDVk&lang=en-us&country=US&usercountry=US

  private async getClientConfig(): Promise<IBwinClientConfig> {
    if(this._clientConfig) {
      return this._clientConfig;
    }

    const url = `${BASE_URL}/en/api/clientconfig`;
    try {
      const result = await axios.get<IBwinClientConfig>(url, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
        }});
      this._clientConfig = result.data;
    }catch(e) {
      console.error(e);
      process.exit(-1);
    }

    return this._clientConfig;
  }
}