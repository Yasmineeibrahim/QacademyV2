import express from "express";
import { getEducators, getAdmins } from "../controllers/rolesController.js";

const router = express.Router();

router.get("/educators", getEducators);
router.get("/admins", getAdmins);

export default router;
