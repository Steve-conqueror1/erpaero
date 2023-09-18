import { NextFunction, Request, Response } from 'express';
import { redisClient } from '../utils/redisCli';
import JWT from 'jwt-redis';
import {RedisClientType} from "redis";

const jwt = new JWT(redisClient as RedisClientType);

export const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies['refreshToken'];

  if (!token && !refreshToken) {
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  try {
    (req as any).user = await jwt.verify(token as string, `${process.env.JWT_SECRET}`);

    next();
  } catch (error) {
    if (!refreshToken) {
      return res.status(401).json({ message: 'Access denied. No refresh token' });
    }

    try {
      const decoded = await jwt.verify(refreshToken, `${process.env.JWT_SECRET}`);
      const tokenData = { email: (decoded as any).email, id: (decoded as any).id };
      const accessToken = await jwt.sign(tokenData, `${process.env.JWT_SECRET}`, { expiresIn: 5 });

      res
        .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
        .header('Authorization', accessToken);

        (req as any).user = await jwt.verify(accessToken as string, `${process.env.JWT_SECRET}`)
         next();

    } catch (e) {
      return res.status(401).send('Invalid Token.');
    }
  }
};
