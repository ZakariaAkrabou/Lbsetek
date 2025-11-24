import express from 'express';
import { register,verifyEmail } from '../../controllers/auth.controller';
import { authenticated, isVerified } from '../../middlewares/auth.middleware';
import upload from '../../config/multerConfig';
const router = express.Router();

router.post('/register', upload, register );
router.get('/verify-email', verifyEmail);
export default router;
