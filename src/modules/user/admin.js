import express from 'express';
const router = express.Router();
import { deleteUser } from './controller/admincontroller.js';
import { verifyRoles } from '../../middlewares/verifyroles.js';
import ROLES_LIST from '../../../config/roleslist.js';

//Delete user 
router.delete('/user/delete', verifyRoles(ROLES_LIST.Admin), deleteUser);

export default router