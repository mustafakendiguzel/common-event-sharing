import authModule from '../app/auth/auth.module';
import { Express } from 'express';

export default (app: Express) => {
  app.use('/auth', authModule.router);
};
