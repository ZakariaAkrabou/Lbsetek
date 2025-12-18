import express from 'express';
import { register,verifyEmail,login,refreshTokenController,forgetPasswordController,resetPasswordController } from '../../controllers/auth.controller';
import { authenticated, isVerified } from '../../middlewares/auth.middleware';
import upload from '../../config/multerConfig';
import { validateRegister,validateTailor, validateLogin, validateForgotPassword, validateResetPassword,  } from '../../middlewares/validationMiddleware';





const router = express.Router();

router.post('/register', upload, validateRegister, register );
router.get('/verify-email', verifyEmail);
router.post('/login',validateLogin, login);
router.post('/refresh-token', refreshTokenController);
router.post('/forget-password',validateForgotPassword, forgetPasswordController);
router.post('/reset-password',validateResetPassword, resetPasswordController);
export default router;

