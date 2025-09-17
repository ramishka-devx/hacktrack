import { success } from '../../utils/apiResponse.js';
import { TaskService } from './task.service.js';

export const TaskController = {
  async create(req, res, next) {
    try {
      const task = await TaskService.create({
        ...req.body,
        contest_id: Number(req.params.contest_id),
        created_by: req.user.user_id
      });
      return success(res, task, 'Task created successfully', 201);
    } catch (e) { 
      next(e); 
    }
  },

  async getById(req, res, next) {
    try {
      const task = await TaskService.getById(
        Number(req.params.task_id),
        Number(req.params.contest_id)
      );
      return success(res, task);
    } catch (e) { 
      next(e); 
    }
  },

  async getByContestId(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const tasks = await TaskService.getByContestId(
        Number(req.params.contest_id),
        { page: Number(page), limit: Number(limit) }
      );
      return success(res, tasks);
    } catch (e) { 
      next(e); 
    }
  },

  async list(req, res, next) {
    try {
      const { page = 1, limit = 10, contest_id } = req.query;
      const params = {
        page: Number(page),
        limit: Number(limit)
      };
      
      if (contest_id) {
        params.contest_id = Number(contest_id);
      }
      
      const tasks = await TaskService.list(params);
      return success(res, tasks);
    } catch (e) { 
      next(e); 
    }
  },

  async update(req, res, next) {
    try {
      const task = await TaskService.update(
        Number(req.params.task_id),
        req.body,
        req.user.user_id,
        Number(req.params.contest_id)
      );
      return success(res, task, 'Task updated successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async remove(req, res, next) {
    try {
      await TaskService.remove(
        Number(req.params.task_id), 
        req.user.user_id,
        Number(req.params.contest_id)
      );
      return success(res, null, 'Task deleted successfully', 204);
    } catch (e) { 
      next(e); 
    }
  }
};