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

  @Column({ nullable: false, type: "decimal", precision: 4, scale: 2 })
  odds: number;

  @Column({ nullable: false })
  isLatest: boolean;

  @ManyToOne(() => Sportsbook, (sportsbook) => sportsbook.contestOdds, {
    onDelete: 'CASCADE',
  })
  sportsbook: Sportsbook;

  @ManyToOne(() => ContestBet, (contestBet) => contestBet.contestOdds, {
    onDelete: 'CASCADE',
  })
  contestBet: ContestBet;
}