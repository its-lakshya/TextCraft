import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { deleteFromCloudinary, uploadOnCloudinary } from '../utils/cloudinary.js';
import jwt from 'jsonwebtoken';

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

  // const profileImageLocalPath = req.files?.profileImage[0]?.path;

  // if (!profileImageLocalPath) {
  //   throw new apiError(400, 'Profile image is required');
  // }

  // const profileImage = await uploadOnCloudinary(profileImageLocalPath);

  // if (!profileImage) {
  //   throw new apiError(500, 'Something went wrong while uploading profile image');
  // }

  const user = await User.create({
    userName: userName.toLowerCase(),
    fullName,
    email,
    password,
    // profileImage: profileImage?.url,
    mobileNumber,
    gender: gender || 'prefer-not-to-say',
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

  res.cookie('accessToken', accessToken, options);

  res.cookie('refreshToken', refreshToken, options);

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully',
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user;

  await User.findByIdAndUpdate(
    user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true },
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie('accessToken', options)
    .cookie('refreshToken', options)
    .json(new apiResponse(200, 'User logged out successfully'));
});

const updateProfileImage = asyncHandler(async (req, res) => {
  const newProfileImageLocalPath = req.file?.path;

  const isUserLoggedIn = req.user;

  if (!isUserLoggedIn) {
    throw new apiError(404, 'Unauthorized request');
  }

  if (!newProfileImageLocalPath) {
    throw new apiError(400, 'Profile image is missing');
  }

  const newProfileImage = await uploadOnCloudinary(newProfileImageLocalPath);

  if (!newProfileImage) {
    throw new apiError(500, 'Something went wrong while updating the profile image');
  }

  const oldImageDeleted = await deleteFromCloudinary(isUserLoggedIn.profileImage);

  if (!oldImageDeleted || oldImageDeleted.result !== 'ok') {
    throw new apiError(500, 'Something went wrong while updating the profile image');
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        profileImage: newProfileImage.url,
      },
    },
    { new: true },
  ).select('-password -refreshToken');

  return res.status(200).json(new apiResponse(200, user, 'Profile image updated successfully'));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { userName, fullName, email, mobileNumber, gender } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!userName && !fullName && !email && !mobileNumber && !gender) {
    throw new apiError(400, 'At least one field must be provided for update');
  }

  const fieldsToBeUpdated = {};

  if (userName && userName.trim() !== '') fieldsToBeUpdated.userName = userName;
  if (fullName && fullName.trim() !== '') fieldsToBeUpdated.fullName = fullName;
  if (email && email.trim() !== '') fieldsToBeUpdated.email = email;
  if (mobileNumber && mobileNumber.trim() !== '') fieldsToBeUpdated.mobileNumber = mobileNumber;
  if (gender && gender.trim() !== '') fieldsToBeUpdated.gender = gender;

  if (!fieldsToBeUpdated) {
    throw new apiError(400, 'Fields to be updated are not provided');
  }

  const updateFields = await User.findByIdAndUpdate(user._id, fieldsToBeUpdated, {
    new: true,
  }).select('-password -refreshToken');

  if (!updateFields) {
    throw new apiError(500, 'Something went wrong while updating the details');
  }

  return res
    .status(200)
    .json(new apiResponse(200, updateFields, 'User details updated successfully'));
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!req.user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!newPassword) {
    throw new apiError(400, 'New password is missing');
  }

  const user = await User.findById(req.user._id);
  const isOldPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isOldPasswordValid) {
    throw new apiError(400, 'Password is incorrect');
  }

  user.password = newPassword;
  const updatedPassword = await user.save();

  if (!updatedPassword) {
    throw new apiError(500, 'Something went wrong while updating the password');
  }

  return res.status(200).json(new apiResponse(200, 'Password updated successfully'));
});

const isLoggedIn = asyncHandler(async (req, res) => {
  const accessToken = req?.cookies?.accessToken;
  if (!accessToken) {
    return res.status(401).json({ loggedIn: false, message: 'Access token not found' });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    let user = await User.findById(decoded._id).select(
      '-password -refreshToken -createdAt -updatedAt -__v',
    );
    user = { isLoggedIn: true, user };
    res.status(200).json(new apiResponse(200, user, 'User is successfully verified'));
  } catch (error) {
    console.error('Error verifying access token:', error);
    res.status(401).json({ loggedIn: false, message: 'Invalid access token' });
  }
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  const userDetails = await User.findById(user._id).select('-password -refreshToken -__v');

  if (!userDetails) {
    throw new apiError(500, "Something went wrong while fetching user's details");
  }

  return res
    .status(200)
    .json(new apiResponse(200, userDetails, 'User details fetched successfully'));
});

const findUserByEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = req.user;

  if (!user) {
    throw new apiError(401, 'Unauthorized request');
  }

  if (!email || email.trim() === '') {
    throw new apiError(400, 'Email is required');
  }
  const searchedUser = await User.findOne({ email }).select('-password -refreshToken -__v');

  if (!searchedUser) {
    throw new apiError(400, 'No such user exists');
  }

  return res
    .status(200)
    .json(new apiResponse(200, searchedUser, 'User details is fetched successfully'));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfileImage,
  updateUserDetails,
  updateUserPassword,
  isLoggedIn,
  getUserDetails,
  findUserByEmail,
};
