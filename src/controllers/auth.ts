import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { AppDataSource } from '../../data-source';
import { User } from '../entities';
import bcrypt from 'bcrypt';
import JWT from 'jwt-redis';
import { RedisClientType } from 'redis';
import { redisClient } from '../utils/redisCli';

const jwt = new JWT(redisClient as RedisClientType);

interface LoginBody {
  email: string;
  password: string;
}

const userRepository = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  try {
    const { email, password } = body;
    if (!email) {
      throw createHttpError(422, 'Email is required');
    }
    if (!password) {
      throw createHttpError(422, 'Password is required');
    }

    const passwordHashed = await bcrypt.hash(password, 10);
    const existingUser = await userRepository.findOne({ where: { email } });

    if (existingUser) {
      throw createHttpError(422, 'User already exists');
    }

    const newUser = userRepository.create({ email, password: passwordHashed });
    await userRepository.save(newUser);
    const tokenData = { email, id: newUser.id };
    const token = await jwt.sign({...tokenData, jti: "token"}, `${process.env.JWT_SECRET}`, { expiresIn: '10m' });
    const refreshToken = jwt.sign({...tokenData, jti: "refreshToken"}, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' });
    res.header('Authorization', token);
    res.status(201).json({ email: newUser.email, id: newUser.id, token, refreshToken });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body as LoginBody;

  const { email, password } = body;

  try {
    if (!email || !password) {
      throw createHttpError(400, 'Заполните все поля');
    }

    const user = await userRepository.findOne({ where: { email: email }, select: ['id', 'email', 'password'] });

    if (!user) {
      throw createHttpError(404, 'User account not found');
    }

    const passwordMatch = await bcrypt.compare(password, (user as any).password as string);
    if (!passwordMatch) {
      throw createHttpError(401, 'wrong password or email');
    }

    let token;
    let refreshToken;

    try {
      const tokenData = { email, id: user.id };
      token = await jwt.sign({...tokenData, jti: "token"}, `${process.env.JWT_SECRET}`, {
        expiresIn: '10m',
      });

      refreshToken = await  jwt.sign({...tokenData, jti: "refreshToken"}, `${process.env.JWT_SECRET}`, { expiresIn: '1d' });
    } catch (error) {
      next(error);
    }
    res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none' });
    res.header('Authorization', token);
    res.status(201).json({ email: user.email, id: user.id, token, refreshToken });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {

  try {
     await jwt.destroy('token');
     await jwt.destroy("refreshToken");
  }catch (err) {
    next(err)
  }
  res.status(200).json({message: "Logged out"})
};
