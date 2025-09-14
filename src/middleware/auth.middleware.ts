import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { userService } from '../features/users/services/user.service';
import { env } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'No token provided' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, env.jwtSecret) as { userId: string };
    
    // Get user from the token
    const user = await userService.getUserById(decoded.userId);
    if (!user || !user.id) {
      return res.status(401).json({ 
        status: 'fail',
        message: 'User not found' 
      });
    }

    // Ensure we only pass the required user properties
    req.user = {
      id: user.id,
      email: user.email
    };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
