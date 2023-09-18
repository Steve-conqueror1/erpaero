import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import fs from "fs";
import { AppDataSource } from '../../data-source';
import { File } from '../entities';
import { promisify }  from 'util'


const unlinkAsync = promisify(fs.unlink)
const fileRepository = AppDataSource.getRepository(File);

export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;

  const file = req.file;
  if (!file) {
    throw createHttpError(422, 'file not found');
  }

  try {
      const { filename, destination, mimetype, size } = file; // название, расширение, MIME type, размер, дата загрузки;
  const newFile = fileRepository.create({ name: filename, mimeType: mimetype, size: size, extention: file.originalname.split('.')[1] });
  await fileRepository.save(newFile)
    res.status(201).json(newFile)
  }catch (error) {
    next(error)
  }

};

export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
const {id} = req.params

  if(!id){
    throw createHttpError(422, "Id is required")
  }

  try{
      const file = await fileRepository.findOne({where: {id: Number(id)}})

    if(file){
        await  fileRepository.remove(file)
       const filesPath = `${process.cwd()}/uploads`;
      await unlinkAsync(`${filesPath}/${file.name}`)
      res.status(200).json({message: "File deleted successfully"})
    }else{
       throw createHttpError(422, "File with that ID doesn't exist")
    }



  }catch (error) {
    next(error)
  }


}


export const getFile =  async (req: Request, res: Response, next: NextFunction) => {
  const {id} = req.params
  if(!id){
    throw createHttpError(422, "Id is required")
  }
    try {
      const file = await fileRepository.findOne({where: {id: Number(id)}})

      if(!file){
         throw createHttpError(404, "No such file was found")
      }

      res.status(200).json(file)
    }catch (error) {
      next(error)
    }

}

