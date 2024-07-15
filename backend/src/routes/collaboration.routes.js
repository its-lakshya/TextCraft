import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCollaborator, removeCollaborator, updateAccessTypes } from '../controllers/collaboration.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/c/:documentId').post(addCollaborator).delete(removeCollaborator).patch(updateAccessTypes);

export default router;