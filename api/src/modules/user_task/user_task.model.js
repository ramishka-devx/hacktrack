import { query } from '../../config/db.config.js';

export const UserTaskModel = {
  /**
   * Create a new user task assignment
   */
  async create({ user_id, task_id, status = 'pending' }) {
    const sql = `INSERT INTO user_task (user_id, task_id, status)
                 VALUES (?, ?, ?)`;
    const result = await query(sql, [user_id, task_id, status]);
    return { id: result.insertId, user_id, task_id, status };
  },

  /**
   * Create multiple user task assignments for a contest
   */
  async createMultiple(user_id, task_ids, status = 'pending') {
    if (!task_ids || task_ids.length === 0) {
      return [];
    }

    // Prepare values for bulk insert
    const values = task_ids.map(task_id => [user_id, task_id, status]);
    const placeholders = task_ids.map(() => '(?, ?, ?)').join(', ');
    const flatValues = values.flat();

    const sql = `INSERT IGNORE INTO user_task (user_id, task_id, status)
                 VALUES ${placeholders}`;
    
    try {
      const result = await query(sql, flatValues);
      return {
        affectedRows: result.affectedRows,
        insertedCount: result.affectedRows,
        user_id,
        task_ids,
        status
      };
    } catch (error) {
      // Handle duplicate entries gracefully
      if (error.code === 'ER_DUP_ENTRY') {
        return {
          affectedRows: 0,
          insertedCount: 0,
          user_id,
          task_ids,
          status,
          message: 'Some tasks already assigned to user'
        };
      }
      throw error;
    }
  },

  /**
   * Find user task by user_id and task_id
   */
  async findByUserAndTask(user_id, task_id) {
    const rows = await query(`
      SELECT ut.id, ut.user_id, ut.task_id, ut.status, ut.score, 
             ut.submitted_at, ut.created_at,
             t.title as task_title, t.description as task_description,
             t.points as task_points, t.difficulty as task_difficulty,
             t.contest_id
      FROM user_task ut
      LEFT JOIN task t ON ut.task_id = t.task_id
      WHERE ut.user_id = ? AND ut.task_id = ?
      LIMIT 1
    `, [user_id, task_id]);
    return rows[0];
  },

  /**
   * Find all user tasks for a specific user and contest
   */
  async findByUserAndContest(user_id, contest_id) {
    const rows = await query(`
      SELECT ut.id, ut.user_id, ut.task_id, ut.status, ut.score, 
             ut.submitted_at, ut.created_at,
             t.title as task_title, t.description as task_description,
             t.points as task_points, t.difficulty as task_difficulty,
             t.contest_id
      FROM user_task ut
      INNER JOIN task t ON ut.task_id = t.task_id
      WHERE ut.user_id = ? AND t.contest_id = ?
      ORDER BY ut.created_at DESC
    `, [user_id, contest_id]);
    return rows;
  },

  /**
   * Find all tasks for a user
   */
  async findByUser(user_id, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await query(`
      SELECT ut.id, ut.user_id, ut.task_id, ut.status, ut.score, 
             ut.submitted_at, ut.created_at,
             t.title as task_title, t.description as task_description,
             t.points as task_points, t.difficulty as task_difficulty,
             t.contest_id,
             c.title as contest_title
      FROM user_task ut
      INNER JOIN task t ON ut.task_id = t.task_id
      INNER JOIN contests c ON t.contest_id = c.contest_id
      WHERE ut.user_id = ?
      ORDER BY ut.created_at DESC
      LIMIT ? OFFSET ?
    `, [user_id, Number(limit), Number(offset)]);
    
    const [{ count }] = await query('SELECT COUNT(*) as count FROM user_task WHERE user_id = ?', [user_id]);
    return { rows, total: count };
  },

  /**
   * Update user task status
   */
  async updateStatus(user_id, task_id, status, additional_data = {}) {
    const updates = ['status = ?'];
    const params = [status];

    if (additional_data.score !== undefined) {
      updates.push('score = ?');
      params.push(additional_data.score);
    }

    if (status === 'submitted' && !additional_data.submitted_at) {
      updates.push('submitted_at = NOW()');
    } else if (additional_data.submitted_at) {
      updates.push('submitted_at = ?');
      params.push(additional_data.submitted_at);
    }

    params.push(user_id, task_id);

    const sql = `UPDATE user_task SET ${updates.join(', ')} WHERE user_id = ? AND task_id = ?`;
    const result = await query(sql, params);
    return result.affectedRows > 0;
  },

  /**
   * Delete user task assignment
   */
  async delete(user_id, task_id) {
    const result = await query('DELETE FROM user_task WHERE user_id = ? AND task_id = ?', [user_id, task_id]);
    return result.affectedRows > 0;
  },

  /**
   * Check if user has access to a task
   */
  async hasAccess(user_id, task_id) {
    const rows = await query('SELECT 1 FROM user_task WHERE user_id = ? AND task_id = ? LIMIT 1', [user_id, task_id]);
    return rows.length > 0;
  },

  /**
   * Submit answer for a user task and automatically grade it
   */
  async submitAnswer(user_id, task_id, user_answer) {
    // First, get the task's required answer and points
    const taskQuery = `
      SELECT t.required_answer, t.points, t.title,
             ut.status, ut.user_answer as current_answer
      FROM task t
      INNER JOIN user_task ut ON t.task_id = ut.task_id
      WHERE ut.user_id = ? AND ut.task_id = ?
      LIMIT 1
    `;
    
    const taskRows = await query(taskQuery, [user_id, task_id]);
    
    if (!taskRows || taskRows.length === 0) {
      throw new Error('Task not found or not assigned to user');
    }
    
    const task = taskRows[0];
    
    // Check if user_answer matches required_answer
    const isCorrect = task.required_answer && 
                     user_answer && 
                     user_answer.trim().toLowerCase() === task.required_answer.trim().toLowerCase();
    
    // Calculate score: full points if correct, 0 if incorrect
    const score = isCorrect ? task.points : 0;
    
  // Only update status to 'completed' if answer is correct
  // If incorrect, keep current status or set to 'on_going'
  const newStatus = isCorrect ? 'completed' : (task.status === 'pending' ? 'on_going' : task.status);
    
    // Update user_task with the answer, score, and status
    const updateSql = `
      UPDATE user_task 
      SET user_answer = ?, 
          score = ?, 
          status = ?
          ${isCorrect ? ', submitted_at = NOW()' : ''}
      WHERE user_id = ? AND task_id = ?
    `;
    const params = [user_answer, score, newStatus, user_id, task_id];
    const result = await query(updateSql, params);
    
    if (result.affectedRows === 0) {
      throw new Error('Failed to submit answer');
    }
    
    return {
      user_id,
      task_id,
      task_title: task.title,
      user_answer,
      required_answer: task.required_answer,
      is_correct: isCorrect,
      score,
      max_points: task.points,
      status: newStatus,
      message: isCorrect 
        ? 'Correct answer! Full points awarded and task marked as completed.' 
        : 'Incorrect answer. Please try again. Task remains in progress.'
    };
  },

  /**
   * Get user's answer for a specific task
   */
  async getUserAnswer(user_id, task_id) {
    const rows = await query(`
      SELECT ut.user_answer, ut.score, ut.status, ut.submitted_at,
             t.title as task_title, t.points as max_points, t.required_answer
      FROM user_task ut
      INNER JOIN task t ON ut.task_id = t.task_id
      WHERE ut.user_id = ? AND ut.task_id = ?
      LIMIT 1
    `, [user_id, task_id]);
    
    return rows[0];
  }
};