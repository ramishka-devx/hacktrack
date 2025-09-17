dotenv.config();

import dotenv from 'dotenv';
dotenv.config();

class Config {
  constructor() {
    if (!Config.instance) {
      Config.instance = this;
      this.env = {
        port: process.env.PORT || 3000,
        nodeEnv: process.env.NODE_ENV || 'development',
        db: {
          host: process.env.DB_HOST || 'localhost',
          port: Number(process.env.DB_PORT || 3306),
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'machine_cure',
        },
        jwt: {
          secret: process.env.JWT_SECRET || 'dev-secret',
          expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        },
        rateLimit: {
          windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
          max: Number(process.env.RATE_LIMIT_MAX || 100),
        }
      };
    }
    return Config.instance;
  }
}

const configInstance = new Config();
export const env = configInstance.env;
