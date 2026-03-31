import express from "express";
import {
  createAccount,
  getAllAccounts,
  getAccountById
} from "../controllers/accountsController.js";

const router = express.Router();

router.post("/", createAccount);
router.get("/", getAllAccounts);
router.get("/:id", getAccountById);

export default router;
