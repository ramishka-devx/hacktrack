import { UserTaskModel } from './user_task.model.js';
import { TaskModel } from '../tasks/task.model.js';
import { badRequest, notFound, forbidden } from '../../utils/errorHandler.js';

export const UserTaskService = {
  /**
   * Assign all tasks from a contest to a user
   */
  async assignContestTasksToUser(user_id, contest_id) {
    // First, get all tasks for the contest
    const tasksResult = await TaskModel.findByContestId(contest_id);
    
    if (!tasksResult.rows || tasksResult.rows.length === 0) {
      throw notFound('No tasks found for this contest');
    }

    const task_ids = tasksResult.rows.map(task => task.task_id);
    
    // Create user task assignments for all tasks in the contest
    const result = await UserTaskModel.createMultiple(user_id, task_ids, 'assigned');
    
    return {
      user_id,
      contest_id,
      tasks_assigned: task_ids.length,
      new_assignments: result.insertedCount,
      message: result.insertedCount > 0 
        ? `Successfully assigned ${result.insertedCount} new tasks to user`
        : 'User already has access to all tasks in this contest'
    };
  },

  /**
   * Get user's tasks for a specific contest
   */
  async getUserContestTasks(user_id, contest_id) {
    const userTasks = await UserTaskModel.findByUserAndContest(user_id, contest_id);
    
    return {
      user_id,
      contest_id,
      tasks: userTasks,
      total_tasks: userTasks.length
    };
  },

  /**
   * Get all user's tasks across all contests
   */
  async getUserTasks(user_id, params = {}) {
    return UserTaskModel.findByUser(user_id, params);
  },

  /**
   * Get specific user task details
   */
  async getUserTask(user_id, task_id) {
    const userTask = await UserTaskModel.findByUserAndTask(user_id, task_id);
    
    if (!userTask) {
      throw notFound('User task assignment not found');
    }
    
    return userTask;
  },

  /**
   * Update user task status
   */
  async updateTaskStatus(user_id, task_id, status, additional_data = {}) {
    // Validate status
  const validStatuses = ['pending', 'on_going', 'completed'];
    if (!validStatuses.includes(status)) {
      throw badRequest(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Check if user task exists
    const userTask = await UserTaskModel.findByUserAndTask(user_id, task_id);
    if (!userTask) {
      throw notFound('User task assignment not found');
    }

    const updated = await UserTaskModel.updateStatus(user_id, task_id, status, additional_data);
    
    if (!updated) {
      throw badRequest('Failed to update task status');
    }

    return {
      user_id,
      task_id,
      status,
      message: 'Task status updated successfully'
    };
  },

  /**
   * Remove user task assignment
   */
  async removeUserTask(user_id, task_id) {
    const deleted = await UserTaskModel.delete(user_id, task_id);
    
    if (!deleted) {
      throw notFound('User task assignment not found');
    }

    return {
      user_id,
      task_id,
      message: 'User task assignment removed successfully'
    };
  },

  /**
   * Check if user has access to a task
   */
  async checkTaskAccess(user_id, task_id) {
    return UserTaskModel.hasAccess(user_id, task_id);
  },

  /**
   * Submit answer for a user task
   */
  async submitAnswer(user_id, task_id, user_answer) {
    // Validate that the answer is provided
    if (!user_answer || typeof user_answer !== 'string' || user_answer.trim() === '') {
      throw badRequest('Answer is required and must be a non-empty string');
    }

    // Check if user has access to this task
    const hasAccess = await UserTaskModel.hasAccess(user_id, task_id);
    if (!hasAccess) {
      throw forbidden('User does not have access to this task');
    }

    // Get current user task to check if already submitted
    const currentUserTask = await UserTaskModel.findByUserAndTask(user_id, task_id);
    if (!currentUserTask) {
      throw notFound('User task assignment not found');
    }

    // Check if task is already completed successfully (correct answer)
    if (currentUserTask.status === 'completed') {
      throw badRequest('Task has already been completed successfully');
    }

    try {
      // Submit the answer and get automatic grading result
      const result = await UserTaskModel.submitAnswer(user_id, task_id, user_answer.trim());
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      if (error.message === 'Task not found or not assigned to user') {
        throw notFound('Task not found or not assigned to user');
      }
      if (error.message === 'Failed to submit answer') {
        throw badRequest('Failed to submit answer');
      }
      throw error;
    }
  },

  /**
   * Get user's submitted answer for a task
   */
  async getUserAnswer(user_id, task_id) {
    // Check if user has access to this task
    const hasAccess = await UserTaskModel.hasAccess(user_id, task_id);
    if (!hasAccess) {
      throw forbidden('User does not have access to this task');
    }

    const userAnswer = await UserTaskModel.getUserAnswer(user_id, task_id);
    if (!userAnswer) {
      throw notFound('User task assignment not found');
    }

    // Don't expose the required_answer to the user in normal circumstances
    const response = {
      user_id,
      task_id,
      task_title: userAnswer.task_title,
      user_answer: userAnswer.user_answer,
      score: userAnswer.score,
      max_points: userAnswer.max_points,
      status: userAnswer.status,
      submitted_at: userAnswer.submitted_at,
      has_submitted: !!userAnswer.user_answer
    };

    return response;
  },

  /**
   * Assign a single task to a user
   */
  async assignTaskToUser(user_id, task_id, status = 'assigned') {
    // Check if task exists
    const task = await TaskModel.findById(task_id);
    if (!task) {
      throw notFound('Task not found');
    }

    // Check if assignment already exists
    const existingAssignment = await UserTaskModel.findByUserAndTask(user_id, task_id);
    if (existingAssignment) {
      return {
        user_id,
        task_id,
        message: 'Task already assigned to user',
        existing: true
      };
    }

    const result = await UserTaskModel.create({ user_id, task_id, status });
    
    return {
      user_id,
      task_id,
      assignment_id: result.id,
      status,
      message: 'Task assigned to user successfully'
    };
  }
};