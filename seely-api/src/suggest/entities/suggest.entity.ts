import { Series } from '@app/series/entities/series.entity';
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('suggest')
export class Suggest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  series_id: number;

  @ManyToOne(() => Series)
  @JoinColumn({ name: 'series_id', referencedColumnName: 'id' })
  series: Series;

  @Column()
  score: number;

  @Column({ nullable: true })
  comment: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
