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
  title: string;

  @Column({ nullable: false })
  type: string;

  @Column({ nullable: false })
  key: string;

  @ManyToOne(() => Contest, (contest) => contest.contestBets, {
    onDelete: 'CASCADE',
  })
  contest: Contest;

  @OneToMany(() => ContestBetOdds, (odds) => odds.contestBet)
  contestOdds!: ContestBetOdds[];
}