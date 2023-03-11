import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {ContestOdds} from "./contestOdds";

@Entity()
export class Contest {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;

  @Column({ nullable: true })
  startTime?: Date;

  @Column({ nullable: false })
  isLive: boolean;

  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  contestantOne: string;

  @Column({ nullable: false })
  contestantTwo: string;

  @Column({ nullable: false })
  contestantOneScore: string;

  @Column({ nullable: false })
  contestantTwoScore: string;

  @OneToMany(() => ContestOdds, (odds) => odds.contest)
  contestOdds!: ContestOdds[];
}