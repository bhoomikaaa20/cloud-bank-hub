import express from "express";
import {
    getNotifications,
    markAllRead,
    getUnreadCount,
} from "../controllers/notificationController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", protect, getNotifications);              // GET all
router.put("/read-all", protect, markAllRead);           // mark read
router.get("/unread-count", protect, getUnreadCount);    // header

export default router;