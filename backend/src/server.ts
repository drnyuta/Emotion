import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { client, connectDB } from "./database";

const PORT = process.env.PORT || 5000;

app.get('/health', async (_req, res) => {
  try {
    await client.query('SELECT 1');
    res.status(200).send('OKkk');
  } catch (err) {
    console.error('Healthcheck failed:', err);
    res.status(500).send('Database connection failed');
  }
});

connectDB().then(() => {
  app.listen(5000, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
  });
});
