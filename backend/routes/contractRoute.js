import express from 'express';
import {completeQuest, getBalance,getUserTransactions,postBuyproduct} from '../controllers/contractController.js'

const contractRouter = express.Router();

contractRouter.post("/completeQuest",completeQuest);
contractRouter.get("/getBalance",getBalance);
contractRouter.get("/getUserTransactions",getUserTransactions);
contractRouter.post("/postBuyproduct",postBuyproduct);

export default contractRouter;