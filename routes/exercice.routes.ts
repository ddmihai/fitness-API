import { Router } from 'express';
import { exerciceLimiter } from '../middlewares/security/rateLimiter';
import { exerciseValidationSchema } from '../middlewares/validators/createExercice.middleware';
import { validateRequest } from '../middlewares/validators/validator.middleware';
import { createExercice } from '../controllers/exercices/createExercice/createExercice.controller';
import { requirePermission } from '../middlewares/auth/allowCreationOdExercices';
import { PERMISSIONS } from '../helpers/constants/permissions.constants';
import { upload } from '../middlewares/uploads/uploads.middleware';
import { uploadExerciceImages } from '../controllers/exercices/uploadImagesExercice/uploadImagesExercice.controller';
import { deleteImagesFromExercice } from '../controllers/exercices/deleteImages/deleteImages.controller';
import { deleteExercice } from '../controllers/exercices/deleteExercice/deleteExercice.controller';


// import { getExercisesByTargetMuscle } from '../controllers/exercices/getExerciceByTargetMuscle/getExerciceByTargetMuscle';
// import getAllExercices from '../controllers/exercices/getAllExercice/getAllExercices.controller';



const exerciceRouter = Router();

exerciceRouter.post('/create-exercice',
    exerciceLimiter,
    requirePermission(PERMISSIONS.admin.CREATE_EXERCICES),
    exerciseValidationSchema,
    validateRequest,
    createExercice
);


exerciceRouter.post('/upload',
    exerciceLimiter,
    upload.single('image'),
    requirePermission(PERMISSIONS.admin.CREATE_EXERCICES),
    uploadExerciceImages
);


exerciceRouter.delete('/delete-image/:exerciceId/:imageId',
    exerciceLimiter,
    requirePermission(PERMISSIONS.admin.CREATE_EXERCICES),
    deleteImagesFromExercice
);


exerciceRouter.delete('/delete-exercice/:exerciceId',
    exerciceLimiter,
    requirePermission(PERMISSIONS.admin.DELETE_EXERCICE),
    deleteExercice
);


// exerciceRouter.get('/get-exercice-by-target-muscle/:targetMuscle', exerciceLimiter, getExercisesByTargetMuscle);
// exerciceRouter.get('/get-all-exercices', exerciceLimiter, getAllExercices);


export default exerciceRouter;