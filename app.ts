import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import userRouter from './routes/user.routes';
import { authenticationLimiter, exerciceLimiter } from './middlewares/security/rateLimiter';
import exerciceRouter from './routes/exercice.routes';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));



// Basic page route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Fitness Personal Training API' });
});

app.use('/api/v1/users', authenticationLimiter, userRouter);
app.use('/api/v1/exercices', exerciceLimiter, exerciceRouter);


// 404 Error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Not Found' });
});

export default app;