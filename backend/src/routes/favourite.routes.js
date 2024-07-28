import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  checkIsFavourite,
  getFavourieDocuments,
  toggleFavourite,
} from '../controllers/favourite.controller.js';

const router = Router();

router.use(verifyJWT);

router.route('/d/').get(getFavourieDocuments);

router.route('/d/:documentId').get(checkIsFavourite).post(toggleFavourite);

export default router;
