import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import fs from 'fs';
import { AppDataSource } from '../../data-source';
import { File } from '../entities';
import { promisify } from 'util';

const unlinkAsync = promisify(fs.unlink);
const fileRepository = AppDataSource.getRepository(File);

const filesPath = `${process.cwd()}/uploads`;

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file) {
    throw createHttpError(422, 'file not found');
  }

  try {
    const { filename, destination, mimetype, size } = file;
    const newFile = fileRepository.create({
      name: filename,
      mimeType: mimetype,
      size: size,
      extention: file.originalname.split('.')[1],
    });
    await fileRepository.save(newFile);
    res.status(201).json(newFile);
  } catch (error) {
    next(error);
  }
};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  if (!id) {
    throw createHttpError(422, 'Id is required');
  }

  try {
    const file = await fileRepository.findOne({ where: { id: Number(id) } });

    if (file) {
      await fileRepository.remove(file);

      await unlinkAsync(`${filesPath}/${file.name}`);
      res.status(200).json({ message: 'File deleted successfully' });
    } else {
      throw createHttpError(422, "File with that ID doesn't exist");
    }
  } catch (error) {
    next(error);
  }
};

export const getFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    throw createHttpError(422, 'Id is required');
  }
  try {
    const file = await fileRepository.findOne({ where: { id: Number(id) } });

    if (!file) {
      throw createHttpError(404, 'No such file was found');
    }

    res.status(200).json(file);
  } catch (error) {
    next(error);
  }
};

export const downloadFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id: fileName } = req.params;
  try {
    if (!fileName) {
      throw createHttpError(422, 'Filename is required');
    }

    const filePath = `${filesPath}/${fileName}`;
    res.status(200).download(filePath, (err) => {
      if (err) {
        let newError = err;
        newError.message = 'Нет такого файла';
        next(newError);
      }
    });
  } catch (e) {
    next(e);
  }
};
export const updateFile = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) {
    throw createHttpError(422, 'file not found');
  }

  try {
    const existingFile = await fileRepository.findOne({ where: { id: Number(id) } });

    if (!existingFile) {
      throw createHttpError(404, 'file to update not found');
    }

    await unlinkAsync(`${filesPath}/${existingFile.name}`);

    const { filename, destination, mimetype, size } = file;
    existingFile.name = filename;
    existingFile.mimeType = mimetype;
    existingFile.size = size;
    existingFile.extention = file.originalname.split('.')[1];

    await fileRepository.save(existingFile);

    res.status(201).json(existingFile);
  } catch (error) {
    next(error);
  }
};
