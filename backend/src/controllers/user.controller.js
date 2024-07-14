import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const generateAccessAndRefreshToken = async userId => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(500, 'Something went wrong while generating access and refresh tokens');
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password, mobileNumber, gender } = req.body;

  if ([userName, email, fullName, password].some(field => field.trim() === '')) {
    throw new apiError(400, 'Bad request: Missing required details for registration');
  }

  const existedUser = await User.findOne({
    $or: [{ userName, email }],
  });

  if (existedUser) {
    throw new apiError(409, 'User with this email of username already exists');
  }

  const profileImageLocalPath = req.files?.profileImage[0]?.path;

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
    mobileNumber: mobileNumber || null,
  });

  const createdUser = await User.findById(user._id).select('-password -refreshToken');

  if (!createdUser) {
    throw new apiError(500, 'Something went wrong while registering user');
  }

  return res.status(200).json(new apiResponse(200, 'User register successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some(field => field.trim() === '')) {
    throw new apiError(400, 'Missing required details for login');
  }


  if (!password && !email) {
    throw new apiError(400, 'email and password both are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, 'No user found with these credentials');
  }

  console.log(user)

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, 'Incorrect password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const loggedInUser = await User.find(user._id).select('-password -refreshToken');
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken, options)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully',
      ),
    );
});

export { registerUser, loginUser };
