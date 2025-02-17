import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import { apiError } from "../utils/apiError.js"
import { User } from "../models/user.model.js"

const verifyJWT = asyncHandler(async (req, _, next) => {
  try{
    const token = req.header("Authorization")?.replace("Bearer ", "") // || req.cookies?.accessToken
    if(!token){
      throw new apiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id).select("-password -refreshToken");

    if(!user){
      throw new apiError(404, "Invalid access token")
    }

    req.user = user;
    next();
  }catch(error){
    throw new apiError(401, error?.message || "Invalid access token")
  }
})

export { verifyJWT }