import { useEffect, useState } from "react";

const USUARIO = "Gestor Carlos";

const moeda = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const percentual = (v) => `${Number(v || 0).toFixed(1)}%`;

const CAMPOS = [
  { key: "nome", label: "Nome", tipo: "text" },
  { key: "funcao", label: "Função", tipo: "text" },
  { key: "filial", label: "Filial", tipo: "text" },
  { key: "dataInicio", label: "Data de início", tipo: "date" },
  { key: "metaMensal", label: "Meta mensal (R$)", tipo: "number", step: "100" },
  { key: "faturamentoDia", label: "Faturamento do dia (R$)", tipo: "number", step: "10" },
  { key: "faturamentoMes", label: "Faturamento do mês (R$)", tipo: "number", step: "100" },
  { key: "atendimentosDia", label: "Atendimentos no dia", tipo: "number", step: "1" },
  { key: "conversao", label: "Conversão (0 a 1 — ex.: 0,35 = 35%)", tipo: "number", step: "0.01" },
  { key: "pa", label: "PA (peças por atendimento)", tipo: "number", step: "0.1" },
];

export default function DetalheVendedor({ vendedorId, onClose, onAlterado }) {
  const [vendedor, setVendedor] = useState(null);
  const [form, setForm] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch(`/api/sellers/${vendedorId}`)
      .then((resposta) => resposta.json())
      .then((dados) => {
        setVendedor(dados);
        setForm(Object.fromEntries(CAMPOS.map((c) => [c.key, dados[c.key] ?? ""])));
      })
      .catch(() => setErro("Não consegui carregar o vendedor."));
  }, [vendedorId]);

  const salvar = async () => {
    setMensagem("");
    setErro("");

    const resposta = await fetch(`/api/sellers/${vendedorId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, usuario: USUARIO }),
    });

    const corpo = await resposta.json();

    if (!resposta.ok) {
      setErro(corpo.erro);
      return;
    }

    setVendedor(corpo);
    setMensagem("Alterações salvas.");
    onAlterado();
  };

  const excluir = async () => {
    const confirmado = window.confirm(
      `Remover ${vendedor.nome}?\n\nEsta ação não pode ser desfeita.`
    );
    if (!confirmado) return;

    await fetch(`/api/sellers/${vendedorId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: USUARIO }),
    });

    onAlterado();
    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        {erro && !vendedor ? (
          <p role="alert">{erro}</p>
        ) : !vendedor || !form ? (
          <div className="loading">Carregando...</div>
        ) : (
          <>
            <div className="drawer-header">
              <div>
                <h2>{vendedor.nome}</h2>
                <div className="filial">
                  {vendedor.funcao} · {vendedor.filial}
                </div>
              </div>
              <button type="button" className="close-btn" onClick={onClose} aria-label="Fechar">
                ×
              </button>
            </div>

            <div className="drawer-stat-row">
              <span>% da meta atingido</span>
              <span className="v">{percentual(vendedor.percentualMeta)}</span>
            </div>
            <div className="drawer-stat-row">
              <span>Taxa de comissão aplicada</span>
              <span className="v">{percentual(vendedor.taxaAplicada)}</span>
            </div>
            <div className="drawer-stat-row">
              <span>Bônus fixo</span>
              <span className="v">{vendedor.bonusFixo > 0 ? moeda(vendedor.bonusFixo) : "—"}</span>
            </div>
            <div className="drawer-stat-row">
              <span>Comissão total</span>
              <span className="v destaque">{moeda(vendedor.comissaoTotal)}</span>
            </div>

            <h2 className="titulo-secao">Editar dados</h2>
            {CAMPOS.map((campo) => (
              <div key={campo.key} className="campo">
                <label htmlFor={`editar-${campo.key}`}>{campo.label}</label>
                <input
                  id={`editar-${campo.key}`}
                  type={campo.tipo}
                  step={campo.step}
                  min={campo.tipo === "number" ? "0" : undefined}
                  value={form[campo.key]}
                  onChange={(e) => setForm({ ...form, [campo.key]: e.target.value })}
                />
              </div>
            ))}

            <button
              type="button"
              className="btn"
              onClick={salvar}
              style={{ width: "100%", marginTop: 6 }}
            >
              Salvar alterações
            </button>

            <div className="save-hint" aria-live="polite">
              {mensagem}
            </div>
            {erro && (
              <div className="save-hint erro" role="alert">
                {erro}
              </div>
            )}

            <button
              type="button"
              className="btn secondary perigo"
              onClick={excluir}
              style={{ width: "100%", marginTop: 10 }}
            >
              Excluir vendedor
            </button>

            <h2 className="titulo-secao">Vendas do dia</h2>
            {vendedor.vendas.length === 0 ? (
              <p className="texto-vazio">Nenhuma venda registrada hoje.</p>
            ) : (
              vendedor.vendas.map((venda) => (
                <div className="sale-item" key={venda.id}>
                  <div>
                    <div>{venda.produto}</div>
                    <div className="meta">
                      {venda.categoria} · {venda.hora}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div>{moeda(venda.valor)}</div>
                    <div className="meta">ref.: {moeda(venda.comissaoItem)}</div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}
