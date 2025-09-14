import { z } from 'zod';

const taskBaseSchema = {
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().max(1000, 'Description is too long').optional(),
  completed: z.boolean().optional(),
};

export const createTaskSchema = z.object({
  body: z.object({
    title: taskBaseSchema.title,
    description: taskBaseSchema.description,
  })
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: taskBaseSchema.title.optional(),
    description: taskBaseSchema.description,
    completed: taskBaseSchema.completed,
  }).refine(data => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  }),
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
    id: z.string().min(1, 'Task ID is required'),
  }),
});

export const getTaskSchema = z.object({
  params: z.object({
    userId: z.string().min(1, 'User ID is required'),
    id: z.string().min(1, 'Task ID is required'),
  }),
});

export const deleteTaskSchema = getTaskSchema;
