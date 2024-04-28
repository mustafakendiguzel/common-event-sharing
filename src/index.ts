import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import loadRoutes from './loaders/routes';
import { connectDatabase } from './libs/config/db-connection';
dotenv.config();

const app: Express = express();
app.use(bodyParser.json());
const port = process.env.PORT || 3000;
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server');
});
loadRoutes(app);
connectDatabase();

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
