import { Rating } from '@app/rating/entities/rating.entity';
import { Suggest } from '@app/suggest/entities/suggest.entity';
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'series' })
export class Series {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  year: number;

  @OneToMany(() => Suggest, (suggest) => suggest.series)
  suggests: Suggest[];

  @Column({ default: '' })
  review: string;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Rating, { nullable: true })
  @JoinColumn({ name: 'rating_id', referencedColumnName: 'id' })
  rating: Rating;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

  // Virtual columns for aggregated data
  totalSuggests?: number;
  averageScore?: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
