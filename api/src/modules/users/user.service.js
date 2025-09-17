import { UserModel, hashPassword, comparePassword } from './user.model.js';
import { badRequest, unauthorized, notFound } from '../../utils/errorHandler.js';
import { signToken } from '../../utils/jwtHelper.js';

export const UserService = {
  async register({ first_name, last_name, email, password }) {
    const exists = await UserModel.findByEmail(email);
    if (exists) throw badRequest('Email already in use');
    const password_hash = await hashPassword(password);
    const user = await UserModel.create({ first_name, last_name, email, password_hash });
    return user;
  },
  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) throw unauthorized('Invalid credentials');
    const ok = await comparePassword(password, user.password_hash);
    if (!ok) throw unauthorized('Invalid credentials');
    const token = signToken({ user_id: user.user_id, role_id: user.role_id, email: user.email });
    return { token };
  },
  async getProfile(user_id) {
    const user = await UserModel.findById(user_id);
    if (!user) throw notFound('User not found');
    return user;
  },
  async list(params) {
    return UserModel.list(params);
  },
  async update(user_id, payload) {
    return UserModel.update(user_id, payload);
  },
  async remove(user_id) {
    return UserModel.remove(user_id);
  },
  async search({ searchTerm, page = 1, limit = 10 }) {
    if (!searchTerm || searchTerm.trim().length === 0) {
      throw badRequest('Search term is required');
    }
    return UserModel.search({ 
      searchTerm: searchTerm.trim(), 
      page: Number(page), 
      limit: Number(limit) 
    });
  }
};
