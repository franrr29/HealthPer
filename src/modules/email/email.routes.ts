import { Router } from 'express';
import { authMiddle } from '../../middleware/auth.middleware';
import { previewPatientEmailController, sendPatientEmailController } from './email.controller';

const router = Router();

router.post('/consultations/:id/email-content', authMiddle, previewPatientEmailController);
router.post('/consultations/:id/send-email', authMiddle, sendPatientEmailController);

export default router;