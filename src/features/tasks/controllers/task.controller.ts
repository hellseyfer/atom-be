import { Request, Response } from 'express';
import { taskService } from '../services/task.service';
import { 
  createTaskSchema, 
  updateTaskSchema, 
  getTaskSchema, 
  deleteTaskSchema 
} from '../validations/task.validation';
import { validate } from '../../../middleware/validation.middleware';
import { AuthRequest } from '../../../middleware/auth.middleware';

/**
 * @route POST /api/tasks
 * @desc Create a new task for the authenticated user
 * @access Private
 */
export const createTask = [
  validate(createTaskSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      const { title, description } = req.body;
      if (!req.user) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Not authenticated' 
        });
      }
      const userId = req.user.id;

      const task = await taskService.createTask({ 
        title, 
        description, 
        userId 
      });
      
      res.status(201).json({
        status: 'success',
        data: { task }
      });
    } catch (error) {
      throw error;
    }
  }
];

/**
 * @route GET /api/tasks
 * @desc Get all tasks for the authenticated user
 * @access Private
 */
export const getUserTasks = [
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Not authenticated' 
        });
      }
      const userId = req.user.id;
      const tasks = await taskService.getUserTasks(userId);
      
      res.json({
        status: 'success',
        results: tasks.length,
        data: { tasks }
      });
    } catch (error) {
      throw error;
    }
  }
];

/**
 * @route GET /api/tasks/:taskId
 * @desc Get a specific task for the authenticated user
 * @access Private
 */
export const getTask = [
  validate(getTaskSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Not authenticated' 
        });
      }
      
      const { id } = req.params;
      const userId = req.user.id;
      
      const task = await taskService.getTaskById(id, userId);
      
      if (!task) {
        return res.status(404).json({
          status: 'fail',
          message: 'Task not found'
        });
      }
      
      // Ensure the task belongs to the authenticated user
      if (task.userId !== userId) {
        return res.status(403).json({
          status: 'fail',
          message: 'You are not authorized to access this task'
        });
      }
      
      res.json({
        status: 'success',
        data: { task }
      });
    } catch (error) {
      throw error;
    }
  }
];

/**
 * @route PATCH /api/tasks/:taskId
 * @desc Update a task for the authenticated user
 * @access Private
 */
export const updateTask = [
  validate(updateTaskSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Not authenticated' 
        });
      }
      
      const { id } = req.params;
      const userId = req.user.id;
      const updateData = req.body;
      
      const existingTask = await taskService.getTaskById(id, userId);
      
      if (!existingTask) {
        return res.status(404).json({
          status: 'fail',
          message: 'Task not found'
        });
      }
      
      // Ensure the task belongs to the authenticated user
      if (existingTask.userId !== userId) {
        return res.status(403).json({
          status: 'fail',
          message: 'You are not authorized to update this task'
        });
      }
      
      const task = await taskService.updateTask(id, userId, updateData);
      
      res.json({
        status: 'success',
        data: { task }
      });
    } catch (error) {
      throw error;
    }
  }
];

/**
 * @route DELETE /api/tasks/:taskId
 * @desc Delete a task for the authenticated user
 * @route DELETE /api/users/:userId/tasks/:id
 * @desc Delete a task
 * @access Private
 */
export const deleteTask = [
  validate(deleteTaskSchema),
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          status: 'fail',
          message: 'Not authenticated' 
        });
      }
      
      const { id } = req.params;
      const userId = req.user.id;
      
      const success = await taskService.deleteTask(id, userId);
      
      if (!success) {
        const error = new Error('Task not found') as any;
        error.statusCode = 404;
        throw error;
      }
      
      res.status(204).send();
    } catch (error: any) {
      throw error;
    }
  }
];
