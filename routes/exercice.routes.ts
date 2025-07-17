import { Router } from 'express';
import { exerciceLimiter } from '../middlewares/security/rateLimiter';
import { exerciseValidationSchema } from '../middlewares/validators/createExercice.middleware';
import { validateRequest } from '../middlewares/validators/validator.middleware';
import { createExercice } from '../controllers/exercices/createExercice/createExercice.controller';
import { requirePermission } from '../middlewares/auth/allowCreationOdExercices';
import { PERMISSIONS } from '../helpers/constants/permissions.constants';


// import { getExercisesByTargetMuscle } from '../controllers/exercices/getExerciceByTargetMuscle/getExerciceByTargetMuscle';
// import getAllExercices from '../controllers/exercices/getAllExercice/getAllExercices.controller';



const exerciceRouter = Router();

exerciceRouter.post('/create-exercice', exerciceLimiter,
    requirePermission(PERMISSIONS.admin.CREATE_EXERCICES || PERMISSIONS.trainer.CREATE_EXERCICES),
    exerciseValidationSchema, validateRequest, createExercice);




// exerciceRouter.get('/get-exercice-by-target-muscle/:targetMuscle', exerciceLimiter, getExercisesByTargetMuscle);
// exerciceRouter.get('/get-all-exercices', exerciceLimiter, getAllExercices);


export default exerciceRouter;