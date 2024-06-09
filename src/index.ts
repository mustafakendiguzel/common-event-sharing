import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import loadRouters from './loaders/routes';
import { getDataSource } from '../data.source';
import { customErrorHandler } from './helpers/error-handle/handle.errors';
import { RabbitMqService } from './libs/rabbitmq/rabbitmq.service';
import { EventService } from './app/event/event.service';
import e from 'express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  console.log(req.params); // populated!
  next();
});

// Database connection
app.use(async (req, res, next) => {
  try {
    await getDataSource();
    next();
  } catch (error) {
    next(error);
  }
});

// Static files
app.use(
  '/uploads',
  express.static(path.resolve(__dirname, '../libs/face_recognition'))
);

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome The Muti & Sude Final Project!');
});

app.use('/api', loadRouters);

// Error handler
app.use(customErrorHandler);

// Initialize database service
const eventService = new EventService();
const rabbitMqService = new RabbitMqService(eventService);
rabbitMqService.connectRabbitMq().then(async () => {
  console.log('RabbitMq connected');
  await rabbitMqService.initializeQueues();
  await rabbitMqService.consumeTrainPhotos();
  await rabbitMqService.consumeTagsPhotoToEvent();
});

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
