import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { addCollaborator, createDocument, deleteDocument, getAllDocuments, getDocumentByID, updateDocument } from '../controllers/document.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d/').get(getAllDocuments).post(createDocument);

router.route('/d/:documentId').get(getDocumentByID).patch(updateDocument).delete(deleteDocument);

router.route('/d/:documentId/add-collaborator').put(addCollaborator);

export default router;
