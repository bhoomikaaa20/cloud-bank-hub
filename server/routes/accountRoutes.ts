import express from "express";
import { getAccounts, createAccount, getBalance, searchAccounts, getAllAccounts } from "../controllers/accountController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getAccounts);
router.post("/", protect, createAccount);
router.get("/balance", protect, getBalance);
router.get("/search", protect, searchAccounts);
router.get("/all", protect, getAllAccounts);

export default router;