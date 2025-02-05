import { User } from "../models/userSchema.js";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// export const isAuthenticated = catchAsyncError(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return next(new ErrorHandler("User is not Auhtenticated!!"), 400);
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
//   req.user = await User.findById(decoded.id);
//   next();
// });

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  let token;

  // Get token from cookies or Authorization header
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorHandler("User is not authenticated!", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});
