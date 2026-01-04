import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import aiRoutes from "./routes/ai.routes";
import diaryRoutes from "./routes/diary";
import emotionRoutes from "./routes/emotion";
import questionRoutes from "./routes/question";
import insightRoutes from "./routes/insights";
import analyticsRoutes from "./routes/analytics";
import authRoutes from "./routes/auth";
import streakRoutes from "./routes/streak";
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
app.use("/streak", authMiddleware, streakRoutes);

const NODE_ENV = process.env.NODE_ENV || "development";

try {
  const swaggerPath =
    NODE_ENV === "production"
      ? path.join(__dirname, "swagger.yaml")
      : path.join(process.cwd(), "swagger.yaml");

  console.log("Environment:", process.env.NODE_ENV);
  console.log("__dirname:", __dirname);
  console.log("process.cwd():", process.cwd());
  console.log("Looking for swagger.yaml at:", swaggerPath);

  const swaggerDocument = YAML.load(swaggerPath);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger available at /api-docs");
} catch (err) {
  console.error("✗ Swagger error:", err instanceof Error ? err.message : err);
  console.warn("Swagger disabled");
}

app.use(errorLogger);

export default app;
