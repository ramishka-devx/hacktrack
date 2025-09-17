import { query } from '../../config/db.config.js';

export const TaskStatsModel = {
  // Get task completion statistics for a contest
  async getContestTaskStats(contest_id) {
    const sql = `
      SELECT 
        t.task_id,
        t.title,
        t.difficulty,
        t.points,
        COUNT(ut.id) as total_assignments,
        COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) as completed_count,
        COUNT(CASE WHEN ut.status = 'in_progress' THEN 1 END) as in_progress_count,
        COUNT(CASE WHEN ut.status = 'assigned' THEN 1 END) as assigned_count,
        ROUND(
          (COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) * 100.0 / 
          NULLIF(COUNT(ut.id), 0)), 2
        ) as completion_percentage
      FROM task t
      LEFT JOIN user_task ut ON t.task_id = ut.task_id
      WHERE t.contest_id = ?
      GROUP BY t.task_id, t.title, t.difficulty, t.points
      ORDER BY t.created_at ASC
    `;
    return await query(sql, [contest_id]);
  },

  // Get user's task completion statistics in a contest
  async getUserTaskStats(user_id, contest_id) {
    const sql = `
      SELECT 
        t.task_id,
        t.title,
        t.description,
        t.difficulty,
        t.points,
        ut.status,
        ut.score,
        ut.submitted_at,
        ut.created_at as assigned_at,
        CASE 
          WHEN ut.status IN ('submitted', 'reviewed', 'closed') THEN 'completed'
          WHEN ut.status = 'in_progress' THEN 'in_progress'
          WHEN ut.status = 'assigned' THEN 'not_started'
          ELSE 'not_assigned'
        END as completion_status
      FROM task t
      LEFT JOIN user_task ut ON t.task_id = ut.task_id AND ut.user_id = ?
      WHERE t.contest_id = ?
      ORDER BY t.created_at ASC
    `;
    return await query(sql, [user_id, contest_id]);
  },

  // Get overall contest statistics
  async getContestOverallStats(contest_id) {
    const sql = `
      SELECT 
        COUNT(DISTINCT t.task_id) as total_tasks,
        COUNT(DISTINCT ut.user_id) as total_participants,
        COUNT(ut.id) as total_assignments,
        COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) as total_completed,
        COUNT(CASE WHEN ut.status = 'in_progress' THEN 1 END) as total_in_progress,
        COUNT(CASE WHEN ut.status = 'assigned' THEN 1 END) as total_assigned,
        ROUND(
          (COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) * 100.0 / 
          NULLIF(COUNT(ut.id), 0)), 2
        ) as overall_completion_percentage,
        SUM(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN t.points ELSE 0 END) as total_points_earned,
        SUM(t.points) as total_possible_points
      FROM task t
      LEFT JOIN user_task ut ON t.task_id = ut.task_id
      WHERE t.contest_id = ?
    `;
    const result = await query(sql, [contest_id]);
    return result[0];
  },

  // Get user leaderboard for a contest
  async getContestLeaderboard(contest_id, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) as completed_tasks,
        COUNT(ut.id) as total_assigned_tasks,
        COALESCE(SUM(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN t.points ELSE 0 END), 0) as total_points,
        COALESCE(AVG(ut.score), 0) as average_score,
        ROUND(
          (COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) * 100.0 / 
          NULLIF(COUNT(ut.id), 0)), 2
        ) as completion_percentage
      FROM users u
      INNER JOIN user_task ut ON u.user_id = ut.user_id
      INNER JOIN task t ON ut.task_id = t.task_id
      WHERE t.contest_id = ?
      GROUP BY u.user_id, u.first_name, u.last_name, u.email
      ORDER BY total_points DESC, completed_tasks DESC, completion_percentage DESC
      LIMIT ? OFFSET ?
    `;
    
    const rows = await query(sql, [contest_id, Number(limit), Number(offset)]);
    
    const countSql = `
      SELECT COUNT(DISTINCT u.user_id) as count
      FROM users u
      INNER JOIN user_task ut ON u.user_id = ut.user_id
      INNER JOIN task t ON ut.task_id = t.task_id
      WHERE t.contest_id = ?
    `;
    const [{ count }] = await query(countSql, [contest_id]);
    
    return { rows, total: count };
  },

  // Get detailed user statistics for a contest
  async getUserDetailedStats(user_id, contest_id) {
    const userStatsSql = `
      SELECT 
        u.user_id,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN ut.status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN ut.status = 'assigned' THEN 1 END) as assigned_tasks,
        COUNT(ut.id) as total_assigned_tasks,
        COALESCE(SUM(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN t.points ELSE 0 END), 0) as total_points,
        COALESCE(AVG(ut.score), 0) as average_score,
        ROUND(
          (COUNT(CASE WHEN ut.status = 'submitted' OR ut.status = 'reviewed' OR ut.status = 'closed' THEN 1 END) * 100.0 / 
          NULLIF(COUNT(ut.id), 0)), 2
        ) as completion_percentage
      FROM users u
      LEFT JOIN user_task ut ON u.user_id = ut.user_id
      LEFT JOIN task t ON ut.task_id = t.task_id AND t.contest_id = ?
      WHERE u.user_id = ?
      GROUP BY u.user_id, u.first_name, u.last_name, u.email
    `;
    
    const result = await query(userStatsSql, [contest_id, user_id]);
    return result[0];
  },

  // Check if contest exists
  async checkContestExists(contest_id) {
    const rows = await query('SELECT contest_id FROM contests WHERE contest_id = ? LIMIT 1', [contest_id]);
    return rows.length > 0;
  }
};