import express from 'express';
import {
    getPendingIdeas,
    getApprovedIdeas,
    getRejectedIdeas,
    approveIdea,
    rejectIdea,
    updateIdeaStage
} from '../controllers/adminController.js';
import { authenticate } from '../middleware/auth.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticate, isAdmin);

router.get('/ideas/pending', getPendingIdeas);
router.get('/ideas/approved', getApprovedIdeas);
router.get('/ideas/rejected', getRejectedIdeas);

router.patch('/ideas/:id/approve', approveIdea);
router.patch('/ideas/:id/reject', rejectIdea);
router.patch('/ideas/:id/stage', updateIdeaStage);

export default router;
