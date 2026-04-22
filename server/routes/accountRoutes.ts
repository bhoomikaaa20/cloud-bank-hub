import express from "express";
import { getAccounts, createAccount, getBalance, searchAccounts } from "../controllers/accountController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getAccounts);
router.post("/", protect, createAccount);
router.get("/balance", protect, getBalance);
router.get("/search", protect, searchAccounts);

export default router;