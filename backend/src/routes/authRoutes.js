import express from "express";
import { loginAccount } from "../controllers/authController.js";
import { changePassword } from "../controllers/passwordController.js";

const router = express.Router();

router.post("/login", loginAccount);
router.patch("/change-password", changePassword);

export default router;
