import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../../data-source';
import { File } from '../entities';

const fileRepository = AppDataSource.getRepository(File);

export const createFile = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
};
