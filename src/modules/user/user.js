import express from "express";
const router = express.Router();
import { verifyRoles } from "../../middlewares/verifyroles.js";
import rolesList from '../../../config/roleslist.js';
import upload from "../../middlewares/multercloud.js";
import FILE_LIST from "../../../config/filelist.js";
import { verifyFile } from "../../middlewares/verifyfile.js";
import {
    addSkill,
    apply,
    deleteSkill,
    modifySkill,
    realtedPost,
    showProfile,
    updateProfile,
    uploadImage
} from "./controller/usercontroller.js";

//Show profile , show user 
router.get('/', verifyRoles(rolesList.Admin,rolesList.Client, rolesList.Freelancer), showProfile);
//Update profile , update user , set profile
router.patch('/update', verifyRoles(rolesList.Admin, rolesList.Freelancer), updateProfile);
router.patch(
    '/image',
    verifyRoles(rolesList.Freelancer, rolesList.Admin),
    upload.single('file'),
    verifyFile(FILE_LIST.image),
    uploadImage);
//Skills modification
router.patch('/skill/add', verifyRoles(rolesList.Admin, rolesList.Freelancer), addSkill);
router.patch('/skill/delete', verifyRoles(rolesList.Admin, rolesList.Freelancer), deleteSkill);
router.patch('/skill/update', verifyRoles(rolesList.Admin, rolesList.Freelancer), modifySkill);
//Files
//Apply to a post
router.patch('/apply/:id', verifyRoles(rolesList.Freelancer), apply);
//related posts 
router.get('/relatedPost',verifyRoles(rolesList.Freelancer),realtedPost)
export default router;