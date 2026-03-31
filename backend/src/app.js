import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/accounts", healthRoutes);
app.use("/api/accounts", authRoutes);
app.use("/api/accounts", roleRoutes);
app.use("/api/accounts", accountRoutes);

export default app;