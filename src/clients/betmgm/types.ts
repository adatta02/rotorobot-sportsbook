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
  tag: {type: string, id: string, name: {value: string, sign: string}},
  live: number;
  preMatch: number;
  liveStreaming: number;
}