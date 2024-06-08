import { config } from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../../app/user/models/user.model';

config();

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('Authorization')?.split(' ')[1];
  req.route;
  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access Denied. No Token Provided!' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET;
    const verified = jwt.verify(token, jwtSecret as string) as UserModel;
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};
