import { Response, NextFunction } from 'express';
import { Request } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import { userService } from '../services/user.service';
import { 
  registerUserSchema,
  loginUserSchema,
  getUserSchema, 
} from '../validations/user.validation';
import { validate } from '../../../middleware/validation.middleware';

import { env } from '../../../config/env';

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
export const register = [
  validate(registerUserSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { email, password } = req.body;
      const user = await userService.createUser(email, password);
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
      }
      
      // Generate token for the new user
      const token = jwt.sign(
        { userId: user.id },
        env.jwtSecret,
        { expiresIn: '1d' }
      );
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(201).json({
        status: 'success',
        data: { 
          user: userWithoutPassword,
          token 
        }
      });
    } catch (err: unknown) {
      const error = err as any;
      if (error.code === 11000) {
        error.statusCode = 409;
        error.message = 'Email already in use';
      }
      return next(error);
    }
  }
];

/**
 * @route POST /api/auth/login
 * @desc Login user and get token
 * @access Public
 */
export const login = [
  validate(loginUserSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { email, password } = req.body;
      const { user, token } = await userService.loginUser(email, password);
      
      res.status(200).json({
        status: 'success',
        data: { 
          user,
          token 
        }
      });
    } catch (err: unknown) {
      const error = err as any;
      error.statusCode = error.statusCode || 401;
      error.message = error.message || 'Invalid credentials';
      return next(error);
    }
  }
];

/**
 * @route GET /api/users/:email
 * @desc Get user by email
 * @access Public
 */
export const getUser = [
  validate(getUserSchema),
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      const { email } = req.params;
      const user = await userService.findUserByEmail(email);
      
      if (!user) {
        const error = new Error('User not found') as any;
        error.statusCode = 404;
        return next(error);
      }
      
      res.json({
        status: 'success',
        data: { user }
      });
    } catch (err: unknown) {
      return next(err);
    }
  }
];

/**
 * @route GET /api/users/me
 * @desc Get current user
 * @access Private
 */
export const getMe = [
  // Add auth middleware here
  async (req: Request, res: Response, next: NextFunction): Promise<void | Response> => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: 'fail',
          message: 'Not authenticated'
        });
      }
      
      const user = await userService.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          status: 'fail',
          message: 'User not found'
        });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json({
        status: 'success',
        data: { user: userWithoutPassword }
      });
    } catch (err: unknown) {
      return next(err);
    }
  }
];
