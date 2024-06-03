import express from 'express';
const router = express.Router();
import { allUsers, deleteUser } from './controller/admincontroller.js';
import { verifyRoles } from '../../middlewares/verifyroles.js';
import ROLES_LIST from '../../../config/roleslist.js';

//Delete user 
router.delete('/delete', verifyRoles(ROLES_LIST.Admin), deleteUser);
router.get('/allUsers', verifyRoles(ROLES_LIST.Admin), allUsers);

export default router