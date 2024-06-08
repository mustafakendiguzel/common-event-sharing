import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export const validateRequest = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let structureClass = plainToClass(schema, req.body);
    const error = await validate(structureClass);

    if (error.length > 0) {
      return res.status(400).json({ error });
    }

    next();
  };
};
