import express from "express";
import { createPayment } from "./controller/paymentcontroller.js";
import { verifyRoles } from "../../middlewares/verifyroles.js";
import ROLES_LIST from "../../../config/roleslist.js";
const router = express.Router();

router.post('/',verifyRoles(ROLES_LIST.Client),createPayment)
export default router;