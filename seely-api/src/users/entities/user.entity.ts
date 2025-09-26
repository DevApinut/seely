import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: false,
  })
  username: string;

  @Column({
    nullable: true
  })  
  password: string;

  @Column({
    nullable: false,
    default: Role.USER,
  })
  role: Role

  @Column({ name: 'keycloak_id', unique: true, nullable: true })
  keycloakId: string
}
