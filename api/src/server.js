import app from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const server = app.listen(env.port, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});

function shutdown() {
  logger.info('Shutting down...');
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
