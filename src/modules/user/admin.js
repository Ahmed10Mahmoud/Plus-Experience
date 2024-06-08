import express from 'express';
const router = express.Router();
import { allUsers, deleteUser, getUserByUserName } from './controller/admincontroller.js';
import { verifyRoles } from '../../middlewares/verifyroles.js';
import ROLES_LIST from '../../../config/roleslist.js';

//Delete user 
router.delete('/delete', verifyRoles(ROLES_LIST.Admin), deleteUser);
router.get('/allUsers', verifyRoles(ROLES_LIST.Admin), allUsers);

router.get('/:userName', verifyRoles(ROLES_LIST.Admin), getUserByUserName);

export default router