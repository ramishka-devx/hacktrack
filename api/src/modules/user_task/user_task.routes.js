import { Router } from 'express';
import { UserTaskController } from './user_task.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { 
  assignContestTasksSchema,
  getUserContestTasksSchema,
  getUserTasksSchema,
  getUserTaskSchema,
  updateTaskStatusSchema,
  assignSingleTaskSchema,
  removeUserTaskSchema,
  checkTaskAccessSchema,
  submitAnswerSchema,
  getUserAnswerSchema
} from './user_task.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

// Routes for contest-specific user tasks (nested under /contests/:contest_id)
export const contestUserTaskRoutes = Router({ mergeParams: true });

// Assign all contest tasks to the authenticated user
contestUserTaskRoutes.post(
  '/assign',
  authMiddleware,
  validate(assignContestTasksSchema),
  UserTaskController.assignContestTasks
);

// Get user's tasks for a specific contest
contestUserTaskRoutes.get(
  '/',
  authMiddleware,
  validate(getUserContestTasksSchema),
  UserTaskController.getUserContestTasks
);

// Get specific user task details
contestUserTaskRoutes.get(
  '/:task_id',
  authMiddleware,
  validate(getUserTaskSchema),
  UserTaskController.getUserTask
);

// Update user task status
contestUserTaskRoutes.put(
  '/:task_id/status',
  authMiddleware,
  validate(updateTaskStatusSchema),
  UserTaskController.updateTaskStatus
);

// Assign a single task to the authenticated user
contestUserTaskRoutes.post(
  '/:task_id/assign',
  authMiddleware,
  validate(assignSingleTaskSchema),
  UserTaskController.assignSingleTask
);

// Remove user task assignment
contestUserTaskRoutes.delete(
  '/:task_id',
  authMiddleware,
  validate(removeUserTaskSchema),
  UserTaskController.removeUserTask
);

// Check if user has access to a task
contestUserTaskRoutes.get(
  '/:task_id/access',
  authMiddleware,
  validate(checkTaskAccessSchema),
  UserTaskController.checkTaskAccess
);

// Submit answer for a user task
contestUserTaskRoutes.post(
  '/:task_id/submit-answer',
  authMiddleware,
  validate(submitAnswerSchema),
  UserTaskController.submitAnswer
);

// Get user's submitted answer for a task
contestUserTaskRoutes.get(
  '/:task_id/answer',
  authMiddleware,
  validate(getUserAnswerSchema),
  UserTaskController.getUserAnswer
);

// Routes for general user tasks (not contest-specific)
export const userTaskRoutes = Router();

// Get all user's tasks across all contests
userTaskRoutes.get(
  '/',
  authMiddleware,
  validate(getUserTasksSchema),
  UserTaskController.getUserTasks
);

export default router;