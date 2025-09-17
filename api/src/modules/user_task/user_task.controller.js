import { success } from '../../utils/apiResponse.js';
import { UserTaskService } from './user_task.service.js';
import { verifyToken } from '../../utils/jwtHelper.js';

export const UserTaskController = {
  /**
   * Assign all contest tasks to the authenticated user
   * POST /api/contests/:contest_id/user-tasks/assign
   */
  async assignContestTasks(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const contest_id = Number(req.params.contest_id);

      const result = await UserTaskService.assignContestTasksToUser(user_id, contest_id);
      return success(res, result, result.message, 201);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Get user's tasks for a specific contest
   * GET /api/contests/:contest_id/user-tasks
   */
  async getUserContestTasks(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const contest_id = Number(req.params.contest_id);

      const result = await UserTaskService.getUserContestTasks(user_id, contest_id);
      return success(res, result);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Get all user's tasks across all contests
   * GET /api/user-tasks
   */
  async getUserTasks(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const { page = 1, limit = 10 } = req.query;

      const result = await UserTaskService.getUserTasks(user_id, {
        page: Number(page),
        limit: Number(limit)
      });
      return success(res, result);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Get specific user task details
   * GET /api/contests/:contest_id/user-tasks/:task_id
   */
  async getUserTask(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);

      const result = await UserTaskService.getUserTask(user_id, task_id);
      return success(res, result);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Update user task status
   * PUT /api/contests/:contest_id/user-tasks/:task_id/status
   */
  async updateTaskStatus(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);
      const { status, score, submitted_at } = req.body;

      const additional_data = {};
      if (score !== undefined) additional_data.score = score;
      if (submitted_at) additional_data.submitted_at = submitted_at;

      const result = await UserTaskService.updateTaskStatus(user_id, task_id, status, additional_data);
      return success(res, result, result.message);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Assign a single task to the authenticated user
   * POST /api/contests/:contest_id/user-tasks/:task_id/assign
   */
  async assignSingleTask(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);
      const { status = 'assigned' } = req.body;

      const result = await UserTaskService.assignTaskToUser(user_id, task_id, status);
      return success(res, result, result.message, result.existing ? 200 : 201);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Remove user task assignment
   * DELETE /api/contests/:contest_id/user-tasks/:task_id
   */
  async removeUserTask(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);

      const result = await UserTaskService.removeUserTask(user_id, task_id);
      return success(res, result, result.message);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Check if user has access to a task
   * GET /api/contests/:contest_id/user-tasks/:task_id/access
   */
  async checkTaskAccess(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);

      const hasAccess = await UserTaskService.checkTaskAccess(user_id, task_id);
      return success(res, { 
        user_id, 
        task_id, 
        hasAccess,
        message: hasAccess ? 'User has access to this task' : 'User does not have access to this task'
      });
    } catch (e) {
      next(e);
    }
  },

  /**
   * Submit answer for a user task
   * POST /api/contests/:contest_id/user-tasks/:task_id/submit-answer
   */
  async submitAnswer(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);
      const { answer } = req.body;

      const result = await UserTaskService.submitAnswer(user_id, task_id, answer);
      return success(res, result.data, result.data.message, 200);
    } catch (e) {
      next(e);
    }
  },

  /**
   * Get user's submitted answer for a task
   * GET /api/contests/:contest_id/user-tasks/:task_id/answer
   */
  async getUserAnswer(req, res, next) {
    try {
      const user_id = req.user.user_id;
      const task_id = Number(req.params.task_id);

      const result = await UserTaskService.getUserAnswer(user_id, task_id);
      return success(res, result);
    } catch (e) {
      next(e);
    }
  }
};