import express from "express";
import { createStudent, getDbStatus, getStudents } from "../controllers/studentController.js";
import { loginStudent } from "../controllers/studentController.js";
const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/db-status", getDbStatus);
router.post("/login", loginStudent);
export default router;