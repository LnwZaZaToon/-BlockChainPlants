import express from 'express';
import {completeQuest, getBalance} from '../controllers/contractController.js'

const contractRouter = express.Router();

contractRouter.post("/completeQuest",completeQuest);
contractRouter.get("/getBalance",getBalance);

export default contractRouter;