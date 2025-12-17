import { Router } from 'express';
import { createUser } from '../controllers/createUser';
import { authLimiter } from '../../../middlewares/rate-limiter';
import { loginUser } from '../controllers/loginUser';
import { authGuard } from '../../../middlewares/authGuard';
import { getCurrentUser } from '../controllers/getCurrentUser';


const authrouter = Router();


authrouter.post('/register', authLimiter, createUser);
authrouter.post('/login', authLimiter, loginUser);

authrouter.get('/me', authLimiter, authGuard, getCurrentUser);


export default authrouter;
