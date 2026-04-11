import express from "express";
import cors from "cors";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import coursesRoutes from "./routes/coursesRoutes.js";
import purchasesRoutes from "./routes/purchasesRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/accounts", authRoutes);
app.use("/api/accounts", roleRoutes);
app.use("/api/accounts", accountRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/purchases', purchasesRoutes);

export default app;