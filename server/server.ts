import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/authRoutes";
import accountRoutes from "./routes/accountRoutes";
import transactionRoutes from "./routes/transactionRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import adminRoutes from "./routes/adminRoutes";


dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);


app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/notifications", notificationRoutes);

app.use("/api/admin", adminRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}); 