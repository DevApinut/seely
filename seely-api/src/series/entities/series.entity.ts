import { Rating } from '@app/rating/entities/rating.entity';
import { User } from '@app/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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

  @Column()
  review: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 })
  score: number;

  @Column({ name: 'image_url' })
  imageUrl: string;

  @ManyToOne(() => Rating)
  @JoinColumn({ name: 'rating_id', referencedColumnName: 'id' })
  rating: Rating;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'username', referencedColumnName: 'username' })
  user: User;

}
