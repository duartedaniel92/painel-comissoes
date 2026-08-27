// Comissão calculada pelo percentual de atingimento da meta individual do
// vendedor — não pelo resultado da loja. Dois vendedores que faturaram o mesmo
// valor recebem comissões diferentes se as metas deles forem diferentes.
//
// Abaixo de 100% da meta usa a taxa menor; de 100% em diante, a taxa cheia;
// e cada faixa de superação acrescenta um bônus fixo em reais.
export function calcularComissao(faturamentoMes, metaMensal, regra) {
  const faturamento = Number(faturamentoMes) || 0;
  const meta = Number(metaMensal) || 0;

  if (meta <= 0) {
    return { percentualMeta: 0, taxaAplicada: 0, bonusFixo: 0, comissaoTotal: 0 };
  }

  const percentualMeta = (faturamento / meta) * 100;

  let taxaAplicada = percentualMeta >= 100 ? regra.taxaNaMeta : regra.taxaAbaixoMeta;
  let bonusFixo = 0;

  // as faixas estão em ordem crescente, então a última que o vendedor
  // alcançar é a que vale
  for (const faixa of regra.faixasBonus) {
    if (percentualMeta >= faixa.percentualMeta) {
      taxaAplicada = faixa.taxa;
      bonusFixo = faixa.bonusFixo;
    }
  }

  const comissaoTotal = faturamento * (taxaAplicada / 100) + bonusFixo;

  return {
    percentualMeta: Number(percentualMeta.toFixed(1)),
    taxaAplicada,
    bonusFixo,
    comissaoTotal: Number(comissaoTotal.toFixed(2)),
  };
}

// Comissão de referência por categoria do produto. Aparece como informação no
// extrato do vendedor e não entra no total, que segue a meta.
export function calcularComissaoDaVenda(valor, categoria, regrasCategoria) {
  const regra = regrasCategoria.find((r) => r.categoria === categoria);
  if (!regra) return null;
  return Number((Number(valor) * (regra.taxa / 100)).toFixed(2));
}
