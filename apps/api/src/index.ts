import cors from "cors";
import express from "express";
import { apiRouter } from "./routes/index.js";

const app = express();
const port = process.env.PORT ?? 4000;

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`OmniSite API listening on http://localhost:${port}`);
});