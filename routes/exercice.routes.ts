import { Router } from 'express';
import { exerciceLimiter } from '../middlewares/security/rateLimiter';
import { getExercisesByTargetMuscle } from '../controllers/exercices/getExerciceByTargetMuscle/getExerciceByTargetMuscle';



const exerciceRouter = Router();


exerciceRouter.get('/get-exercice-by-target-muscle/:targetMuscle', exerciceLimiter, getExercisesByTargetMuscle);


export default exerciceRouter;