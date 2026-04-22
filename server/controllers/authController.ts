import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";
import Account from "../models/Account";

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
    });

    // ✅ CREATE ACCOUNT WITH 1000 BALANCE
    await Account.create({
        user: user._id,
        account_name: name,
        account_number: Math.floor(
            1000000000 + Math.random() * 9000000000
        ).toString(),
        balance: 1000,
    });

    res.json({
        token: generateToken(user._id.toString()),
    });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
        token: generateToken(user._id.toString()),
    });
};

export const getMe = async (req: any, res: Response) => {
    res.json({ user: req.user });
};