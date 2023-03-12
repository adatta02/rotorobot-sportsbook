export interface IBwinValueSign {
  value: string;
  sign: string
}

export interface IBwinClientConfig {
  supportedSports: number[];
  msApp: {
    publicAccessId: string;
  },
  msNativeAlerts: {
    sports: IBwinClientConfigSport[];
  }
}

export interface IBwinClientConfigSport {
  id: number;
  name: string;
}

export interface IBwinMatchType {
  sitecoreKey: string;
  gridGroupId: string;
  name: string;
}

export interface IBwinBettingOffer {
  tag: {type: string, id: string, name: IBwinValueSign},
  live: number;
  preMatch: number;
  liveStreaming: number;
}

export interface IBwinBatchLobby {
  widgets: {
    payload: {
      fixtures: IBwinCompetitionLobbyWidgetFixtureDetail[];
    }
  }[]
}

export interface IBwinFixturesResponse {
  fixtures: IBwinCompetitionLobbyWidgetFixtureDetail[];
}

export interface IBwinCompetitionLobby {
  widgets: IBwinCompetitionLobbyWidget[];
}

export interface IBwinCompetitionLobbyWidget {
  payload: {
    fixtures: IBwinCompetitionLobbyWidgetFixture[];
  }
}

export interface IBwinCompetitionLobbyWidgetFixture {
  fixture: IBwinCompetitionLobbyWidgetFixtureDetail;
}

export interface IBwinCompetitionLobbyWidgetFixtureDetail {
  id: number;
  sourceId: number;
  stage: 'PreMatch';
  startDate: string; // 2023-03-11T23:00:00Z
  cutOffDate: string; // 2023-03-11T23:00:00Z
  sport: {
    type: string,
    id: number,
    name: IBwinValueSign
  }
  name: IBwinValueSign,
  description: IBwinValueSign,
  games: IBwinCompetitionLobbyWidgetFixtureDetailGame[];
  participants: IBwinCompetitionLobbyWidgetFixtureDetailParticipant[];
  competition: {
    parentLeagueId: number,
    statistics: boolean,
    sportId: number,
    compoundId: number,
    id: number,
    parentId: number,
    name: IBwinValueSign
  },
  liveAlert: boolean;
  scoreboard: {
    totalPoints: {
      player1: Record<string, string>,
      player2: Record<string, string>
    }
  }
}

export interface IBwinCompetitionLobbyWidgetFixtureDetailParticipant {
  participantId: number;
  name: {value: string, sign: string, short: string, shortSign: string},
}

export interface IBwinCompetitionLobbyWidgetFixtureDetailGame {
  id: number;
  name: IBwinValueSign;
  results: IBwinCompetitionLobbyWidgetFixtureDetailGameResult[];
  templateId: number;
  categoryId: number;
  resultOrder: string;
  combo1: string;
  combo2: string;
  visibility: 'Visible';
  balanced: number;
  spread: number;
  category: 'Gridable';
  attr: string;
}

export interface IBwinCompetitionLobbyWidgetFixtureDetailGameResult {
  id: number,
  odds: number,
  name: {value: 'Money Line' | 'Totals' | 'Spread', sign: string},
  sourceName: {value: string, sign: string},
  visibility: 'Visible',
  numerator: number,
  denominator: number,
  americanOdds: number,
}