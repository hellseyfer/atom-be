import { Router } from 'express';
import { register, login, getMe } from './controllers/user.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Auth routes (public)
router.post('/auth/register', ...register);
router.post('/auth/login', ...login);

// Protected routes
router.get('/users/me', authenticate, ...getMe);

export const userRouter = router;
