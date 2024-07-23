import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCollaborator, getAllCollaborators, getCollaboratorsAccessType, removeCollaborator, updateAccessTypes, toggleIsPublic } from '../controllers/collaboration.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/c/:documentId').get(getAllCollaborators).post(addCollaborator).delete(removeCollaborator).patch(updateAccessTypes);

router.route('/c/:documentId/access').get(getCollaboratorsAccessType).patch(updateAccessTypes);

router.route('/c/:documentId/public').post(toggleIsPublic);

export default router;