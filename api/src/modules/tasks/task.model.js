import { query } from '../../config/db.config.js';

export const TaskModel = {
  async create({ contest_id, title, description, points, difficulty, created_by }) {
    const sql = `INSERT INTO task (contest_id, title, description, points, difficulty, created_by, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const result = await query(sql, [contest_id, title, description, points, difficulty, created_by]);
    return { task_id: result.insertId, contest_id, title, description, points, difficulty, created_by };
  },

  async findById(task_id) {
    const rows = await query(`
      SELECT t.task_id, t.contest_id, t.title, t.description, t.points, t.difficulty, 
             t.created_by, t.created_at, t.updated_at,
             c.title as contest_title,
             u.first_name, u.last_name
      FROM task t
      LEFT JOIN contests c ON t.contest_id = c.contest_id
      LEFT JOIN users u ON t.created_by = u.user_id
      WHERE t.task_id = ? LIMIT 1
    `, [task_id]);
    return rows[0];
  },

  async findByContestId(contest_id, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    const rows = await query(`
      SELECT t.task_id, t.contest_id, t.title, t.description, t.points, t.difficulty, 
             t.created_by, t.created_at, t.updated_at,
             u.first_name, u.last_name
      FROM task t
      LEFT JOIN users u ON t.created_by = u.user_id
      WHERE t.contest_id = ?
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [contest_id, Number(limit), Number(offset)]);
    
    const [{ count }] = await query('SELECT COUNT(*) as count FROM task WHERE contest_id = ?', [contest_id]);
    return { rows, total: count };
  },

  async list({ page = 1, limit = 10, contest_id } = {}) {
    const offset = (page - 1) * limit;
    let whereClauses = [];
    let params = [];

    if (contest_id) {
      whereClauses.push('t.contest_id = ?');
      params.push(contest_id);
    }

    const whereSQL = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    const rows = await query(`
      SELECT t.task_id, t.contest_id, t.title, t.description, t.points, t.difficulty, 
             t.created_by, t.created_at, t.updated_at,
             c.title as contest_title,
             u.first_name, u.last_name
      FROM task t
      LEFT JOIN contests c ON t.contest_id = c.contest_id
      LEFT JOIN users u ON t.created_by = u.user_id
      ${whereSQL}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, Number(limit), Number(offset)]);

    const countParams = contest_id ? [contest_id] : [];
    const [{ count }] = await query(`SELECT COUNT(*) as count FROM task t ${whereSQL}`, countParams);
    
    return { rows, total: count };
  },

  async update(task_id, payload) {
    const allowedFields = ['title', 'description', 'points', 'difficulty'];
    const fields = [];
    const params = [];
    
    for (const [k, v] of Object.entries(payload)) {
      if (v === undefined || !allowedFields.includes(k)) continue;
      fields.push(`${k} = ?`);
      params.push(v);
    }
    
    if (fields.length === 0) return this.findById(task_id);
    
    params.push(task_id);
    await query(`UPDATE task SET ${fields.join(', ')}, updated_at = NOW() WHERE task_id = ?`, params);
    return this.findById(task_id);
  },

  async remove(task_id) {
    await query('DELETE FROM task WHERE task_id = ?', [task_id]);
  },

  async checkContestExists(contest_id) {
    const rows = await query('SELECT contest_id FROM contests WHERE contest_id = ? LIMIT 1', [contest_id]);
    return rows.length > 0;
  }
};