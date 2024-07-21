import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
import {
  isLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
  updateProfileImage,
  updateUserDetails,
  updateUserPassword,
} from '../controllers/user.controller.js';

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

router.route('/login').post(loginUser);

router.use(verifyJWT);

router.route('/logout').post(logoutUser);

router.route('/profile-image').patch(upload.single('profileImage'), updateProfileImage);

router.route('/update-account').patch(updateUserDetails);

router.route("/update-password").patch(updateUserPassword);

router.route('/check-auth').get(isLoggedIn);

export default router;
