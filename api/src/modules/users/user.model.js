import { query } from '../../config/db.config.js';
import bcrypt from 'bcrypt';

export const UserModel = {
  async create({ first_name, last_name, email, password_hash }) {
    const sql = `INSERT INTO users (first_name, last_name, email, password_hash, created_at, updated_at)
                 VALUES (?, ?, ?, ?, NOW(), NOW())`;
    const result = await query(sql, [first_name, last_name, email, password_hash]);
    return { user_id: result.insertId, first_name, last_name, email };
  },
  async findByEmail(email) {
    const rows = await query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    return rows[0];
  },
  async findById(user_id) {
    const rows = await query('SELECT user_id, first_name, last_name, email, created_at, updated_at FROM users WHERE user_id = ? LIMIT 1', [user_id]);
    return rows[0];
  },
  async list({ page = 1, limit = 10 }) {
    const offset = (page - 1) * limit;
    const rows = await query('SELECT user_id, first_name, last_name, email, created_at, updated_at FROM users LIMIT ? OFFSET ?', [Number(limit), Number(offset)]);
    const [{ count }] = await query('SELECT COUNT(*) as count FROM users');
    return { rows, total: count };
  },
  async update(user_id, payload) {
    const fields = [];
    const params = [];
    for (const [k, v] of Object.entries(payload)) {
      if (v === undefined) continue;
      fields.push(`${k} = ?`);
      params.push(v);
    }
    if (fields.length === 0) return this.findById(user_id);
    params.push(user_id);
    await query(`UPDATE users SET ${fields.join(', ')}, updated_at = NOW() WHERE user_id = ?`, params);
    return this.findById(user_id);
  },
  async remove(user_id) {
    await query('DELETE FROM users WHERE user_id = ?', [user_id]);
  }
};

export async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
