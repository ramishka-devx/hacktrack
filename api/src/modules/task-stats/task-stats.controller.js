import { success } from '../../utils/apiResponse.js';
import { TaskStatsService } from './task-stats.service.js';

export const TaskStatsController = {
  async getContestTaskStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getContestTaskStats(Number(req.params.contest_id));
      return success(res, stats, 'Contest task statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getUserTaskStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getUserTaskStats(
        Number(req.params.user_id),
        Number(req.params.contest_id)
      );
      return success(res, stats, 'User task statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getCurrentUserTaskStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getUserTaskStats(
        req.user.user_id,
        Number(req.params.contest_id)
      );
      return success(res, stats, 'Your task statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getContestOverallStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getContestOverallStats(Number(req.params.contest_id));
      return success(res, stats, 'Contest overall statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getContestLeaderboard(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const leaderboard = await TaskStatsService.getContestLeaderboard(
        Number(req.params.contest_id),
        { page: Number(page), limit: Number(limit) }
      );
      return success(res, leaderboard, 'Contest leaderboard retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getUserDetailedStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getUserDetailedStats(
        Number(req.params.user_id),
        Number(req.params.contest_id)
      );
      return success(res, stats, 'User detailed statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async getCurrentUserDetailedStats(req, res, next) {
    try {
      const stats = await TaskStatsService.getUserDetailedStats(
        req.user.user_id,
        Number(req.params.contest_id)
      );
      return success(res, stats, 'Your detailed statistics retrieved successfully');
    } catch (e) { 
      next(e); 
    }
  }
};