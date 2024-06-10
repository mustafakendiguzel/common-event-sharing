import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserModel } from '../../user/models/user.model';
import { EventPhotoModel } from './event-photo.model';

@Entity('event')
export class EventModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  publisherId: string;

  @ManyToOne(() => UserModel, (user) => user, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  publisher: UserModel;

  @Column()
  latCord: string;

  @Column()
  longCord: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  desc: string;

  @Column({ type: 'boolean', default: true })
  isPublic: boolean;

  @Column({ type: 'boolean', default: false })
  isTagProcessFinish: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @OneToMany(() => EventPhotoModel, (eventPhoto) => eventPhoto.event, {
    onDelete: 'CASCADE',
  })
  eventPhotos: EventPhotoModel[];
}
