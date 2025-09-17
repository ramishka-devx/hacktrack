import { Router } from 'express';
import { TaskController } from './task.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  taskParamsSchema, 
  contestTasksParamsSchema
} from './task.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

// Get all tasks for a specific contest
router.get(
  '/',
  authMiddleware,
  validate(contestTasksParamsSchema),
  TaskController.getByContestId
);

// Create a new task in a contest
router.post(
  '/',
  authMiddleware,
  validate(createTaskSchema),
  TaskController.create
);

// Get a specific task by ID within a contest
router.get(
  '/:task_id',
  authMiddleware,
  validate(taskParamsSchema),
  TaskController.getById
);

// Update a task within a contest
router.put(
  '/:task_id',
  authMiddleware,
  validate(updateTaskSchema),
  TaskController.update
);

// Delete a task within a contest
router.delete(
  '/:task_id',
  authMiddleware,
  validate(taskParamsSchema),
  TaskController.remove
);

export default router;