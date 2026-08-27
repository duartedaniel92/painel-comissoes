import { dados } from "./dados.js";
import { calcularComissao } from "./comissao.js";
import { listarVendedores } from "./vendedores.js";

const MARGEM = 0.55; // margem bruta estimada, usada no card de lucro líquido
const DIAS_UTEIS = 22;
const DIAS_UTEIS_RESTANTES = 10; // estimativa fixa para a projeção do mês

const arredondar = (valor) => Number(valor.toFixed(2));

export function montarPainel() {
  const vendedores = dados.vendedores;
  const somar = (campo) => vendedores.reduce((total, v) => total + Number(v[campo] || 0), 0);

  const faturamentoDia = somar("faturamentoDia");
  const faturamentoMes = somar("faturamentoMes");
  const atendimentos = somar("atendimentosDia");

  const totalComissoes = vendedores.reduce(
    (total, v) =>
      total + calcularComissao(v.faturamentoMes, v.metaMensal, dados.regraComissao).comissaoTotal,
    0
  );

  const custoComissaoDoDia = totalComissoes / DIAS_UTEIS;
  const lucroLiquido = faturamentoDia * MARGEM - custoComissaoDoDia;
  const ticketMedio = atendimentos > 0 ? faturamentoDia / atendimentos : 0;

  // O acréscimo previsto é dividido entre os vendedores na mesma proporção do
  // que cada um já vendeu, e a regra de comissão é reaplicada sobre o valor
  // projetado. Assim a previsão acompanha qualquer mudança nas faixas.
  const acrescimoProjetado = faturamentoDia * DIAS_UTEIS_RESTANTES;

  const previsaoComissao = vendedores.reduce((total, v) => {
    const participacao =
      faturamentoMes > 0 ? v.faturamentoMes / faturamentoMes : 1 / vendedores.length;
    const projetado = v.faturamentoMes + acrescimoProjetado * participacao;
    return total + calcularComissao(projetado, v.metaMensal, dados.regraComissao).comissaoTotal;
  }, 0);

  return {
    cards: {
      faturamentoBrutoDia: arredondar(faturamentoDia),
      totalComissoesMes: arredondar(totalComissoes),
      lucroLiquidoEstimado: arredondar(lucroLiquido),
      ticketMedio: arredondar(ticketMedio),
    },
    tendenciaIntradia: dados.vendasIntradia,
    previsao: {
      faturamentoMes: arredondar(faturamentoMes + acrescimoProjetado),
      comissaoMes: arredondar(previsaoComissao),
      diasUteisRestantes: DIAS_UTEIS_RESTANTES,
    },
    vendedores: listarVendedores({ ordenarPor: "faturamentoMes", direcao: "desc" }),
  };
}
