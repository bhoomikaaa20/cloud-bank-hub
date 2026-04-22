import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/generateToken";

export const signup = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashed,
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