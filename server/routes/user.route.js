import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";


const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);



userRouter.use(verifyJWT);

userRouter.post("/logout", logoutUser);
userRouter.get("/me", getCurrentUser);

export default userRouter;
