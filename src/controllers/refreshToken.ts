import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies['refreshToken'];
  if (!refreshToken) {
    throw createHttpError(401, 'Access denied, No Access token');
  }
  try {
    const decoded = jwt.verify(refreshToken, `${process.env.JWT_SECRET}`);
    const accessToken = jwt.sign(
      { email: (decoded as any).email, id: (decoded as any).id },
      `${process.env.JWT_SECRET}`,
      {
        expiresIn: '1h',
      },
    );

    res.header('Authorization', accessToken);
    res.status(200).json({ email: (decoded as any).email, id: (decoded as any).id, token: accessToken });
  } catch (err) {
    next(err);
  }
};
