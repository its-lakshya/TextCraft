import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { toggelFavourite } from '../controllers/favourite.controller';

const router = Router;

router.use(verifyJWT);

router.route('toggle/d/:documentId').post(toggelFavourite);

export default router;
