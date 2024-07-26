import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    mobileNumber: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "prefer-not-to-say"],
      required: false,
      default: "prefer-not-to-say"
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: [true, 'Password is required'],
    },
    profileImage: {
      type: String,
      default: 'http://res.cloudinary.com/dhaoqsmcn/image/upload/v1720983113/TextCraft/ej3ct0fdlvndjacxkeyi.jpg'
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRES_TOKEN_EXPIRY,
    },
  );
};

const User = mongoose.model('User', userSchema);

export { User };
