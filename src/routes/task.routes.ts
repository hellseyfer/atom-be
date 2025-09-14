import { Router } from 'express';
import { 
  createTask, 
  getUserTasks, 
  getTask, 
  updateTask, 
  deleteTask 
} from '../features/tasks';

const router = Router();

// POST /api/users/:userId/tasks - Create a new task
router.post('/', ...createTask);

// GET /api/users/:userId/tasks - Get all tasks for a user
router.get('/', ...getUserTasks);

// GET /api/users/:userId/tasks/:id - Get a specific task
router.get('/:id', ...getTask);

// PATCH /api/users/:userId/tasks/:id - Update a task
router.patch('/:id', ...updateTask);

// DELETE /api/users/:userId/tasks/:id - Delete a task
router.delete('/:id', ...deleteTask);

export default router;
