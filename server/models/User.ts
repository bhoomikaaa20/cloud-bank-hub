import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String,
        role: { type: String, default: "user" },
    },
    { timestamps: true } // ✅ THIS FIXES IT
);

export default mongoose.model("User", userSchema);