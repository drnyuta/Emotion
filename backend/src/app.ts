import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));

app.use("/ai", aiRoutes);

export default app;
