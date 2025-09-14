declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

// Define AppError type
declare class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number);
}

export {};
