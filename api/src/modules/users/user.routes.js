import { Router } from 'express';
import { UserController } from './user.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateSchema, searchUsersSchema } from './user.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';

const router = Router();


router.post('/register', validate(registerSchema), UserController.register);

router.post('/login', validate(loginSchema), UserController.login);

router.get('/me', authMiddleware, UserController.me);

router.get('/search', authMiddleware, validate(searchUsersSchema), UserController.search);


export default router;
