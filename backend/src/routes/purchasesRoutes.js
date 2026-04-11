import express from "express";
import {
  createEnrollment,
  createVideoPurchase,
  getStudentEnrollments,
  getStudentPurchases,
  getStudentVideoPurchases,
} from "../controllers/purchasesController.js";

const router = express.Router();

router.post("/enrollments", createEnrollment);
router.get("/enrollments/student/:studentId", getStudentEnrollments);

router.post("/video-purchases", createVideoPurchase);
router.get("/video-purchases/student/:studentId", getStudentVideoPurchases);

router.get("/student/:studentId", getStudentPurchases);

export default router;