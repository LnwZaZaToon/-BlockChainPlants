import express from 'express';
import { loginUser,registerUser,getData } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.get("/getdata",getData);

export default userRouter;