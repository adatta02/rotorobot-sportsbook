import {CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
import {Sportsbook} from "./sportsbook";
import {Contest} from "./contest";

@Entity()
export class ContestOdds {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @ManyToOne(() => Sportsbook, (sportsbook) => sportsbook.contestOdds, {
    onDelete: 'CASCADE',
  })
  sportsbook: Sportsbook;

  @ManyToOne(() => Contest, (contest) => contest.contestOdds, {
    onDelete: 'CASCADE',
  })
  contest: Contest;
}