import { success } from '../../utils/apiResponse.js';
import { ContestService } from './contest.service.js';

export const ContestController = {
  async create(req, res, next) {
    try {
      const contestData = {
        ...req.body,
        created_by: req.user.user_id
      };
      const contest = await ContestService.create(contestData, req.file);
      return success(res, contest, 'Contest created successfully', 201);
    } catch (e) { 
      next(e); 
    }
  },

  async list(req, res, next) {
    try {
      const { page = 1, limit = 10, is_public, created_by } = req.query;
      const params = {
        page: Number(page),
        limit: Number(limit),
        is_public: is_public !== undefined ? Boolean(is_public) : null,
        created_by: created_by ? Number(created_by) : null
      };
      const data = await ContestService.list(params);
      return success(res, data);
    } catch (e) { 
      next(e); 
    }
  },

  async getById(req, res, next) {
    try {
      const user_id = req.user ? req.user.user_id : null;
      const contest = await ContestService.getById(Number(req.params.contest_id), user_id);
      return success(res, contest);
    } catch (e) { 
      next(e); 
    }
  },

  async getBySlug(req, res, next) {
    try {
      const user_id = req.user ? req.user.user_id : null;
      const contest = await ContestService.getBySlug(req.params.slug, user_id);
      return success(res, contest);
    } catch (e) { 
      next(e); 
    }
  },

  async update(req, res, next) {
    try {
      const contest = await ContestService.update(
        Number(req.params.contest_id), 
        req.body, 
        req.file,
        req.user.user_id
      );
      return success(res, contest, 'Contest updated successfully');
    } catch (e) { 
      next(e); 
    }
  },

  async remove(req, res, next) {
    try {
      await ContestService.remove(Number(req.params.contest_id), req.user.user_id);
      return success(res, null, 'Contest deleted successfully', 204);
    } catch (e) { 
      next(e); 
    }
  },

  async getParticipants(req, res, next) {
    try {
      const user_id = req.user ? req.user.user_id : null;
      const participants = await ContestService.getParticipants(Number(req.params.contest_id), user_id);
      return success(res, participants);
    } catch (e) { 
      next(e); 
    }
  },

  async joinContest(req, res, next) {
    try {
      const result = await ContestService.joinContest(
        Number(req.params.contest_id),
        req.user.user_id,
        req.body.role_in_contest
      );
      return success(res, result, result.message);
    } catch (e) { 
      next(e); 
    }
  },

  async leaveContest(req, res, next) {
    try {
      const result = await ContestService.leaveContest(
        Number(req.params.contest_id),
        req.user.user_id
      );
      return success(res, result, result.message);
    } catch (e) { 
      next(e); 
    }
  },

  async updateParticipantRole(req, res, next) {
    try {
      const result = await ContestService.updateParticipantRole(
        Number(req.params.contest_id),
        Number(req.params.user_id),
        req.body.role_in_contest,
        req.user.user_id
      );
      return success(res, result, result.message);
    } catch (e) { 
      next(e); 
    }
  },

  // Get contests by current user
  async myContests(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const params = {
        page: Number(page),
        limit: Number(limit),
        created_by: req.user.user_id
      };
      const data = await ContestService.list(params);
      return success(res, data);
    } catch (e) { 
      next(e); 
    }
  },

  // Get all contests related to current user (created + enrolled)
  async myAllContests(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const params = {
        page: Number(page),
        limit: Number(limit)
      };
      const data = await ContestService.getMyContests(req.user.user_id, params);
      return success(res, data);
    } catch (e) { 
      next(e); 
    }
  },

  // Get only public contests
  async getPublicContests(req, res, next) {
    try {
      const { page = 1, limit = 10, created_by } = req.query;
      const params = {
        page: Number(page),
        limit: Number(limit),
        created_by: created_by ? Number(created_by) : null
      };
      const data = await ContestService.getPublicContests(params);
      return success(res, data);
    } catch (e) { 
      next(e); 
    }
  },

  async addMember(req, res, next) {
    try {
      const result = await ContestService.addMember(
        Number(req.params.contest_id),
        Number(req.body.user_id),
        req.body.role_in_contest,
        req.user.user_id
      );
      return success(res, result, result.message);
    } catch (e) { 
      next(e); 
    }
  },

  async removeMember(req, res, next) {
    try {
      const result = await ContestService.removeMember(
        Number(req.params.contest_id),
        Number(req.params.user_id),
        req.user.user_id
      );
      return success(res, result, result.message);
    } catch (e) { 
      next(e); 
    }
  }
};