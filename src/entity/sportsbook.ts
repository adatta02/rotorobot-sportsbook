import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ContestBetOdds} from "./contestBetOdds";

@Entity()
export class Sportsbook {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @Column({ nullable: false })
  name: string;

  @OneToMany(() => ContestBetOdds, (odds) => odds.sportsbook)
  contestOdds!: ContestBetOdds[];
}