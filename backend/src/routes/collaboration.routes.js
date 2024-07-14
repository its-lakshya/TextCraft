import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { addCollaborator } from '../controllers/collaboration.controller';

const router = new Router();

router.use(verifyJWT);

router.route('/c/:documentId').post(addCollaborator).delete().put();

export default router;
