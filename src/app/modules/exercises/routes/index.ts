import { Router } from 'express';
import { globalLimiter, sensitiveLimiter } from '../../../middlewares/rate-limiter';
import { authGuard } from '../../../middlewares/authGuard';
import { adminGuard } from '../../../middlewares/requireAdmin';
import { createExercise } from '../controllers/createexercice';
import { deleteExercise } from '../controllers/deleteExercice';
import { getExerciceDetails } from '../controllers/getexerciceDetails';
import { getAllExercices } from '../controllers/getAllExercices';
import { addExerciseImage } from '../controllers/uploadImage';
import { replaceExerciseImage } from '../controllers/replaceImage';
import { removeExerciseImage } from '../controllers/removeImage';
import { uploadImage } from '../../../middlewares/uploadImage';
import { updateExercise } from '../controllers/updateExercise';



const exerciceRouter = Router();


exerciceRouter.post('/create', globalLimiter, authGuard, adminGuard, createExercise);
exerciceRouter.delete('/delete/:id', globalLimiter, authGuard, adminGuard, deleteExercise);


exerciceRouter.get('/exercice-detail/:id', globalLimiter, getExerciceDetails);
exerciceRouter.get('/all-exercices', globalLimiter, getAllExercices);
exerciceRouter.put('/exercises/:id', globalLimiter, authGuard, adminGuard, updateExercise);


exerciceRouter.post('/exercises/:id/image', sensitiveLimiter, authGuard, adminGuard, uploadImage.single('image'), addExerciseImage);
exerciceRouter.put('/exercises/:id/image', sensitiveLimiter, authGuard, adminGuard, uploadImage.single('image'), replaceExerciseImage);
exerciceRouter.delete('/exercises/:id/image', sensitiveLimiter, authGuard, adminGuard, removeExerciseImage);



export default exerciceRouter;
