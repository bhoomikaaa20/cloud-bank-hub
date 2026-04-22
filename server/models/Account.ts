import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    account_name: String,
    account_number: String,
    balance: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);