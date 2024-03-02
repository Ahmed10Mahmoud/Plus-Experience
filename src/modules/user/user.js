


import express from "express";
const router = express.Router();
import verifyRole from '../../middlewares/verifyRoles.js';
import rolesList from '../../../config/roleslist.js';
import upload from '../middlewares/multer';
import { addSkill, deleteSkill, modifySkill } from "./controller/usercontroller.js";

//Show profile , show user 
router.get('/', verifyRole(rolesList.Admin, rolesList.Freelancer), userController.showProfile);
//Update profile , update user , set profile
router.patch('/update', verifyRole(rolesList.Admin, rolesList.Freelancer), userController.updateProfile);
router.patch('/image', verifyRole(rolesList.Freelancer, rolesList.Admin), upload.single('file'), userController.uploadImage);
//Skills modification
router.patch('/skill/add', verifyRole(rolesList.Admin, rolesList.Freelancer), addSkill);
router.patch('/skill/delete', verifyRole(rolesList.Admin, rolesList.Freelancer), deleteSkill);
router.patch('/skill/update', verifyRole(rolesList.Admin, rolesList.Freelancer), modifySkill);
//Files
export default router;