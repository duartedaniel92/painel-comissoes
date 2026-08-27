import { dados, novoId, registrarNaAuditoria } from "./dados.js";

export function obterRegras() {
  return { regraComissao: dados.regraComissao, regrasCategoria: dados.regrasCategoria };
}

export function atualizarRegra({ taxaAbaixoMeta, taxaNaMeta, faixasBonus }, usuario = "Gestor") {
  const erros = [];

  if (Number(taxaAbaixoMeta) < 0 || Number(taxaNaMeta) < 0) {
    erros.push("As taxas não podem ser negativas");
  }

  for (const faixa of faixasBonus) {
    // premiar abaixo de 100% não faz sentido: a faixa existe para superação
    if (Number(faixa.percentualMeta) < 100) {
      erros.push("A faixa de bônus precisa ser de 100% da meta para cima");
    }
    if (Number(faixa.bonusFixo) < 0) {
      erros.push("O bônus não pode ser negativo");
    }
  }

  if (erros.length > 0) return { erros };

  dados.regraComissao = {
    taxaAbaixoMeta: Number(taxaAbaixoMeta),
    taxaNaMeta: Number(taxaNaMeta),
    // ordenadas porque o cálculo percorre as faixas de baixo para cima
    faixasBonus: faixasBonus
      .map((faixa) => ({
        id: faixa.id || novoId("b"),
        percentualMeta: Number(faixa.percentualMeta),
        taxa: Number(faixa.taxa),
        bonusFixo: Number(faixa.bonusFixo),
      }))
      .sort((a, b) => a.percentualMeta - b.percentualMeta),
  };

  registrarNaAuditoria(usuario, "Atualizou a regra de comissão");

  return { regraComissao: dados.regraComissao };
}
