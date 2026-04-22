import express from "express";
import { getRecentTransactions, transferMoney, getAllTransactions } from "../controllers/transactionController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/recent", protect, getRecentTransactions);
router.post("/transfer", protect, transferMoney);
router.get("/", protect, getAllTransactions);

export default router;