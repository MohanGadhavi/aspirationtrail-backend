import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

export const register = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("image are require", 400));
  }

  //cloudinaryResponseForimage error
  const { image } = req.files;

  const cloudinaryResponseForImage = await cloudinary.uploader.upload(
    image.tempFilePath,
    { folder: "image" }
  );

  if (!cloudinaryResponseForImage || cloudinaryResponseForImage.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponseForImage.error || "Unknow Cloudinary error"
    );
  }

  //   cloudinaryResponseForResume error

  const {
    userType,
    userName,
    firstName,
    lastName,
    email,
    phone,
    password,
    termsAndCondtion,
  } = req.body;

  // const organisationId = req.Organisation
  // console.log(req.Organisation);

  // create or register user
  const CreateUser = await User.create({
    userType,
    userName,
    // organisationId,
    firstName,
    lastName,
    email,
    phone,
    password,
    termsAndCondtion,
    image: {
      public_id: cloudinaryResponseForImage.public_id,
      url: cloudinaryResponseForImage.secure_url,
    },
  });

  const result = CreateUser.toJSON();
  res.status(200).json({
    success: true,
    message: "user Register",
    data: result,
  });
});

// user Login
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, termsAndCondtion } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }
  if (!termsAndCondtion) {
    return next(new ErrorHandler("Please accept the term&con!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 404));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password", 401));
  }
  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 100
      ),
    })
    .json({
      success: true,
      message: "user login Succesfully",
      user,
      token,
    });
});

// user Logout
export const logOut = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "User Logout Successfuly",
    });
});

// Get user
export const getUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

export const getAllUser = catchAsyncError(async (req, res, next) => {
  const user = await User.find();
  res.status(200).json({
    success: true,
    user,
  });
});

// Update User
export const updateuser = catchAsyncError(async (req, res, next) => {
  const newUserdata = {
    userName: req.body.userName,
    fullName: req.body.fullName,
    lastName: req.body.fullName,
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  };
  if (req.files && req.files.image) {
    const image = req.files.image;
    const user = await User.findById(req.user.id);
    const profileImageId = user.image.public_id;
    await cloudinary.uploader.destroy(profileImageId);
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      { folder: "imageS" }
    );
    newUserdata.image = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserdata, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    message: "User Profile Update",
    user,
  });
});

// update password
export const updatePassword = catchAsyncError(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill all the Fill", 400));
  }
  const user = await User.findById(req.user.id).select("password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrent Current Password ", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(
      new ErrorHandler(
        "New Password and Confirm Mew Password didn't matched  ",
        400
      )
    );
  }

  user.password = newPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password Updated!!",
  });
});

// save image file
export const savefile = catchAsyncError(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();

  try {
    res.status(200).json({
      success: true,
      message: "User data saved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving user data", error });
  }
});
