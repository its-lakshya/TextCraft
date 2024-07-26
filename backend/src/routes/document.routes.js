import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDocument, deleteDocument, getUserDocuments, getDocumentByID, updateDocument, getSharedDocuments, getAllDocuments, renameDocument } from '../controllers/document.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d').get(getAllDocuments).post(createDocument);

router.route('/d/user').get(getUserDocuments);

router.route('/d/shared').get(getSharedDocuments);

router.route('/d/:documentId').get(getDocumentByID).delete(deleteDocument);
router.route('/d/:documentId/rename').get(getDocumentByID).patch(renameDocument).delete(deleteDocument);

export default router;
