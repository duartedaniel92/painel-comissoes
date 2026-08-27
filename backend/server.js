import express from "express";
import cors from "cors";

import { montarPainel } from "./src/painel.js";
import { obterRegras, atualizarRegra } from "./src/regras.js";
import { calcularComissao } from "./src/comissao.js";
import { dados } from "./src/dados.js";
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

// ---------- Regras de comissão ----------

app.get("/api/rules", (req, res) => {
  res.json(obterRegras());
});

app.put("/api/rules/meta", (req, res) => {
  const { erros, regraComissao } = atualizarRegra(req.body, req.body.usuario);
  if (erros) return res.status(400).json({ erro: erros.join(". ") });
  res.json({ regraComissao });
});

// ---------- Auditoria ----------

app.get("/api/audit", (req, res) => {
  res.json(dados.auditoria);
});

// ---------- Exportação ----------

app.get("/api/export/folha.csv", (req, res) => {
  const cabecalho = [
    "Vendedor",
    "Função",
    "Filial",
    "Meta Mensal",
    "Faturamento no Mês",
    "% da Meta",
    "Taxa Aplicada (%)",
    "Bônus Fixo",
    "Comissão Total",
  ];

  const linhas = dados.vendedores.map((vendedor) => {
    const comissao = calcularComissao(
      vendedor.faturamentoMes,
      vendedor.metaMensal,
      dados.regraComissao
    );

    return [
      vendedor.nome,
      vendedor.funcao,
      vendedor.filial,
      vendedor.metaMensal,
      vendedor.faturamentoMes,
      comissao.percentualMeta,
      comissao.taxaAplicada,
      comissao.bonusFixo,
      comissao.comissaoTotal,
    ].join(";");
  });

  // o BOM faz o Excel em portugues abrir o arquivo com a acentuacao correta
  const BOM = "\uFEFF";
  const csv = BOM + [cabecalho.join(";"), ...linhas].join("\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="folha-comissoes.csv"');
  res.send(csv);
});

export default app;

// só sobe a porta quando o arquivo é executado direto: os testes importam o
// app e abrem uma porta efêmera por conta própria
if (process.argv[1]?.endsWith("server.js")) {
  app.listen(PORTA, () => {
    console.log(`API rodando em http://localhost:${PORTA}`);
  });
}
