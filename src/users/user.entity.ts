import * as bcrypt from 'bcrypt';
import { Url } from 'src/urls/urls.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hashed_password: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @CreateDateColumn()
  created_at: Date;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashed_password);
  }
}
