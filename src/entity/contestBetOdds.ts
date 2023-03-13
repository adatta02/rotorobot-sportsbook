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

  @Column({ nullable: false, type: "decimal", precision: 6, scale: 2 })
  odds: number;

  @Column({ nullable: false })
  isLatest: boolean;

  @Column({ nullable: false })
  isArb: boolean;

  @Column({ nullable: true, type: "decimal", precision: 6, scale: 4 })
  arbEv: number;

  @ManyToOne(() => Sportsbook, (sportsbook) => sportsbook.contestOdds, {
    onDelete: 'CASCADE',
    eager: true,
  })
  sportsbook: Sportsbook;

  @ManyToOne(() => ContestBet, (contestBet) => contestBet.contestOdds, {
    onDelete: 'CASCADE',
    eager: true
  })
  contestBet: ContestBet;

}
