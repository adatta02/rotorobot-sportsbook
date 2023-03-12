// NOTE: BetMGM is a white label of Bwin, https://sports.bwin.com/en/sports
import axios from 'axios';
import {
  IBwinBatchLobby,
  IBwinBettingOffer,
  IBwinClientConfig,
  IBwinCompetitionLobby,
  IBwinCompetitionLobbyWidgetFixtureDetail
} from "./types";
import {ISport} from "../types";
import {ContestDto} from "../../dto/contestDto";
import * as moment from 'moment';
import {ContestBetDto} from "../../dto/contestBet.dto";

const BASE_URL = 'https://sports.ma.betmgm.com';

export class BetMGM {

  private _clientConfig: IBwinClientConfig;

  // https://sports.ma.betmgm.com/en/sports/api/widget?layoutSize=Large&page=CompetitionLobby&sportId=7&regionId=9&competitionId=264&compoundCompetitionId=1:264&forceFresh=1
  // https://sports.ma.betmgm.com/en/sports/api/widget?layoutSize=Large&page=SportLobby&sportId=4&forceFresh=1
  // https://sports.ma.betmgm.com/en/sports/api/widget?layoutSize=Large&page=CompetitionLobby&sportId=12&regionId=9&competitionId=34&compoundCompetitionId=1:34&forceFresh=1

  public async getCollegeBasketballGames(): Promise<ContestDto[]> {
    try {
      const url = `https://sports.ma.betmgm.com/en/sports/api/widget?layoutSize=Large&page=CompetitionLobby&sportId=7&regionId=9&competitionId=264&compoundCompetitionId=1:264&forceFresh=1`;
      const result = await axios.get<IBwinCompetitionLobby>(url, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }});

      const payload = [{
        "layoutSize": "Large",
        "page": "CompetitionLobby",
        "sportId": 7,
        "regionId": 9,
        "competitionId": 264,
        "compoundCompetitionId": "1:264",
        "widgetId": "/mobilesports-v1.0/layout/layout_us/modules/competition/prematchevents"
      }];
      const urlBatch = `https://sports.ma.betmgm.com/en/sports/api/widget/batch?layoutSize=Large&page=CompetitionLobby&sportId=7&regionId=9&competitionId=264&compoundCompetitionId=1:264&forceFresh=1`;
      const resultBatch = await axios.post<IBwinBatchLobby>(urlBatch, payload, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'content-type': 'application/json',
          'origin': 'https://sports.ma.betmgm.com',
          'pragma': 'no-cache',
          'referer': 'https://sports.ma.betmgm.com/en/sports/basketball-7/betting/usa-9/ncaa-264',
          'sports-api-version': 'SportsAPIv1',

      }});

      const gamesToProcess: IBwinCompetitionLobbyWidgetFixtureDetail[] = [];
      for (const widget of result.data.widgets) {
        if (!widget.payload || !widget.payload.fixtures) {
          continue;
        }

        for (const item of widget.payload.fixtures) {
          gamesToProcess.push(item.fixture);
        }
      }

      for(const item of resultBatch.data.widgets) {
        for(const fixture of item.payload.fixtures) {
          gamesToProcess.push(fixture);
        }
      }

      const contests: ContestDto[] = [];
      for(const item of gamesToProcess) {
        const bets: ContestBetDto[] = [];
        for(const game of item.games) {
          for(const gameBet of game.results) {
            bets.push({
              type: game.name.value,
              title: gameBet.name.value,
              odds: gameBet.odds
            });
          }
        }

        contests.push({
          id: `${item.id}`,
          title: item.name.value,
          contestantOne: item.participants[0].name.value,
          contestantTwo: item.participants[1].name.value,
          startTime: moment(item.startDate).toDate(),
          isLive: item.liveAlert,
          bets: bets
        });
      }

      return contests;
    }catch(e) {
      console.error(e);
      process.exit(-1);
    }
  }

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