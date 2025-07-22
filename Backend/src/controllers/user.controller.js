import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    [email, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "User already Exist");
  }

  const user = await User.create({
    email,
    password,
    profile: {},
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registrering the user");
  }

  const tokenData = { _id: user._id };
  const token = jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "7d",
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User created and logged in successfully"
      )
    );
});

const completeProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  //   console.log("Body:", req.body);      // Should include all your fields
  // console.log("Files:", req.files); 
  const { name, role, mobNo } = req.body;
  const profilePicFile = req.files?.profilePic?.[0];
  const resumeFile = req.files?.resume?.[0];

  if (!name || !role || !mobNo) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required." });
  }

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found." });

  let profilePicUrl = user.profile.profilePic;
  let resumeUrl = user.profile.resume;

  if (profilePicFile) {
    const url = await uploadOnCloudinary(profilePicFile.path);
    if (url) profilePicUrl = url;
  }
  if (role === "employee" && resumeFile) {
    const url = await uploadOnCloudinary(resumeFile.path);
    if (url) resumeUrl = url;
  }

  user.fullName = name;
  user.role = role;
  user.mobNo = mobNo;
  user.profile.profilePic = profilePicUrl;
  if (role === "employee") user.profile.resume = resumeUrl;

  await user.save();
  return res
    .status(200)
    .json({ success: true, message: "Profile updated successfully." });
});


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].some((field) => field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(400, "User does not exist ");
  }

  const isValidPassword = await user.isPasswordCorrect(password);
  if (!isValidPassword) {
    throw new ApiError(400, "Incorrect Password");
  }

  const tokenData = {
    _id: user._id,
  };

  const token = await jwt.sign(tokenData, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "7d",
  });

  const createUser = await User.findById(user._id).select("-password");

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(201)
    .cookie("token", token, options)
    .json(new ApiResponse(201, createUser, "User logged in successfully"));
});


const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, mobNo, bio, skills } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      throw new ApiError(
        400,
        "User already exists with this email. Please use a different one."
      );
    }

    user.email = email;
  }

  if (fullName) user.fullName = fullName.trim();
  if (mobNo) user.mobNo = mobNo;
  if (bio) user.profile.bio = bio.trim();
  if (skills)
    user.profile.skills = Array.isArray(skills)
      ? skills
      : skills.split(",").map((s) => s.trim());

  await user.save();

  const createdUser = await User.findById(user._id).select("-password ");

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "Profile updated successfully"));
});

export { register, completeProfile, login, logout, updateProfile };
