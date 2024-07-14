import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import { loginUser, registerUser } from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'profileImage',
      maxCount: 1,
    },
  ]),
  registerUser,
);

router.route("/login").post(loginUser)

router.use(verifyJWT);

export default router;
