import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userRouter from './routes/user.routes';
import { authenticationLimiter, exerciceLimiter } from './middlewares/security/rateLimiter';
import exerciceRouter from './routes/exercice.routes';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.config';
import workoutRouter from './routes/workouts.routes';



const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.set('trust proxy', 1); // or true
app.use(cookieParser());


// documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Basic page route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'Welcome to the Fitness Personal Training API' });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/exercices', exerciceRouter);
app.use('/api/v1/workouts', workoutRouter);


// 404 Error handler
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({ error: 'Not Found' });
});

export default app;