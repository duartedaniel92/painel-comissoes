import { dados, novoId, registrarNaAuditoria } from "./dados.js";
import { calcularComissao, calcularComissaoDaVenda } from "./comissao.js";

const DIAS_UTEIS = 22;

function validar(dados) {
  const erros = [];

  if (!dados.nome || !dados.nome.trim()) erros.push("Nome é obrigatório");
  if (!dados.filial || !dados.filial.trim()) erros.push("Filial é obrigatória");

  for (const campo of ["metaMensal", "faturamentoDia", "faturamentoMes"]) {
    if (dados[campo] !== undefined && Number(dados[campo]) < 0) {
      erros.push("Os valores não podem ser negativos");
      break;
    }
  }

  return erros;
}

function status(vendedor) {
  const progresso = vendedor.metaMensal > 0 ? vendedor.faturamentoMes / vendedor.metaMensal : 0;
  if (progresso >= 1) return "verde";
  if (progresso >= 0.6) return "amarelo";
  return "vermelho";
}

// Acrescenta ao vendedor o que é calculado, e não guardado: comissão,
// percentual da meta e a cor do indicador.
function comDadosCalculados(vendedor) {
  const comissao = calcularComissao(
    vendedor.faturamentoMes,
    vendedor.metaMensal,
    dados.regraComissao
  );
  const metaDiaria = vendedor.metaMensal / DIAS_UTEIS;

  return {
    ...vendedor,
    percentualMeta: comissao.percentualMeta,
    taxaAplicada: comissao.taxaAplicada,
    bonusFixo: comissao.bonusFixo,
    comissaoTotal: comissao.comissaoTotal,
    progressoMes: vendedor.metaMensal > 0 ? vendedor.faturamentoMes / vendedor.metaMensal : 0,
    progressoDia: metaDiaria > 0 ? vendedor.faturamentoDia / metaDiaria : 0,
    status: status(vendedor),
  };
}

export function listarVendedores({ busca, ordenarPor, direcao } = {}) {
  let lista = dados.vendedores.map(comDadosCalculados);

  if (busca) {
    const termo = busca.toLowerCase();
    lista = lista.filter((v) =>
      [v.nome, v.filial, v.funcao].some((campo) => campo.toLowerCase().includes(termo))
    );
  }

  if (ordenarPor) {
    lista.sort((a, b) => {
      const valorA = a[ordenarPor];
      const valorB = b[ordenarPor];
      const comparacao =
        typeof valorA === "string"
          ? valorA.localeCompare(valorB, "pt-BR")
          : Number(valorA) - Number(valorB);
      return direcao === "desc" ? -comparacao : comparacao;
    });
  }

  return lista;
}

export function buscarVendedor(id) {
  const vendedor = dados.vendedores.find((v) => v.id === id);
  if (!vendedor) return null;

  const vendas = (dados.vendasPorVendedor[id] || []).map((venda) => ({
    ...venda,
    comissaoItem: calcularComissaoDaVenda(venda.valor, venda.categoria, dados.regrasCategoria),
  }));

  return { ...comDadosCalculados(vendedor), vendas };
}

export function criarVendedor(novosDados, usuario = "Gestor") {
  const erros = validar(novosDados);
  if (erros.length > 0) return { erros };

  const novo = {
    id: novoId("v"),
    nome: novosDados.nome.trim(),
    funcao: novosDados.funcao || "Vendedor(a)",
    filial: novosDados.filial.trim(),
    dataInicio: novosDados.dataInicio || new Date().toISOString().slice(0, 10),
    metaMensal: Number(novosDados.metaMensal) || 0,
    faturamentoDia: Number(novosDados.faturamentoDia) || 0,
    faturamentoMes: Number(novosDados.faturamentoMes) || 0,
    atendimentosDia: Number(novosDados.atendimentosDia) || 0,
    conversao: Number(novosDados.conversao) || 0,
    pa: Number(novosDados.pa) || 0,
  };

  dados.vendedores.push(novo);
  dados.vendasPorVendedor[novo.id] = [];

  registrarNaAuditoria(usuario, `Cadastrou o vendedor "${novo.nome}" (${novo.filial})`);

  return { vendedor: comDadosCalculados(novo) };
}

export function atualizarVendedor(id, novosDados, usuario = "Gestor") {
  const vendedor = dados.vendedores.find((v) => v.id === id);
  if (!vendedor) return {};

  const erros = validar({ ...vendedor, ...novosDados });
  if (erros.length > 0) return { erros };

  const textos = ["nome", "funcao", "filial", "dataInicio"];
  const numeros = [
    "metaMensal",
    "faturamentoDia",
    "faturamentoMes",
    "atendimentosDia",
    "conversao",
    "pa",
  ];

  for (const campo of textos) {
    if (novosDados[campo] !== undefined) vendedor[campo] = String(novosDados[campo]);
  }
  for (const campo of numeros) {
    if (novosDados[campo] !== undefined) vendedor[campo] = Number(novosDados[campo]) || 0;
  }

  registrarNaAuditoria(usuario, `Editou o vendedor "${vendedor.nome}"`);

  return { vendedor: comDadosCalculados(vendedor) };
}

export function excluirVendedor(id, usuario = "Gestor") {
  const posicao = dados.vendedores.findIndex((v) => v.id === id);
  if (posicao === -1) return false;

  const [removido] = dados.vendedores.splice(posicao, 1);
  delete dados.vendasPorVendedor[id];

  registrarNaAuditoria(usuario, `Removeu o vendedor "${removido.nome}"`);

  return true;
}
