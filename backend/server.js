import express from "express";
import cors from "cors";

const app = express();
const PORTA = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});
