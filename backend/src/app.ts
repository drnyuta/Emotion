import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import { errorLogger } from "./middleware/errorLogger";
import { requestLogger } from "./middleware/requestLogger";

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb", type: "application/json" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/ai", aiRoutes);

app.use(errorLogger);

export default app;
