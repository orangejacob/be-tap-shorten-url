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

  @ManyToOne(() => User, (user) => user.urls)
  user: User;

  @Column({ type: 'boolean', default: false })
  saved: boolean;

  @CreateDateColumn()
  created_at: Date;
}
