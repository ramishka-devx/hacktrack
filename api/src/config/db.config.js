
import mysql from 'mysql2/promise';
import { env } from './env.js';

class DB {
  constructor() {
    if (!DB.instance) {
      DB.instance = this;
      this.pool = mysql.createPool({
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        dateStrings: true
      });
    }
    return DB.instance;
  }

  async query(sql, params) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
}

const dbInstance = new DB();
export const query = dbInstance.query.bind(dbInstance);
