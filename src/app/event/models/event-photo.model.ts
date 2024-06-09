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
import { EventModel } from './event.model';
import { EventUserModel } from './event-user.model';

@Entity('event_photo')
export class EventPhotoModel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  path: string;

  @Column({ type: 'uuid', nullable: false })
  @Index()
  eventId: string;

  @ManyToOne(() => EventModel, (event) => event.eventPhotos, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  event: EventModel;

  @OneToMany(() => EventUserModel, (eventUser) => eventUser.eventPhoto, {
    onDelete: 'CASCADE',
  })
  eventUsers: EventUserModel[];
}
