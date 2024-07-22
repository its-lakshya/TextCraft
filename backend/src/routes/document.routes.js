import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDocument, deleteDocument, getUserDocuments, getDocumentByID, updateDocument, getSharedDocuments } from '../controllers/document.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d').post(createDocument);

router.route('/d/user').get(getUserDocuments);

router.route('/d/shared').get(getSharedDocuments);

router.route('/d/:documentId').get(getDocumentByID).patch(updateDocument).delete(deleteDocument);

export default router;
