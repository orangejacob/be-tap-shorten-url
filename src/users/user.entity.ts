import * as bcrypt from 'bcrypt';
import { Exclude, instanceToPlain } from 'class-transformer';
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

  @Exclude({ toPlainOnly: true })
  @Column()
  hashed_password: string;

  @OneToMany(() => Url, (url) => url.user)
  urls: Url[];

  @CreateDateColumn()
  created_at: Date;

  toJSON() {
    return instanceToPlain(this);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashed_password);
  }
}
