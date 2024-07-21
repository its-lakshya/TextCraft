import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';
import { getFavourieDocuments, toggelFavourite } from '../controllers/favourite.controller';

const router = Router;

router.use(verifyJWT);

router.route('/d/').get(getFavourieDocuments)
router.route('/toggle/d/:documentId').post(toggelFavourite);

export default router;
