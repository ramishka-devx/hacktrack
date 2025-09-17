import { TaskStatsModel } from './task-stats.model.js';
import { notFound } from '../../utils/errorHandler.js';

export const TaskStatsService = {
  async getContestTaskStats(contest_id) {
    // Check if contest exists
    const contestExists = await TaskStatsModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    const stats = await TaskStatsModel.getContestTaskStats(contest_id);
    return stats;
  },

  async getUserTaskStats(user_id, contest_id) {
    // Check if contest exists
    const contestExists = await TaskStatsModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    const stats = await TaskStatsModel.getUserTaskStats(user_id, contest_id);
    return stats;
  },

  async getContestOverallStats(contest_id) {
    // Check if contest exists
    const contestExists = await TaskStatsModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    const stats = await TaskStatsModel.getContestOverallStats(contest_id);
    return stats;
  },

  async getContestLeaderboard(contest_id, params = {}) {
    // Check if contest exists
    const contestExists = await TaskStatsModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    return TaskStatsModel.getContestLeaderboard(contest_id, params);
  },

  async getUserDetailedStats(user_id, contest_id) {
    // Check if contest exists
    const contestExists = await TaskStatsModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    const stats = await TaskStatsModel.getUserDetailedStats(user_id, contest_id);
    if (!stats) {
      throw notFound('User not found or not participating in this contest');
    }

    return stats;
  }
};