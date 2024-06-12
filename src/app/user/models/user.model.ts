import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProfilePhotoModel } from '../../file/models/file.model';
import { Exclude } from 'class-transformer';

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => ProfilePhotoModel, (profilePhoto) => profilePhoto.user, {
    onDelete: 'CASCADE',
  })
  profilePhotos: ProfilePhotoModel[];
}
