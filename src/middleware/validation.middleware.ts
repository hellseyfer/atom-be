import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { Request } from 'express-serve-static-core';

interface ZodError {
  errors: Array<{
    code: string;
    path: string[];
    message: string;
  }>;
  name: string;
}

export const validate = (schema: z.ZodSchema) => 
  (req: Request, res: Response, next: NextFunction): void | Response => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error: unknown) {
      if (error instanceof Error && 'errors' in error) {
        const zodError = error as unknown as ZodError;
        return res.status(400).json({
          status: 'error',
          message: 'Validation Error',
          errors: zodError.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };
