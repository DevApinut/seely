import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('ratings')
export class Rating {
    
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
