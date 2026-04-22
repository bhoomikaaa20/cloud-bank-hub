import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    amount: Number,
    note: String,
}, { timestamps: true });

export default mongoose.model("Transaction", transactionSchema);