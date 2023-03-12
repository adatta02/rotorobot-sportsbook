import {ContestBetDto} from "./contestBet.dto";

export class ContestDto {
  startTime: Date;
  isLive: boolean;
  title: string;
  contestantOne: string;
  contestantTwo: string;
  bets: ContestBetDto[];
}