import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  getUser(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  checkUserNameExists(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  createUser(username: string, hashed_password: string) {
    return this.usersRepository.save({ username, hashed_password });
  }
}
