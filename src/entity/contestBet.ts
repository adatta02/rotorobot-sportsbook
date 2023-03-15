import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ContestBetOdds} from "./contestBetOdds";
import {Contest} from "./contest";

@Entity()
export class ContestBet {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @Column({ nullable: false })
  pairId: string;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  key: string;

  @Column({ nullable: false })
  isLatest: boolean;

  @ManyToOne(() => Contest, (contest) => contest.contestBets, {
    onDelete: 'CASCADE',
    eager: true
  })
  contest: Contest;

  @OneToMany(() => ContestBetOdds, (odds) => odds.contestBet)
  contestOdds!: ContestBetOdds[];
}