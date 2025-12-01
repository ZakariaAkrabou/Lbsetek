import express from 'express';
import { register,verifyEmail,login,refreshTokenController,forgetPasswordController,resetPasswordController } from '../../controllers/auth.controller';
import { authenticated, isVerified } from '../../middlewares/auth.middleware';
import upload from '../../config/multerConfig';
const router = express.Router();

router.post('/register', upload, register );
router.get('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh-token', refreshTokenController);
router.post('/forget-password',forgetPasswordController);
router.post('/reset-password',resetPasswordController);
export default router;

