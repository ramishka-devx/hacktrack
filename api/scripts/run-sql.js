import { env } from '../src/config/env.js';
import mysql from 'mysql2/promise';
import fs from 'fs';

(async function main() {
  try {
    const file = process.argv[2];
    if (!file) throw new Error('SQL file path required');
    const sql = fs.readFileSync(file, 'utf8');
    const connection = await mysql.createConnection({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      multipleStatements: true
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\``);
    await connection.changeUser({ database: env.db.database });
    await connection.query(sql);
    console.log('SQL executed for', file);
    await connection.end();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
