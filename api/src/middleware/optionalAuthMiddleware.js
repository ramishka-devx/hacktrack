import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

// Optional authentication middleware - sets req.user if token is provided, but doesn't fail if not
export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    req.user = null;
    return next();
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, env.jwt.secret);
    req.user = decoded;
    next();
  } catch (error) {
    // Invalid token, continue without user
    req.user = null;
    next();
  }
};