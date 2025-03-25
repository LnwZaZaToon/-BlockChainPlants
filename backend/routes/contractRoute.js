import express from 'express';
import {completeQuest, getBalance,getUserTransactions} from '../controllers/contractController.js'

const contractRouter = express.Router();

contractRouter.post("/completeQuest",completeQuest);
contractRouter.get("/getBalance",getBalance);
contractRouter.get("/getUserTransactions",getUserTransactions);

export default contractRouter;