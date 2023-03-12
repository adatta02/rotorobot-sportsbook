import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Sportsbook} from "./sportsbook";
import {Contest} from "./contest";
import {ContestBet} from "./contestBet";

@Entity()
export class ContestBetOdds {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Column({ nullable: false, type: "float" })
  odds: number;

  @ManyToOne(() => Sportsbook, (sportsbook) => sportsbook.contestOdds, {
    onDelete: 'CASCADE',
  })
  sportsbook: Sportsbook;

  @ManyToOne(() => ContestBet, (contestBet) => contestBet.contestOdds, {
    onDelete: 'CASCADE',
  })
  contestBet: ContestBet;
}