import { Router } from 'express';
import { userRouter } from '../features/users/user.router';

const router = Router();

// Mount the user router
router.use('/users', userRouter);

export default router;
