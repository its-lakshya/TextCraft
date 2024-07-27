import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getPublicAccessInformation, setPublicAccessType, toggleIsPublic } from '../controllers/public.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/:documentId').post(toggleIsPublic).post(setPublicAccessType).get(getPublicAccessInformation);



export default router;