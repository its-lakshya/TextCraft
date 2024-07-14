import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { createDocument, deleteDocument } from '../controllers/document.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d/').post(createDocument);

router.route('/d/:documentId').delete(deleteDocument);

export default router;
