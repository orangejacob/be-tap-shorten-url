import * as bcrypt from 'bcrypt';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  hashed_password: string;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.hashed_password);
  }
}
