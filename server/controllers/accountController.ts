import { Response } from "express";
import Account from "../models/Account";
import User from "../models/User"; // ✅ FIX
import { AuthRequest } from "../middleware/authMiddleware";

// 🔹 GET accounts
export const getAccounts = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const accounts = await Account.find({ user: req.user._id });
        res.json(accounts);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 CREATE account
export const createAccount = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { account_name } = req.body;

        const account = await Account.create({
            user: req.user._id,
            account_name,
            account_number: Math.floor(
                1000000000 + Math.random() * 9000000000
            ).toString(),
        });

        res.json(account);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 GET balance
export const getBalance = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const account = await Account.findOne({ user: req.user._id });

        res.json({ balance: account?.balance || 0 });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// 🔹 SEARCH accounts/users
export const searchAccounts = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user?._id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const query = (req.query.query as string) || "";

        if (query.length < 2) {
            return res.json([]);
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { email: { $regex: query, $options: "i" } },
            ],
            _id: { $ne: req.user._id },
        }).limit(5);

        const userIds = users.map((u) => u._id);

        const accounts = await Account.find({
            user: { $in: userIds },
        });

        const result = accounts.map((a) => {
            const u = users.find((u) => u._id.equals(a.user));

            return {
                account_number: a.account_number,
                account_name: a.account_name,
                user_id: a.user,
                full_name: u?.name || "User",
            };
        });

        res.json(result);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};