import { test } from "node:test";
import assert from "node:assert/strict";
import { calcularComissao } from "../src/comissao.js";

const regra = {
  taxaAbaixoMeta: 1,
  taxaNaMeta: 2,
  faixasBonus: [
    { percentualMeta: 110, taxa: 2, bonusFixo: 500 },
    { percentualMeta: 120, taxa: 2, bonusFixo: 650 },
    { percentualMeta: 130, taxa: 2, bonusFixo: 800 },
  ],
};

test("abaixo da meta usa a taxa menor", () => {
  const resultado = calcularComissao(9000, 10000, regra);

  assert.equal(resultado.taxaAplicada, 1);
  assert.equal(resultado.bonusFixo, 0);
  assert.equal(resultado.comissaoTotal, 90);
});

test("ao atingir a meta usa a taxa cheia", () => {
  const resultado = calcularComissao(10000, 10000, regra);

  assert.equal(resultado.taxaAplicada, 2);
  assert.equal(resultado.comissaoTotal, 200);
});

test("a partir de 110% da meta ganha o bônus da faixa", () => {
  const resultado = calcularComissao(11000, 10000, regra);

  assert.equal(resultado.bonusFixo, 500);
  assert.equal(resultado.comissaoTotal, 720);
});

test("a partir de 130% da meta ganha o maior bônus", () => {
  const resultado = calcularComissao(13000, 10000, regra);

  assert.equal(resultado.bonusFixo, 800);
  assert.equal(resultado.comissaoTotal, 1060);
});

test("quem quase alcançou a faixa não recebe o bônus dela", () => {
  // a tela mostra "110%", mas 109,99% não é 110%
  const resultado = calcularComissao(10999, 10000, regra);

  assert.equal(resultado.percentualMeta, 110);
  assert.equal(resultado.bonusFixo, 0);
});

test("vendedor sem meta definida não gera comissão", () => {
  const resultado = calcularComissao(5000, 0, regra);

  assert.equal(resultado.comissaoTotal, 0);
});
