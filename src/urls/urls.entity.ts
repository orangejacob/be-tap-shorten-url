import { Exclude, instanceToPlain } from 'class-transformer';
import { User } from 'src/users/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  shortcode: string;

  @Column()
  original: string;

  @Exclude({ toPlainOnly: true })
  @ManyToOne(() => User, (user) => user.urls)
  user: User;

  @Column({ type: 'boolean', default: false })
  saved: boolean;

  @Column({ default: 0 })
  views: number;

  @CreateDateColumn()
  created_at: Date;

  toJSON() {
    return instanceToPlain(this);
  }
}
