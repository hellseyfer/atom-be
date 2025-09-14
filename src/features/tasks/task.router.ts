import { Router } from 'express';
import { 
  createTask, 
  getUserTasks, 
  getTask, 
  updateTask, 
  deleteTask 
} from './controllers/task.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// All task routes require authentication
router.use(authenticate);

// Create a new task for the authenticated user
router.post('/tasks', ...createTask);

// Get all tasks for the authenticated user
router.get('/tasks', ...getUserTasks);

// Get a specific task for the authenticated user
router.get('/tasks/:id', ...getTask);

// Update a task for the authenticated user
router.patch('/tasks/:id', ...updateTask);

// Delete a task for the authenticated user
router.delete('/tasks/:id', ...deleteTask);

export const taskRouter = router;
