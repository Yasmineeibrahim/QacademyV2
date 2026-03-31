import express from "express";
import { createStudent, getDbStatus, getaccounts } from "../controllers/studentController.js";
import { loginStudent } from "../controllers/studentController.js";
const router = express.Router();

router.post("/", createStudent);
router.get("/", getaccounts);
router.get("/db-status", getDbStatus);
router.post("/login", loginStudent);
export default router;