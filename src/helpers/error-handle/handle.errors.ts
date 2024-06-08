import { NextFunction, Request, Response } from 'express';
import { CustomError } from './errors/custom-error';

export const customErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let customError = err;
  console.log('zaaa', err);

  if (customError.name === 'SyntaxError') {
    customError = new CustomError('Unexpected Syntax', 400);
  }

  console.log('custom', customError);

  if (customError.name === 'ValidationError') {
    customError = new CustomError(err.message, 400);
  }

  res.status(customError.status || 500).json({
    success: false,
    message: customError.message,
  });
};
