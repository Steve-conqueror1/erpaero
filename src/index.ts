import express, { Express, Request, NextFunction, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import 'reflect-metadata';
import cors from 'cors';
import createHttpError, { isHttpError } from 'http-errors';
const cookieParser  = require("cookie-parser")


import { AppDataSource } from '../data-source';
import { authRoutes, userRoutes } from './routes';
import { checkAuth } from './middleware';
import {redisClient} from "./utils/redisCli";

const app: Express = express();
dotenv.config();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())


app.use('/api/auth', authRoutes);
app.use(checkAuth);
app.use('/api/info', userRoutes);

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  next(createHttpError(404, '404 - endpoint не существует'));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = 'Что-то пошло не так!';
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }



  return res.status(statusCode).json({
    message: errorMessage,
  });
});



AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening to port ${PORT} `);
    });
    redisClient.connect()
  })
  .catch((error: Error) => {
    console.log(error.message);
  });
