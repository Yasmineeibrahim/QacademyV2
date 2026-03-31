import express from "express";
import { loginAccount } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", loginAccount);

export default router;
