import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserModel } from '../../user/models/user.model';

@Entity('profile_photo')
export class ProfilePhotoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @ManyToOne(() => UserModel, (user) => user.profilePhotos, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: UserModel;
}
