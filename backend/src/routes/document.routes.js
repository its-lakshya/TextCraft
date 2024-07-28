import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  createDocument,
  deleteDocument,
  getUserDocuments,
  getDocumentByID,
  getSharedDocuments,
  getAllDocuments,
  renameDocument,
  updateDocumentContent,
  getDocumentOwner,
} from '../controllers/document.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d').get(getAllDocuments).post(createDocument);

router.route('/d/user').get(getUserDocuments);

router.route('/d/shared').get(getSharedDocuments);

router.route('/d/:documentId').get(getDocumentByID).delete(deleteDocument).patch(updateDocumentContent);

router.route('/d/:documentId/owner').get(getDocumentOwner)

router
  .route('/d/rename/:documentId')
  .patch(renameDocument)

export default router;
