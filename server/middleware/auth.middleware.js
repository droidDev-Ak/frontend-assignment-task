import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new Error("Unauthorised access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      "-refreshToken -password"
    );

    if (!user)
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized access",
    });
  }
};
export { verifyJWT };
