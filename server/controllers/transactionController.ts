import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";
import User from "../models/User";
import Account from "../models/Account";
import Transaction from "../models/Transaction";
import Notification from "../models/Notification";

// 💸 TRANSFER MONEY
export const transferMoney = async (req: AuthRequest, res: Response) => {
    try {
        const { receiverAccount, amount, note } = req.body;

        // ✅ Convert amount safely
        const amt = Number(amount);

        if (!amt || amt <= 0) {
            return res.status(400).json({ message: "Invalid amount" });
        }

        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const senderAccount = await Account.findOne({ user: req.user._id });
        const receiver = await Account.findOne({ account_number: receiverAccount });

        if (!senderAccount) {
            return res.status(400).json({ message: "Sender account not found" });
        }

        if (!receiver) {
            return res.status(400).json({ message: "Receiver not found" });
        }

        if (senderAccount.balance < amt) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 💸 Update balances
        senderAccount.balance -= amt;
        receiver.balance += amt;

        await senderAccount.save();
        await receiver.save();

        // 🧾 Save transaction
        await Transaction.create({
            sender: senderAccount.user,
            receiver: receiver.user,
            amount: amt,
            note,
        });

        // 🔔 Notification
        await Notification.create({
            user: receiver.user,
            message: `You received $${amt}`,
        });

        res.json({ message: "Transfer successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 📊 RECENT TRANSACTIONS
export const getRecentTransactions = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;

        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json(
            transactions.map((t) => ({
                id: t._id,
                sender_id: t.sender,
                receiver_id: t.receiver,
                amount: t.amount,
                note: t.note,
                created_at: t.createdAt,
            }))
        );

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 FULL TRANSACTIONS LIST

export const getAllTransactions = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const userId = req.user._id;

        const transactions = await Transaction.find({
            $or: [{ sender: userId }, { receiver: userId }],
        }).sort({ createdAt: -1 });

        // ✅ FIX: Handle ObjectId properly
        const ids = Array.from(
            new Set(
                transactions
                    .flatMap((t) => [t.sender, t.receiver])
                    .filter((id): id is mongoose.Types.ObjectId => id != null)
                    .map((id) => id.toString()) // convert AFTER filtering
            )
        );

        const users = await User.find({ _id: { $in: ids } });

        const nameMap: Record<string, string> = {};
        users.forEach((u) => {
            nameMap[u._id.toString()] = u.name || "User";
        });

        res.json({
            transactions: transactions.map((t) => ({
                id: t._id.toString(),
                sender_id: t.sender ? t.sender.toString() : null,
                receiver_id: t.receiver ? t.receiver.toString() : null,
                amount: t.amount,
                note: t.note,
                created_at: t.createdAt,
                status: "completed",
            })),
            names: nameMap,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};