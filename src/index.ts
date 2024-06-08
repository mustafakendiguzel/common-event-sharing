import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import loadRouters from './loaders/routes';
import { PostgreSqlService } from './libs/db/postgresql.service';
import { getDataSource } from '../data.source';
import { customErrorHandler } from './helpers/error-handle/handle.errors';
import { verifyToken } from './helpers/middlewares/verify-user.middleware';
import path from 'path';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;

app.use(getDataSource(3000));

app.use('/uploads', express.static(path.resolve('../uploads')));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome The Muti & Sude Final Project!');
});

app.use('/api', loadRouters);

app.use(customErrorHandler);

const postgreSqlService = new PostgreSqlService();

postgreSqlService.onModuleInit();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
