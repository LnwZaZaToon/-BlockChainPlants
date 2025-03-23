import express from 'express';
import { loginUser,registerUser,getData ,addmetamask,getPublicKey} from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/getpublickey",getPublicKey);
userRouter.get("/getdata",getData);
userRouter.post("/addmetamask",authMiddleware,addmetamask);

export default userRouter;