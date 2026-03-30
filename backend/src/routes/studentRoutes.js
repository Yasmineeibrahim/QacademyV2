import express from "express";
import { createStudent, getDbStatus, getStudents } from "../controllers/studentController.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/db-status", getDbStatus);

export default router;