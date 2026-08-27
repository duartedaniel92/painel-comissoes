import express from "express";
import cors from "cors";

import { montarPainel } from "./src/painel.js";
import {
  listarVendedores,
  buscarVendedor,
  criarVendedor,
  atualizarVendedor,
  excluirVendedor,
} from "./src/vendedores.js";

const app = express();
const PORTA = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ---------- Painel ----------

app.get("/api/dashboard", (req, res) => {
  res.json(montarPainel());
});

// ---------- Vendedores ----------

app.get("/api/sellers", (req, res) => {
  res.json(listarVendedores(req.query));
});

app.get("/api/sellers/:id", (req, res) => {
  const vendedor = buscarVendedor(req.params.id);
  if (!vendedor) return res.status(404).json({ erro: "Vendedor não encontrado" });
  res.json(vendedor);
});

app.post("/api/sellers", (req, res) => {
  const { erros, vendedor } = criarVendedor(req.body, req.body.usuario);
  if (erros) return res.status(400).json({ erro: erros.join(". ") });
  res.status(201).json(vendedor);
});

app.put("/api/sellers/:id", (req, res) => {
  const { erros, vendedor } = atualizarVendedor(req.params.id, req.body, req.body.usuario);
  if (erros) return res.status(400).json({ erro: erros.join(". ") });
  if (!vendedor) return res.status(404).json({ erro: "Vendedor não encontrado" });
  res.json(vendedor);
});

app.delete("/api/sellers/:id", (req, res) => {
  if (!excluirVendedor(req.params.id, req.body?.usuario)) {
    return res.status(404).json({ erro: "Vendedor não encontrado" });
  }
  res.json({ ok: true });
});

app.listen(PORTA, () => {
  console.log(`API rodando em http://localhost:${PORTA}`);
});
