import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventPhotoModel } from './event-photo.model';
import { UserModel } from '../../user/models/user.model';

@Entity('event_user')
export class EventUserModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  xCord1: number;

  @Column()
  xCord2: number;

  @Column()
  yCord: number;

  @Column()
  yCord2: number;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  eventPhotoId: string;

  @ManyToOne(() => EventPhotoModel, (eventPhoto) => eventPhoto.eventUsers, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  eventPhoto: EventPhotoModel;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  userId: string;

  @ManyToOne(() => UserModel, (user) => user, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: UserModel;
}
