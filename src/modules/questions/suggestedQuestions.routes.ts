import { Router } from 'express';
import { authMiddle } from '../../middleware/auth.middleware';
import { aiLimiter } from '../../middleware/raterLimiter';
import { suggestedQuestionsController } from './suggestedQuestions.controller';

const router = Router();

router.post("/suggest-questions", authMiddle, aiLimiter, suggestedQuestionsController);

export default router;