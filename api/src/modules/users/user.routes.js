import { Router } from 'express';
import { UserController } from './user.controller.js';
import { validate } from '../../middleware/validateRequest.js';
import { registerSchema, loginSchema, updateSchema } from './user.validation.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
import { permissionMiddleware } from '../../middleware/permissionMiddleware.js';

const router = Router();

/**
 * @openapi
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 */
router.post('/register', validate(registerSchema), UserController.register);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     summary: Login
 */
router.post('/login', validate(loginSchema), UserController.login);

router.get('/me', authMiddleware, UserController.me);

router.get('/', authMiddleware, permissionMiddleware('user.list'), UserController.list);

router.put('/:user_id', authMiddleware, permissionMiddleware('user.update'),  validate(updateSchema), UserController.update);


export default router;
