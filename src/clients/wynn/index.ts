import axios from 'axios';
import * as moment from 'moment';
import {ISport} from "../types";
import {IWynnCategoryResponse, IWynnSportsOdds, IWynnSportsResponseEntry} from "./types";
import {ContestDto} from "../../dto/contestDto";
import {ContestBetDto} from "../../dto/contestBet.dto";
import {log} from "../../utils/logger";
const uniqid = require('uniqid');

const BET_TYPE_MAP = {
  'Handicap (2 Way)': 'Spread',
  'Money Line': 'Money Line',
  'Total Points Over/Under': 'Totals',
  'Fight Result (Draw No Bet)': 'Money Line'
};

// All sports are
/*
[
  { id: '45', name: 'Basketball' },
  { id: '61', name: 'Hockey' },
  { id: '33', name: 'Soccer' },
  { id: '5', name: 'Tennis' },
  { id: '75', name: 'Baseball' },
  { id: '27', name: 'Auto Racing' },
  { id: '28', name: 'Football' },
  { id: '392', name: 'Boxing' },
  { id: '3', name: 'Golf' },
  { id: '67', name: 'MMA' },
  { id: '32', name: 'Formula 1' },
  { id: '4', name: 'Darts' },
  { id: '15', name: 'Australian Rules' }
]
 */

// Looks like this is built on https://www.whitehatgaming.com/
export class Wynn {

  public static readonly NAME = "Wynn";

  private sportCompetitionList = [
    {label: 'Basketball', sportId: '45'},
    /*{label: 'NHL', sportId: '61'},
    {label: 'PGA', sportId: '3'},
    {label: 'Darts', sportId: '4'},
    {label: 'MMA', sportId: '67'},*/
  ];

  public async getAllGames(): Promise<ContestDto[]> {
    let games: ContestDto[] = [];
    for(const s of this.getActivatedSports()) {
      const matches = await this.getMatches(s.sportId);
      games = games.concat(matches);
    }
    return games;
  }

  public getActivatedSports() {
    return this.sportCompetitionList;
  }

  public async getMatches(categoryId: string): Promise<ContestDto[]> {
    const url = `https://fo.wynnbet-ma-web.gansportsbook.com/s/sbgate/sports/fo-category/?categoryId=${categoryId}&country=US&isMobile=0&language=us&layout=AMERICAN&limit=6&province`;
    try {
      const result = await axios.get<IWynnSportsResponseEntry[]>(url, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
        }});

      const marketIds: number[][] = [];
      for(const item of result.data) {
        for(const itemMatches of item.matches) {
          const ids = itemMatches.markets.map(f => f.id);
          marketIds.push(ids);
        }
      }

      const oddsUrl = `https://fo.wynnbet-ma-web.gansportsbook.com/s/sb-odds/odds/current/fo-line/`;
      const oddsResult = await axios.post<Record<string, IWynnSportsOdds>>(oddsUrl, {marketIds, drawOutcomes: {}}, {headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)'
      }});

      const contests: ContestDto[] = [];
      for(const item of result.data) {

        for(const itemMatches of item.matches) {

          // TODO: Normalize these team names
          const awayTeamName = itemMatches.away_team_name.replace('St.', 'State');
          const homeTeamName = itemMatches.home_team_name.replace('St.', 'State');

          const bets: ContestBetDto[] = [];

          for (const game of itemMatches.markets) {
            if (game.status !== 'OPEN'
              || !game.outcomes
              || game.outcomes.length < 2) {
              continue;
            }

            const pair = uniqid();

            if (game.name === 'Handicap (2 Way)') {
              let lineStr = '';
              if (game.raw_line > 0) {
                lineStr = `+${game.raw_line}`;
              } else {
                lineStr = `${game.raw_line}`;
              }

              const inverseLine = -1 * game.raw_line;
              let inverseLineStr = '';
              if (inverseLine > 0) {
                inverseLineStr = `+${inverseLine}`;
              } else {
                inverseLineStr = `${inverseLine}`;
              }

              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `${awayTeamName} ${inverseLineStr}`,
                odds: oddsResult.data[game.outcomes[0].id].value
              });

              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `${homeTeamName} ${lineStr}`,
                odds: oddsResult.data[game.outcomes[1].id].value
              });

            } else if (game.name === 'Money Line' || game.name === 'Fight Result (Draw No Bet)') {
              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `${awayTeamName}`,
                odds: oddsResult.data[game.outcomes[0].id].value
              });

              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `${homeTeamName}`,
                odds: oddsResult.data[game.outcomes[1].id].value
              });
            } else if (game.name === 'Total Points Over/Under') {
              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `Over ${game.line}`,
                odds: oddsResult.data[game.outcomes[0].id].value
              });

              bets.push({
                pairId: pair,
                type: BET_TYPE_MAP[game.name],
                title: `Under ${game.line}`,
                odds: oddsResult.data[game.outcomes[1].id].value
              });
            }
          }


          contests.push({
            id: `${itemMatches.id}`,
            title: itemMatches.name,
            contestantOne: homeTeamName,
            contestantTwo: awayTeamName,
            startTime: moment(itemMatches.match_start).toDate(),
            isLive: itemMatches.inplay,
            bets: bets
          });
        }
      }
      return contests;
    }catch(e) {
      console.error(e);
      process.exit(-1);
    }

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