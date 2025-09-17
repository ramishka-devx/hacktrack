import { query } from '../../config/db.config.js';

export const ContestModel = {
  async create({ title, slug, profile_img, created_by, starts_at, ends_at, is_public = 1 }) {
    const sql = `INSERT INTO contests (title, slug, profile_img, created_by, starts_at, ends_at, is_public, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const result = await query(sql, [title, slug, profile_img, created_by, starts_at, ends_at, is_public]);
    return { contest_id: result.insertId, title, slug, profile_img, created_by, starts_at, ends_at, is_public };
  },

  async findById(contest_id) {
    const sql = `SELECT c.*, u.first_name, u.last_name, u.email as creator_email 
                 FROM contests c 
                 LEFT JOIN users u ON c.created_by = u.user_id 
                 WHERE c.contest_id = ? LIMIT 1`;
    const rows = await query(sql, [contest_id]);
    return rows[0];
  },

  async findBySlug(slug) {
    const sql = `SELECT c.*, u.first_name, u.last_name, u.email as creator_email 
                 FROM contests c 
                 LEFT JOIN users u ON c.created_by = u.user_id 
                 WHERE c.slug = ? LIMIT 1`;
    const rows = await query(sql, [slug]);
    return rows[0];
  },

  async list({ page = 1, limit = 10, is_public = null, created_by = null }) {
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params = [];

    if (is_public !== null) {
      whereConditions.push('c.is_public = ?');
      params.push(is_public);
    }

    if (created_by !== null) {
      whereConditions.push('c.created_by = ?');
      params.push(created_by);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const sql = `SELECT c.*, u.first_name, u.last_name, u.email as creator_email 
                 FROM contests c 
                 LEFT JOIN users u ON c.created_by = u.user_id 
                 ${whereClause}
                 ORDER BY c.created_at DESC 
                 LIMIT ? OFFSET ?`;
    
    const countSql = `SELECT COUNT(*) as count FROM contests c ${whereClause}`;
    
    params.push(Number(limit), Number(offset));
    const countParams = whereConditions.length > 0 ? params.slice(0, -2) : [];

    const rows = await query(sql, params);
    const [{ count }] = await query(countSql, countParams);
    
    return { rows, total: count };
  },

  async update(contest_id, payload) {
    const fields = [];
    const params = [];
    
    for (const [k, v] of Object.entries(payload)) {
      if (v === undefined) continue;
      fields.push(`${k} = ?`);
      params.push(v);
    }
    
    if (fields.length === 0) return this.findById(contest_id);
    
    params.push(contest_id);
    await query(`UPDATE contests SET ${fields.join(', ')}, updated_at = NOW() WHERE contest_id = ?`, params);
    return this.findById(contest_id);
  },

  async remove(contest_id) {
    await query('DELETE FROM contests WHERE contest_id = ?', [contest_id]);
  },

  async getParticipants(contest_id) {
    const sql = `SELECT uc.*, u.first_name, u.last_name, u.email 
                 FROM user_contest uc 
                 JOIN users u ON uc.user_id = u.user_id 
                 WHERE uc.contest_id = ?
                 ORDER BY uc.joined_at DESC`;
    return await query(sql, [contest_id]);
  },

  async addParticipant(contest_id, user_id, role_in_contest = 'participant') {
    const sql = `INSERT INTO user_contest (user_id, contest_id, role_in_contest, joined_at)
                 VALUES (?, ?, ?, NOW())`;
    const result = await query(sql, [user_id, contest_id, role_in_contest]);
    return result.insertId;
  },

  async removeParticipant(contest_id, user_id) {
    await query('DELETE FROM user_contest WHERE contest_id = ? AND user_id = ?', [contest_id, user_id]);
  },

  async checkParticipant(contest_id, user_id) {
    const rows = await query('SELECT * FROM user_contest WHERE contest_id = ? AND user_id = ? LIMIT 1', [contest_id, user_id]);
    return rows[0];
  },

  async generateUniqueSlug(title) {
    // Convert title to slug
    let baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists and increment if needed
    while (true) {
      const existing = await this.findBySlug(slug);
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }
};