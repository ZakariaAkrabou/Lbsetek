import express from 'express';
import { banUser, updateTailorApprovalStatus, deleteUser, getAllUsers } from '../../controllers/admin.controller';
import { authenticated , isAdmin} from '../../middlewares/auth.middleware';
const router = express.Router();


router.use(authenticated, isAdmin);
router.patch('/users/:userId/ban', banUser);
router.patch('/tailor/approval/:tailorId', updateTailorApprovalStatus);
router.delete('/user/:userId', deleteUser);
router.get('/users', getAllUsers);

export default router;