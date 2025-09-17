import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './docs/swagger.js';
import { env } from './config/env.js';
import { errorMiddleware } from './middleware/errorMiddleware.js';
import morgan from 'morgan'

// Routes
import userRoutes from './modules/users/user.routes.js';
import taskRoutes from './modules/tasks/task.routes.js';


const app = express();

// Security & basics
app.use(helmet());
app.use(cors());
app.use(morgan('dev'))
app.use(express.json());
app.use(rateLimit({ windowMs: env.rateLimit.windowMs, max: env.rateLimit.max }));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/contests/:contest_id/tasks', taskRoutes);


// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handler
app.use(errorMiddleware);

export default app;
