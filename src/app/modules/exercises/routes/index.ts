import { Router } from 'express';
import { globalLimiter } from '../../../middlewares/rate-limiter';
import { authGuard } from '../../../middlewares/authGuard';
import { adminGuard } from '../../../middlewares/requireAdmin';
import { createExercise } from '../controllers/createexercice';
import { deleteExercise } from '../controllers/deleteExercice';
import { getExerciceDetails } from '../controllers/getexerciceDetails';
import { getAllExercices } from '../controllers/getAllExercices';



const exerciceRouter = Router();


exerciceRouter.post('/create', globalLimiter, authGuard, adminGuard, createExercise);
exerciceRouter.delete('/delete/:id', globalLimiter, authGuard, adminGuard, deleteExercise);


exerciceRouter.get('/exercice-detail/:id', globalLimiter, getExerciceDetails);
exerciceRouter.get('/all-exercices', globalLimiter, getAllExercices);



export default exerciceRouter;