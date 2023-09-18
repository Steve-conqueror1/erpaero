import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { AppDataSource } from '../../data-source';
import { User } from '../entities';

const userRepository = AppDataSource.getRepository(User);

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = (req as any).user;
    const user = await userRepository.findOne({ where: { id: userData?.id } });

    if (!user) {
      throw createHttpError(404, 'User with this Id not found');
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};
