import { Router, Request, Response } from 'express';
import signupController from '../controllers/users/createUsers/signup.controller';
import { userSignupValidationSchema } from '../middlewares/validators/signup';
import { validateRequest } from '../middlewares/validators/validator.middleware';

const userRouter = Router();

// Signup route
userRouter.post('/signup', userSignupValidationSchema, validateRequest, signupController);




// Login route
userRouter.post('/login', (req: Request, res: Response) => {
    // Call login controller here
});

// Edit user route
userRouter.put('/:id', (req: Request, res: Response) => {
    // Call edit controller here
});

// Delete user route
userRouter.delete('/:id', (req: Request, res: Response) => {
    // Call delete controller here
});

// Get all users
userRouter.get('/', (req: Request, res: Response) => {
    // Call get users controller here
});

// Filter users (e.g., by query params)
userRouter.get('/filter', (req: Request, res: Response) => {
    // Call filter users controller here
});

export default userRouter;