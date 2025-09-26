import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) 
    private readonly repository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    
    // create hash
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10)

    // replace hashed to password
    const user = {
      ...createUserDto,
      password: hashedPassword
    }

    // save new user with hashed password
    return this.repository.save(user);
  }

  findByUsername(username: string) {
    return this.repository.findOneByOrFail({ username })
  }

  async upsertByKeycloakId(username: string, keycloakId: string): Promise<User> {
    const result = await this.repository.upsert(
      { username, keycloakId },
      { conflictPaths: ['keycloakId'] }
    )
    console.log('upsert', result)
    return this.repository.findOneByOrFail({ keycloakId })
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}