import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import User from "../models/User";
import Account from "../models/Account";
import Transaction from "../models/Transaction";

// 🔹 GET ALL DATA
export const getAdminData = async (req: AuthRequest, res: Response) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        const transactions = await Transaction.find().sort({ createdAt: -1 });

        const accounts = await Account.find();

        const totalBalance = accounts.reduce(
            (sum, acc) => sum + acc.balance,
            0
        );

        res.json({
            users: users.map((u) => ({
                id: u._id,
                full_name: u.name,
                email: u.email,
                created_at: (u as any).createdAt,
            })),
            transactions: transactions.map((t) => ({
                id: t._id,
                sender_id: t.sender,
                receiver_id: t.receiver,
                amount: t.amount,
                created_at: t.createdAt,
            })),
            totalBalance,
        });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 DELETE USER
export const deleteUser = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    await User.findByIdAndDelete(id);
    await Account.deleteMany({ user: id });
    await Transaction.deleteMany({
        $or: [{ sender: id }, { receiver: id }],
    });

    res.json({ message: "User deleted" });
};

// 🔹 DELETE TRANSACTION
export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    const { id } = req.params;

    await Transaction.findByIdAndDelete(id);

    res.json({ message: "Transaction deleted" });
};