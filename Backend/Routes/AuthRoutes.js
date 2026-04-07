import express from 'express';
import { CheckAuth, Login, Signup , Logout } from '../Controllers/AuthControllers.js';

const authRouter = express.Router();

authRouter.post('/signup', Signup);
authRouter.post('/login', Login);
authRouter.get('/check', CheckAuth);
authRouter.get('/logout', Logout);

export default authRouter;
