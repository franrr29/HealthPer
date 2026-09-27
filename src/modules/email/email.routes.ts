import { Router } from 'express';
import { authMiddle } from '../../middleware/auth.middleware';
import { aiLimiter, emailLimiter } from '../../middleware/raterLimiter';
import { previewPatientEmailController, sendPatientEmailController } from './email.controller';

const router = Router();

router.post('/consultations/:id/email-content', authMiddle, aiLimiter, previewPatientEmailController);
router.post('/consultations/:id/send-email', authMiddle, emailLimiter, sendPatientEmailController);

export default router;