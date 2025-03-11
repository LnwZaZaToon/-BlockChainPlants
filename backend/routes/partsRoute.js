import { addParts, listParts, removeParts } from '../controllers/partsController.js';
import express from 'express';
import multer from 'multer';

const partsRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null,`${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage})

partsRouter.get("/list",listParts);
partsRouter.post("/add",upload.single('image'),addParts);
partsRouter.post("/remove",removeParts);

export default partsRouter;