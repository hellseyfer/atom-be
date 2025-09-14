import { Response, NextFunction } from 'express';
import { Request } from 'express-serve-static-core';

interface AppError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  errors?: Record<string, string> | string[];
  isOperational?: boolean;
  keyValue?: Record<string, any>;
  errorsArray?: Array<{ message: string }>;
}

const handleDuplicateFieldsDB = (err: AppError): AppError => {
  const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field';
  const message = `Duplicate field value: ${field}. Please use another value!`;
  const error = new Error(message) as AppError;
  error.statusCode = 400;
  error.status = 'fail';
  error.isOperational = true;
  return error;
};

const handleValidationErrorDB = (err: AppError): AppError => {
  const errors = err.errorsArray?.map(el => el.message) || ['Validation failed'];
  const message = `Invalid input data. ${errors.join('. ')}`;
  const error = new Error(message) as AppError;
  error.statusCode = 400;
  error.status = 'fail';
  error.errors = errors;
  error.isOperational = true;
  return error;
};

const sendErrorDev = (err: AppError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);

    sendErrorProd(error, res);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error): void => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});
