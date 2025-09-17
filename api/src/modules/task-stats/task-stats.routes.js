import { Router } from 'express';
import { TaskStatsController } from './task-stats.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { 
  contestStatsParamsSchema, 
  userStatsParamsSchema, 
  leaderboardQuerySchema 
} from './task-stats.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';

const router = Router({ mergeParams: true });

// Get overall contest statistics
router.get(
  '/overall',
  authMiddleware,
  validate(contestStatsParamsSchema),
  TaskStatsController.getContestOverallStats
);

// Get task completion statistics for a contest
router.get(
  '/tasks',
  authMiddleware,
  validate(contestStatsParamsSchema),
  TaskStatsController.getContestTaskStats
);

// Get contest leaderboard
router.get(
  '/leaderboard',
  authMiddleware,
  validate(leaderboardQuerySchema),
  TaskStatsController.getContestLeaderboard
);

// Get current user's task statistics in a contest
router.get(
  '/my-tasks',
  authMiddleware,
  validate(contestStatsParamsSchema),
  TaskStatsController.getCurrentUserTaskStats
);

// Get current user's detailed statistics in a contest
router.get(
  '/my-stats',
  authMiddleware,
  validate(contestStatsParamsSchema),
  TaskStatsController.getCurrentUserDetailedStats
);

// Get specific user's task statistics in a contest
router.get(
  '/users/:user_id/tasks',
  authMiddleware,
  validate(userStatsParamsSchema),
  TaskStatsController.getUserTaskStats
);

// Get specific user's detailed statistics in a contest
router.get(
  '/users/:user_id/stats',
  authMiddleware,
  validate(userStatsParamsSchema),
  TaskStatsController.getUserDetailedStats
);

export default router;