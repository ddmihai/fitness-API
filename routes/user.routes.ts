import { Router, Request, Response } from 'express';
import signupController from '../controllers/users/createUsers/signup.controller';
import { userSignupValidationSchema } from '../middlewares/validators/signup';
import { validateRequest } from '../middlewares/validators/validator.middleware';
import { loginUser } from '../controllers/users/loginUser/loginUser.controller';
import { authenticationLimiter } from '../middlewares/security/rateLimiter';
import { jwtAuth } from '../middlewares/auth/jwtAuth';
import { getLoggedinUser } from '../controllers/users/getLoggedInUser/getLoggedInUser.controller';

const userRouter = Router();

// Signup route
userRouter.post('/signup', userSignupValidationSchema, validateRequest, signupController);

// Login route
userRouter.post('/login', authenticationLimiter, loginUser);


// Get loggedin user
userRouter.get('/logged-user', jwtAuth, getLoggedinUser);



// IMPLEMENTATIONS I HAVENT IMPLEMENTED FOR NOW

// Edit user route
userRouter.put('/:id', (req: Request, res: Response) => {
    // Call edit controller here
});

// Delete user route
userRouter.delete('/:id', (req: Request, res: Response) => {
    // Call delete controller here
});


// Filter users (e.g., by query params)
userRouter.get('/filter', (req: Request, res: Response) => {
    // Call filter users controller here
});

export default userRouter;