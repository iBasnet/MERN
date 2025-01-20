import express from 'express';
import { login, logout, register, sendVerifyOtp, verifyEmail } from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/verify/otp', sendVerifyOtp);
authRouter.post('/verify/email', verifyEmail);

export default authRouter;