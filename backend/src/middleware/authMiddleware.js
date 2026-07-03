import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protects routes — only allows access if a valid JWT is provided
export const protect = async (req, res, next) => {
  let token;

  // Standard convention: token sent as "Bearer <token>" in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token signature & expiry
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (minus password) to the request object for use in controllers
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User not found" });
      }

      next(); // Token valid — proceed to the actual route controller
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token invalid or expired",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }
};