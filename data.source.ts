import { NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'morphosium',
  database: 'postgres',
  entities: ['src/app/**/models/*.model.{js,ts}'],
  synchronize: true,
});

AppDataSource.initialize()
  .then(async () => {
    console.log('Connection initialized with database...');
  })
  .catch((error) => console.log(error));

export const getDataSource = (delay = 3000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (AppDataSource.isInitialized) {
      next();
    } else {
      res.status(400).send('Failed to create connection with database');
    }
  };
};
