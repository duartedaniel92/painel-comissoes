import { test, after } from "node:test";
import assert from "node:assert/strict";
import app from "../server.js";

// porta 0: o sistema escolhe uma livre, então a suíte roda mesmo com o
// `npm run dev` aberto em outra janela
const servidor = app.listen(0);
after(() => servidor.close());

const url = (caminho) => `http://127.0.0.1:${servidor.address().port}${caminho}`;

test("lista os vendedores com a comissão já calculada", async () => {
  const resposta = await fetch(url("/api/sellers"));
  const corpo = await resposta.json();

  assert.equal(resposta.status, 200);
  assert.ok(corpo.length >= 4);
  assert.equal(typeof corpo[0].comissaoTotal, "number");
});

test("vendedor inexistente devolve 404", async () => {
  const resposta = await fetch(url("/api/sellers/nao-existe"));
  assert.equal(resposta.status, 404);
});

test("cadastro sem nome é recusado", async () => {
  const resposta = await fetch(url("/api/sellers"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "", filial: "Loja" }),
  });

  assert.equal(resposta.status, 400);
});

test("cadastro com valor negativo é recusado", async () => {
  const resposta = await fetch(url("/api/sellers"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome: "Alguém", filial: "Loja", metaMensal: -100 }),
  });

  assert.equal(resposta.status, 400);
});

test("faixa de bônus abaixo de 100% da meta é recusada", async () => {
  const resposta = await fetch(url("/api/rules/meta"), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taxaAbaixoMeta: 1,
      taxaNaMeta: 2,
      faixasBonus: [{ percentualMeta: 80, taxa: 2, bonusFixo: 100 }],
    }),
  });

  assert.equal(resposta.status, 400);
});

test("a exportação devolve um CSV com cabeçalho de download", async () => {
  const resposta = await fetch(url("/api/export/folha.csv"));
  const texto = await resposta.text();

  assert.equal(resposta.status, 200);
  assert.match(resposta.headers.get("content-disposition"), /folha-comissoes\.csv/);
  assert.match(texto, /Vendedor;Função;Filial/);
});
