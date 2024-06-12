import amqp from 'amqplib';
import { exec } from 'child_process';
import { config } from 'dotenv';
import { EventService } from '../../app/event/event.service';

const queues = ['train-photos', 'tag-photo-to-event'];

config();

export class RabbitMqService {
  public channel: amqp.Channel;

  constructor(private readonly eventService: EventService) {}

  public async connectRabbitMq() {
    try {
      const connection = await amqp.connect(
        process.env.RABBITMQ_CLIENT_URL as string
      );
      this.channel = await connection.createChannel();
    } catch (err) {
      console.warn(err);
    }
  }

  public async initializeQueues() {
    queues.forEach(async (queue) => {
      await this.channel.assertQueue(queue, { durable: false });
    });
  }

  public async sendToQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }

  public async consumeTrainPhotos() {
    try {
      await this.trainPhotos();

      await this.channel.consume(
        queues[0],
        this.handleTrainPhotoMessage.bind(this),

        {
          noAck: false,
        }
      );

      console.log(
        ' [*] Waiting for consumeTrainPhotos messages. To exit press CTRL+C'
      );
    } catch (err) {
      console.warn(err);
    }
  }

  public async handleTagsPhotoEventMessage(
    message: amqp.ConsumeMessage | null
  ) {
    if (message) {
      console.log(" [x] Received '%s'", JSON.parse(message.content.toString()));
      const content: {
        eventId: string;
        fileName: string;
        eventPhotoId: string;
      } = JSON.parse(message.content.toString());

      try {
        const response = await this.tagPhotoToEvent(
          content.eventId,
          content.fileName
        );
        console.log('🚀 ~ RabbitMqService ~ response:', response);

        response.userId.forEach(async (userId: string, index: number) => {
          if (userId === 'Unknown' || userId === '') {
            return;
          }

          await this.eventService.createEventUser({
            eventPhotoId: content.eventPhotoId,
            userId,
            xCord1: response.xCord1[index],
            xCord2: response.xCord2[index],
          });
        });

        await this.eventService.updateEvent(content.eventId, {
          isTagProcessFinish: true,
        });

        this.channel.ack(message);

        console.log('🚀 ~ RabbitMqService ~ response:', response);
      } catch (err) {
        console.warn('Training failed, message will not be acked:', err);
      }
    }
  }

  public async handleTrainPhotoMessage(message: amqp.ConsumeMessage | null) {
    if (message) {
      console.log(" [x] Received '%s'", JSON.parse(message.content.toString()));

      try {
        await this.trainPhotos().then(() => {
          this.channel.ack(message);
        });
      } catch (err) {
        console.warn('Training failed, message will not be acked:', err);
      }
    }
  }

  public async consumeTagsPhotoToEvent() {
    try {
      await this.channel.consume(
        queues[1],
        this.handleTagsPhotoEventMessage.bind(this),
        {
          noAck: false,
        }
      );

      console.log(
        ' [*] Waiting for consumeTagsPhotoToEvent messages. To exit press CTRL+C'
      );
    } catch (err) {
      console.warn(err);
    }
  }

  public async trainPhotos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log(' [x] Training photos on node.js side');
      exec(
        'python3 src/libs/face_recognition/detector.py --train -m="hog"',
        (error, stdout, stderr) => {
          if (error) {
            console.error(`Hata oluştu: ${error.message}`);
            reject(error);
            return;
          }
          if (stderr) {
            console.error(`Hata çıktısı: ${stderr}`);
            reject(new Error(stderr));
            return;
          }
          console.log(`Python çıktısı: ${stdout}`);
          resolve();
        }
      );
    });
  }

  public async tagPhotoToEvent(
    eventId: string,
    photoName: string
  ): Promise<{ userId: string[]; xCord1: number[]; xCord2: number[] }> {
    return new Promise((resolve, reject) => {
      const pythonScriptPath = `python3 src/libs/face_recognition/detector.py --test -f src/libs/face_recognition/testing/${eventId}/${photoName}`;

      exec(pythonScriptPath, (error, stdout, stderr) => {
        if (error) {
          console.error(`Hata oluştu: ${error.message}`);
          reject(error.message);
        } else if (stderr) {
          console.error(`Hata çıktısı: ${stderr}`);
          reject(stderr);
        } else {
          console.log(`Python çıktısı: ${stdout}`);
          resolve(JSON.parse(stdout));
        }
      });
    });
  }

  public async checkQueueCount(queue: string): Promise<number> {
    try {
      const queueStatus = await this.channel.checkQueue(queue);
      const unAckedCount = queueStatus.messageCount - queueStatus.consumerCount;
      return unAckedCount;
    } catch (err) {
      console.warn(err);
      return 0;
    }
  }
}
