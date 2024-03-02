import express from 'express';
const router = express.Router();
import {deleteUser} from './controller/admincontroller.js';
import {verifyRoles} from '../../middlewares/verifyRoles.js';
//import {ROLES_LIST} from '../config/roleslist.js';


//Delete user 
router.delete('/delete', verifyRoles("admin"), deleteUser);

export default router