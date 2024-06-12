import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProfilePhotoModel } from '../../file/models/file.model';

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => ProfilePhotoModel, (profilePhoto) => profilePhoto.user, {
    onDelete: 'CASCADE',
  })
  profilePhotos: ProfilePhotoModel[];
}
