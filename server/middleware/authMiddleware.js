import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Protect routes - verify JWT
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.statusCode = 401;
    throw new Error("Not authorized. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -mfaSecret");
    if (!req.user) {
      res.statusCode = 401;
      throw new Error("User not found. Token invalid.");
    }
    next();
  } catch (err) {
    res.statusCode = 401;
    throw new Error("Not authorized. Token failed.");
  }
});

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.statusCode = 403;
      throw new Error(`Role '${req.user.role}' is not authorized to access this resource.`);
    }
    next();
  };
};
