import express from 'express';
const router = express.Router();
import { verifyRoles } from '../../middlewares/verifyroles.js';
import ROLES_LIST from '../../../config/roleslist.js';
import { recommendations } from './controller/modelcontroller.js';


router.get('/', verifyRoles(ROLES_LIST.Freelancer), recommendations);

export default router;