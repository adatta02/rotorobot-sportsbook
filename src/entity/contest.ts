import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";

@Entity()
export class Contest {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false, unique: true })
  key: string;

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
}