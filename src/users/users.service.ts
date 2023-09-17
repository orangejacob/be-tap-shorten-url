import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  getUser(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  createUser(username: string, hashed_password: string): Promise<User | null> {
    return this.usersRepository.save({ username, hashed_password });
  }

  updateRefreshToken(
    username: string,
    refreshToken: string | null,
  ): Promise<UpdateResult | null> {
    return this.usersRepository.update({ username }, { refreshToken });
  }
}
