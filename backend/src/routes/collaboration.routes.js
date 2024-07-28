import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCollaborator, getAllCollaborators, getCollaboratorsAccessType, removeCollaborator, updateAccessTypes } from '../controllers/collaboration.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/c/:documentId').get(getAllCollaborators).post(addCollaborator).patch(updateAccebackend/src/routes/collaboration.routes.jsssTypes);

router.route('/c/:documentId/remove').post(removeCollaborator);

router.route('/c/:documentId/access').get(getCollaboratorsAccessType).patch(updateAccessTypes);

export default router;