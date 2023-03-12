export interface IWynnCategoryResponse {
  children: IWynnCategorySport[];
}

export interface IWynnCategorySport {
  country_code: string;
  depth: number;
  fullSlug: string;
  id: number;
  name: string;
  slug: string;
  sport_category_id: number;
  children: IWynnCategorySportChild[];
}

export interface IWynnCategorySportChild {
  depth: number;
  fullSlug: string;
  id: number;
  name: string;
  slug: string;
  sport_category_id: number;
  matches_count: number;
}

export interface IWynnSportsResponseEntry {
  id: number;
  sport_id: number;
  parent_category_id: number;
  name: string;
  matches: IWynnSportsResponseContest[];
}

export interface IWynnSportsResponseContest {
  id: number;
  match_start: string; // 2023-03-12T16:00:00+00:00
  betting_start: string;
  betting_end: string;
  expected_result_time: string;
  status: 'LIVE';
  match_type?: null;
  category_id: number;
  category_name: string;
  scorecenter_available: boolean;
  scoreboard_available: boolean;
  has_genius_stream: boolean;
  livebet_our: boolean;
  sport_category: number;
  sport: number;
  sport_name: string;
  home_team_name: string;
  away_team_name: string;
  home_team_short_name: string;
  away_team_short_name: string;
  home_team_logo_name: string;
  away_team_logo_name: string;
  name: string;
  external_comment?: null;
  inplay: boolean;
  external_id: number;
  betgenius_id: number;
  scoreboard_url?: null;
  layout: string;
  prefer_half_lines: boolean;
  region_category_id: number;
  stream_info?: null;
  betbuilder_id: number;
  sport_position: number;
  position_score: number;
  locale: string;
  excluded_countries?: (null)[] | null;
  markets:
}

export interface IWynnSportsSequence {
  sequence: number;
}

export interface IWynnSportsOutcomesEntity {
  id: number;
  status: string;
  result_key: string;
  name: string;
  has_trading_position: boolean;
}

export interface IWynnSportsResponseBet {
  id: number;
  sequence: IWynnSportsSequence;
  name: string;
  status: string;
  line: string;
  view_type: string;
  market_type_id: number;
  team_names?: null;
  player_names?: null;
  provider: number;
  outcomes?: IWynnSportsOutcomesEntity[];
  raw_line: number;
}