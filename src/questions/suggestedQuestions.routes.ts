import { Router } from 'express';
import { authMiddle } from '../middleware/auth.middleware';
import { suggestedQuestionsController } from './suggestedQuestions.controller';

const router = Router();

router.post("/suggest-questions", authMiddle, suggestedQuestionsController);

export default router;