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
    relatedPost,
    showProfile,
    //showProfile2,
    updateProfile,
    uploadImage
} from "./controller/usercontroller.js";

//Show profile , show user 
router.get('/', verifyRoles(rolesList.Admin, rolesList.Client, rolesList.Freelancer), showProfile);
//router.get('/:id', verifyRoles(rolesList.Admin, rolesList.Client, rolesList.Freelancer), showProfile2);

//Update profile , update user , set profile
router.patch('/update', verifyRoles(rolesList.Admin, rolesList.Freelancer), updateProfile);

//Skills modification
router.patch('/skill/add', verifyRoles(rolesList.Admin, rolesList.Freelancer), addSkill);
router.patch('/skill/delete', verifyRoles(rolesList.Admin, rolesList.Freelancer), deleteSkill);
router.patch('/skill/update', verifyRoles(rolesList.Admin, rolesList.Freelancer), modifySkill);
//Files
//Apply to a post
router.patch('/apply/:id', verifyRoles(rolesList.Freelancer), apply);
//related posts 
router.get('/relatedPost', verifyRoles(rolesList.Freelancer), relatedPost)
export default router;
