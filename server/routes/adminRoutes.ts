import express from "express";
import {
    getAdminData,
    deleteUser,
    deleteTransaction,
} from "../controllers/adminController";
import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = express.Router();

router.get("/", protect, adminOnly, getAdminData);
router.delete("/user/:id", protect, adminOnly, deleteUser);
router.delete("/transaction/:id", protect, adminOnly, deleteTransaction);

export default router;