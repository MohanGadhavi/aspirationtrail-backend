import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import dbConnection from './Database/dbConnection.js';
import { errorMiddleware } from './middlewares/error.js';
import userRouter from './Router/userRoutes.js';
import studentRouter from './Router/studentRoutes.js';

const app = express();

dotenv.config({ path: './config/.env' });

app.use(
  cors({
    origin: process.env.DASHBOARD_URL, // Replace with frontend URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allowed methods
    credentials: true, // Allow cookies and credentials
  })
);

app.options(
  '*',
  cors({
    origin: process.env.DASHBOARD_URL,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

dbConnection();
app.use(errorMiddleware);

app.use('/api/v1/user', userRouter);
app.use('/api/v1/student', studentRouter);

export default app;
