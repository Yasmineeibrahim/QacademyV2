import express from "express";
import { getDbStatus } from "../controllers/healthController.js";

const router = express.Router();

router.get("/db-status", getDbStatus);

export default router;
