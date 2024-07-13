import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;

  if ([userName, email, fullName, password, profileImage].some(field => field.trim() === '')) {
    throw new apiError(400, 'Bad request: Missing required details for registration');
  }

  const existedUser = User.findOne({
    $or: [{ userName, email }],
  });

  if (existedUser) {
    throw new apiError(409, 'Conflict: User with this email of username already exists');
  }

  const profileImageLocalPath = req.file?.profileImage?.path;

  if (!profileImageLocalPath) {
    throw new apiError(400, 'Profile image is required');
  }

  const profileImage = await uploadOnCloudinary(profileImageLocalPath);

  if (!profileImage) {
    throw new apiError(500, 'Something went wrong while uploading profile image');
  }

  const user = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    password,
    profileImage: profileImage?.url || '',
  });

  const createdUser = User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new apiError(500, 'Something went wrong while registering user');
  }

  return res.status(200).json(new apiResponse(200, 'User register successfully'));
});

export { registerUser };
