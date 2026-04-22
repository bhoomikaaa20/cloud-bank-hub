import { Response } from "express";
import Notification from "../models/Notification";
import { AuthRequest } from "../middleware/authMiddleware";



// 🔹 Get all notifications
export const getNotifications = async (req: AuthRequest, res: Response) => {
    const notifications = await Notification.find({
        user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(
        notifications.map((n) => ({
            id: n._id,
            message: n.message,
            read: n.read,
            created_at: n.createdAt,
        }))
    );
};

// 🔹 Mark all as read
export const markAllRead = async (req: AuthRequest, res: Response) => {
    await Notification.updateMany(
        { user: req.user._id, read: false },
        { read: true }
    );

    res.json({ message: "All notifications marked as read" });
};

// 🔹 Get unread count (already used in header)
export const getUnreadCount = async (req: AuthRequest, res: Response) => {
    const count = await Notification.countDocuments({
        user: req.user._id,
        read: false,
    });

    res.json({ count });
};