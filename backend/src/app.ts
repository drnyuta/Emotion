import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import aiRoutes from "./routes/ai.routes";
import diaryRoutes from "./routes/diary";
import emotionRoutes from "./routes/emotion"
import questionRoutes from "./routes/question"
import insightRoutes from "./routes/insights"
import analyticsRoutes from "./routes/analytics"
import authRoutes from "./routes/auth";
import { errorLogger } from "./middleware/errorLogger";
import { requestLogger } from "./middleware/requestLogger";
import { authMiddleware } from "./middleware/auth";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "2mb", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/auth", authRoutes);

app.use("/ai", authMiddleware, aiRoutes);
app.use("/diary", authMiddleware, diaryRoutes);
app.use("/emotions", authMiddleware, emotionRoutes);
app.use("/questions", authMiddleware, questionRoutes);
app.use("/insights", authMiddleware, insightRoutes);
app.use("/analytics", authMiddleware, analyticsRoutes);

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorLogger);

export default app;
