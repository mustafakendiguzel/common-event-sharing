import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser, { json } from 'body-parser';
import multer from 'multer';
import path from 'path';
import loadRouters from './loaders/routes';
import { PostgreSqlService } from './libs/db/postgresql.service';
import { getDataSource } from '../data.source';
import { customErrorHandler } from './helpers/error-handle/handle.errors';
import { verifyToken } from './helpers/middlewares/verify-user.middleware';

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
const postgreSqlService = new PostgreSqlService();
postgreSqlService.onModuleInit();

// Start server
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
