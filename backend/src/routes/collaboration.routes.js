import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = new Router();

router.use(verifyJWT);

router.route('/document/c/:documentId/collaborator').post().delete().put()
