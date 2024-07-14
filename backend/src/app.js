import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// defining middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

// routes import
import userRouter from './routes/user.routes.js';
import documentRouter from './routes/document.routes.js';
import collaborationRouter from './routes/collaboration.routes.js';

// routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/documents', documentRouter);
app.use('api/v1/collaborations', collaborationRouter);

export { app };
