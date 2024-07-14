import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCollaborator } from '../controllers/collaboration.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/c/:documentId').post(addCollaborator);

export default router;
