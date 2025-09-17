import { TaskModel } from './task.model.js';
import { badRequest, notFound, forbidden } from '../../utils/errorHandler.js';

export const TaskService = {
  async create({ contest_id, title, description, points = 0, difficulty = 'medium', rule_type = 'flag', required_answer = null, created_by }) {
    // Check if contest exists
    const contestExists = await TaskModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    const task = await TaskModel.create({
      contest_id,
      title,
      description,
      points,
      difficulty,
      rule_type,
      required_answer,
      created_by
    });
    return task;
  },

  async getById(task_id, contest_id) {
    const task = await TaskModel.findById(task_id);
    if (!task) {
      throw notFound('Task not found');
    }
    
    // Verify task belongs to the specified contest
    if (contest_id && task.contest_id !== contest_id) {
      throw notFound('Task not found in this contest');
    }
    
    return task;
  },

  async getByContestId(contest_id, params = {}) {
    // Check if contest exists
    const contestExists = await TaskModel.checkContestExists(contest_id);
    if (!contestExists) {
      throw notFound('Contest not found');
    }

    return TaskModel.findByContestId(contest_id, params);
  },

  async list(params = {}) {
    // If contest_id is provided, check if it exists
    if (params.contest_id) {
      const contestExists = await TaskModel.checkContestExists(params.contest_id);
      if (!contestExists) {
        throw notFound('Contest not found');
      }
    }

    return TaskModel.list(params);
  },

  async update(task_id, payload, user_id, contest_id) {
    const task = await TaskModel.findById(task_id);
    if (!task) {
      throw notFound('Task not found');
    }

    // Verify task belongs to the specified contest
    if (contest_id && task.contest_id !== contest_id) {
      throw notFound('Task not found in this contest');
    }

    // Check if user is the creator of the task (basic permission check)
    if (task.created_by !== user_id) {
      throw forbidden('You can only update tasks you created');
    }

    // Validate difficulty if provided
    if (payload.difficulty && !['easy', 'medium', 'hard'].includes(payload.difficulty)) {
      throw badRequest('Invalid difficulty level. Must be: easy, medium, or hard');
    }

    // Validate points if provided
    if (payload.points !== undefined && (typeof payload.points !== 'number' || payload.points < 0)) {
      throw badRequest('Points must be a non-negative number');
    }

    return TaskModel.update(task_id, payload);
  },

  async remove(task_id, user_id, contest_id) {
    const task = await TaskModel.findById(task_id);
    if (!task) {
      throw notFound('Task not found');
    }

    // Verify task belongs to the specified contest
    if (contest_id && task.contest_id !== contest_id) {
      throw notFound('Task not found in this contest');
    }

    // Check if user is the creator of the task (basic permission check)
    if (task.created_by !== user_id) {
      throw forbidden('You can only delete tasks you created');
    }

    await TaskModel.remove(task_id);
  }
};