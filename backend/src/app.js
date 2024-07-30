import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import documentRouter from './routes/document.routes.js';
import collaborationRouter from './routes/collaboration.routes.js';
import favouriteRouter from './routes/favourite.routes.js';
import publicRouter from './routes/public.routes.js';

const app = express();

// defining middlewares
app.use(
  cors({
    origin: `${process.env.CORS_ORIGIN}`,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: '16kb' }));
app.use(urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.get('/', (_, res) => {
  res.send('WELCOME');
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/documents', documentRouter);
app.use('/api/v1/collaborations', collaborationRouter);
app.use('/api/v1/favourite', favouriteRouter);
app.use('/api/v1/public', publicRouter)

export { app };