import express from "express";
const router = express.Router();
import { verifyRoles } from '../../middlewares/verifyroles.js';
import rolesList from '../../../config/roleslist.js';
import upload from "../../middlewares/multercloud.js";
import { uploadFile } from "./controller/projectcontroller.js"; //controller
import FILE_LIST from "../../../config/filelist.js";
import { verifyFile } from "../../middlewares/verifyfile.js";
//Accept files only
router.patch('/upload/file/:title', verifyRoles(rolesList.Client), upload.single('file'), verifyFile(FILE_LIST.file), uploadFile);
export default router;