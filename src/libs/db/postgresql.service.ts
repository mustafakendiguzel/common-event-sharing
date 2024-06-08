import { createConnection } from 'typeorm';

import { Client } from 'pg';

export class PostgreSqlService {
  constructor() {}

  private readonly db = new Client({
    database: 'postgres',
    host: 'localhost',
    user: 'postgres',
    password: 'morphosium',
    port: 5432,
  });

  onModuleInit() {
    this.connection();
  }

  private async connection() {
    createConnection()
      .then(() => {
        console.log('Connected to database');
      })
      .catch((error) => {
        console.log('Error connecting to database:', error);
      });
  }

  public async query(query: string) {
    return await this.db.query(query);
  }
}
