// Dados de exemplo do painel. Ficam em memória: reiniciar o servidor
// devolve tudo ao estado inicial.

export const dados = {
  regraComissao: {
    taxaAbaixoMeta: 1,
    taxaNaMeta: 2,
    faixasBonus: [
      { id: "b1", percentualMeta: 110, taxa: 2, bonusFixo: 500 },
      { id: "b2", percentualMeta: 120, taxa: 2, bonusFixo: 650 },
      { id: "b3", percentualMeta: 130, taxa: 2, bonusFixo: 800 },
    ],
  },

  regrasCategoria: [
    { id: "c1", categoria: "Eletrônicos", taxa: 3 },
    { id: "c2", categoria: "Calçados", taxa: 5 },
    { id: "c3", categoria: "Acessórios", taxa: 4 },
  ],

  vendedores: [
    {
      id: "v1",
      nome: "Carla Menezes",
      funcao: "Vendedora Sênior",
      filial: "Shopping Center Norte",
      dataInicio: "2026-08-01",
      metaMensal: 30000,
      faturamentoDia: 2150,
      faturamentoMes: 18400,
      atendimentosDia: 14,
      conversao: 0.42,
      pa: 1.8,
    },
    {
      id: "v2",
      nome: "Bruno Aparecido",
      funcao: "Vendedor",
      filial: "Shopping Center Norte",
      dataInicio: "2026-08-10",
      metaMensal: 30000,
      faturamentoDia: 980,
      faturamentoMes: 9200,
      atendimentosDia: 9,
      conversao: 0.31,
      pa: 1.2,
    },
    {
      id: "v3",
      nome: "Fernanda Lima",
      funcao: "Vendedora Sênior",
      filial: "Shopping Iguatemi",
      dataInicio: "2026-08-01",
      metaMensal: 25000,
      faturamentoDia: 3400,
      faturamentoMes: 32750,
      atendimentosDia: 18,
      conversao: 0.51,
      pa: 2.1,
    },
    {
      id: "v4",
      nome: "Diego Ramos",
      funcao: "Vendedor Júnior",
      filial: "Shopping Iguatemi",
      dataInicio: "2026-08-05",
      metaMensal: 20000,
      faturamentoDia: 1400,
      faturamentoMes: 11750,
      atendimentosDia: 11,
      conversao: 0.28,
      pa: 1.4,
    },
  ],

  vendasPorVendedor: {
    v1: [
      { id: "s1", produto: "Tênis Runner Pro", categoria: "Calçados", valor: 450, hora: "09:15" },
      {
        id: "s2",
        produto: "Fone Bluetooth X2",
        categoria: "Eletrônicos",
        valor: 320,
        hora: "10:40",
      },
      {
        id: "s3",
        produto: "Meia Esportiva (kit)",
        categoria: "Acessórios",
        valor: 80,
        hora: "11:05",
      },
    ],
    v2: [
      {
        id: "s4",
        produto: "Tênis Casual Classic",
        categoria: "Calçados",
        valor: 380,
        hora: "09:50",
      },
    ],
    v3: [
      { id: "s5", produto: "Tênis Trail X", categoria: "Calçados", valor: 520, hora: "08:30" },
      { id: "s6", produto: "Smartwatch Fit", categoria: "Eletrônicos", valor: 690, hora: "13:20" },
    ],
    v4: [{ id: "s7", produto: "Boné Aba Reta", categoria: "Acessórios", valor: 90, hora: "14:10" }],
  },

  auditoria: [
    {
      id: "a1",
      data: "2026-08-18T15:40:00-03:00",
      usuario: "Gestor Carlos",
      acao: "Alterou a comissão da venda #s2 de 3% para 5%",
    },
  ],

  // Série horária do gráfico de tendência, para a loja toda
  vendasIntradia: [
    { hora: "08h", hoje: 400, semanaAnterior: 350 },
    { hora: "09h", hoje: 1200, semanaAnterior: 900 },
    { hora: "10h", hoje: 2100, semanaAnterior: 1800 },
    { hora: "11h", hoje: 3400, semanaAnterior: 3100 },
    { hora: "12h", hoje: 3900, semanaAnterior: 3600 },
    { hora: "13h", hoje: 4800, semanaAnterior: 4200 },
    { hora: "14h", hoje: 5600, semanaAnterior: 5000 },
    { hora: "15h", hoje: 6300, semanaAnterior: 5700 },
  ],
};

let proximoNumero = 10;

export function novoId(prefixo) {
  proximoNumero += 1;
  return `${prefixo}${proximoNumero}`;
}

export function registrarNaAuditoria(usuario, acao) {
  dados.auditoria.unshift({
    id: novoId("a"),
    data: new Date().toISOString(),
    usuario: usuario || "Gestor",
    acao,
  });
}
