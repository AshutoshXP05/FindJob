import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


const register = asyncHandler(async (req, res) => {
  const { fullName, email, password, role, mobNo } = req.body

  //  if ( ! fullName || !email || ! password || ! role || ! mobNo ) {
  //   throw new ApiError(400, "All fields are required ");
  //  }

  if ([fullName, email, password, role, mobNo].some(field => typeof field !== "string" || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email })
  if (existedUser) {
    throw new ApiError(400, "User already Exist");
  }

  const user = await User.create({
    fullName,
    email,
    password,
    mobNo,
    role,
    profile: {
    bio: "",
    profilePic: "",
    skills: [],
    resume: "",
    resumeOriginalName: "",
    company: null
  }

  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken")

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registrering the user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User created successfully")
  )

})


const login = asyncHandler(async (req, res) => {

  const { email, password, role } = req.body

  if (
    [email, password, role].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(400, "User does not exist ");
  }

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(400, "Incorrect Password");
  }

  const roles = ['employee', 'recruiter'];
  if (!roles.includes(role) || role !== user.role) {
    throw new ApiError(403, "Invalid role provided");
  }

  //  if ( role !== user.role ) {
  //   throw new ApiError(400, "Role is not correct ");
  //  }


  const tokenData = {
    _id: user._id,
  }


  const token = await jwt.sign(
    tokenData,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "7d",
    }
  )

  const createUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  }

  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(201, createUser, "User logged in successfully")
    )
})


const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      }
    },
    {
      new: true,
    }
  )

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,

  }

  return res
    .status(200)
    .clearCookie("token", options)
    .json(
      new ApiResponse(200, {}, "User Logged Out")
    )
})


const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, mobNo, bio, skills } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ApiError(400, "User already exists with this email. Please use a different one.");
    }

    user.email = email;
  }

  if (fullName) user.fullName = fullName.trim();
  if (mobNo) user.mobNo = mobNo;
  if (bio) user.profile.bio = bio.trim();
  if (skills) user.profile.skills = Array.isArray(skills) ? skills : skills.split(",").map(s => s.trim());

  await user.save();

  const createdUser = await User.findById(user._id).select("-password ");

  return res
        .status(200)
       .json(
        new ApiResponse(200, createdUser, "Profile updated successfully")
       )


});



export {
  register,
  login,
  logout,
  updateProfile
}