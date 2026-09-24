import User from "../models/User.js";

// to authenticate JWT Token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "Token is not valid or user no longer exists",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Auth error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};
