import { useEffect, useState } from "react";

const USUARIO = "Gestor Carlos";

const moeda = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export default function Regras() {
  const [regra, setRegra] = useState(null);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/rules")
      .then((resposta) => resposta.json())
      .then((dados) => setRegra(dados.regraComissao))
      .catch(() => setErro("Não consegui carregar as regras."));
  }, []);

  const atualizarBase = (campo, valor) => setRegra({ ...regra, [campo]: valor });

  const atualizarFaixa = (id, campo, valor) => {
    setRegra({
      ...regra,
      faixasBonus: regra.faixasBonus.map((f) => (f.id === id ? { ...f, [campo]: valor } : f)),
    });
  };

  const adicionarFaixa = () => {
    const ultima = regra.faixasBonus[regra.faixasBonus.length - 1];
    const percentual = ultima ? Number(ultima.percentualMeta) + 10 : 110;

    setRegra({
      ...regra,
      faixasBonus: [
        ...regra.faixasBonus,
        {
          id: `nova-${percentual}`,
          percentualMeta: percentual,
          taxa: regra.taxaNaMeta,
          bonusFixo: 0,
        },
      ],
    });
  };

  const removerFaixa = (id) => {
    setRegra({ ...regra, faixasBonus: regra.faixasBonus.filter((f) => f.id !== id) });
  };

  const salvar = async () => {
    setMensagem("");
    setErro("");

    const resposta = await fetch("/api/rules/meta", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...regra, usuario: USUARIO }),
    });

    const corpo = await resposta.json();

    if (!resposta.ok) {
      setErro(corpo.erro);
      return;
    }

    setRegra(corpo.regraComissao);
    setMensagem("Regra salva. O painel já usa os valores novos.");
  };

  if (erro && !regra) return <p className="erro-painel">{erro}</p>;
  if (!regra) return <div className="loading">Carregando regras...</div>;

  return (
    <>
      <div className="page-header">
        <h1>Central de Regras</h1>
        <p>A comissão é calculada sobre o percentual da meta individual de cada vendedor.</p>
      </div>

      <div className="panel">
        <h2>Taxas base</h2>

        <div className="campo">
          <label htmlFor="taxa-abaixo">Abaixo da meta (%)</label>
          <input
            id="taxa-abaixo"
            type="number"
            step="0.1"
            min="0"
            value={regra.taxaAbaixoMeta}
            onChange={(e) => atualizarBase("taxaAbaixoMeta", e.target.value)}
          />
        </div>

        <div className="campo">
          <label htmlFor="taxa-meta">Ao atingir a meta (%)</label>
          <input
            id="taxa-meta"
            type="number"
            step="0.1"
            min="0"
            value={regra.taxaNaMeta}
            onChange={(e) => atualizarBase("taxaNaMeta", e.target.value)}
          />
        </div>
      </div>

      <div className="panel">
        <h2>Faixas de superação</h2>
        <p className="sub">A partir de cada percentual, o vendedor ganha um bônus fixo.</p>

        {regra.faixasBonus.map((faixa) => (
          <div key={faixa.id} className="faixa-row">
            <div className="campo">
              <label htmlFor={`percentual-${faixa.id}`}>% da meta</label>
              <input
                id={`percentual-${faixa.id}`}
                type="number"
                step="1"
                min="100"
                value={faixa.percentualMeta}
                onChange={(e) => atualizarFaixa(faixa.id, "percentualMeta", e.target.value)}
              />
            </div>

            <div className="campo">
              <label htmlFor={`bonus-${faixa.id}`}>Bônus fixo (R$)</label>
              <input
                id={`bonus-${faixa.id}`}
                type="number"
                step="50"
                min="0"
                value={faixa.bonusFixo}
                onChange={(e) => atualizarFaixa(faixa.id, "bonusFixo", e.target.value)}
              />
            </div>

            <button
              type="button"
              className="btn secondary"
              onClick={() => removerFaixa(faixa.id)}
              aria-label={`Remover a faixa de ${faixa.percentualMeta}%`}
            >
              Remover
            </button>
          </div>
        ))}

        <button type="button" className="btn secondary" onClick={adicionarFaixa}>
          + Adicionar faixa
        </button>
      </div>

      <div className="panel">
        <h2>Simulação</h2>
        <p className="sub">
          Um vendedor com meta de {moeda(30000)} que atingir 120% recebe{" "}
          {moeda(36000 * (regra.taxaNaMeta / 100) + Number(regra.faixasBonus[1]?.bonusFixo || 0))}.
        </p>
      </div>

      <button type="button" className="btn" onClick={salvar}>
        Salvar regra de comissão
      </button>

      <div className="save-hint" aria-live="polite">
        {mensagem}
      </div>
      {erro && (
        <div className="save-hint erro" role="alert">
          {erro}
        </div>
      )}
    </>
  );
}
