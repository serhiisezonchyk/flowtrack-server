import { NextFunction, Request, Response } from 'express';
import { ZodError, z } from 'zod';

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationDetails = error.errors.map((issue: any) => ({
          path: issue.path.at(0),
          message: issue.message,
        }));
        res.status(401).json({ error: 'Validation error', details: validationDetails });
      } else {
        res.status(501).json({ message: 'Internal server error' });
      }
    }
  };
}
