import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import aiRoutes from "./routes/ai.routes";
import diaryRoutes from "./routes/diary";
import emotionRoutes from "./routes/emotion"
import questionRoutes from "./routes/question"
import { errorLogger } from "./middleware/errorLogger";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/ai", aiRoutes);
app.use('/diary', diaryRoutes);
app.use('/emotions', emotionRoutes)
app.use('/questions', questionRoutes)

const swaggerDocument = YAML.load(path.join(__dirname, "../swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(errorLogger);

export default app;
