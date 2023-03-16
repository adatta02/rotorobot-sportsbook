import {ContestBetDto} from "./contestBet.dto";

export class ContestDto {
  id: string;
  startTime: Date;
  isLive: boolean;
  title: string;
  contestantOne: string;
  contestantTwo: string;
  bets: ContestBetDto[];
  source?: unknown;
}
