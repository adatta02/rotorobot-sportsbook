import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ContestBetOdds} from "./contestBetOdds";

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

  @OneToMany(() => ContestBetOdds, (odds) => odds.contestBet)
  contestOdds!: ContestBetOdds[];
}