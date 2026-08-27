import { useState } from "react";

const USUARIO = "Gestor Carlos";

const CAMPOS = [
  { key: "nome", label: "Nome", tipo: "text", obrigatorio: true },
  { key: "funcao", label: "Função", tipo: "text" },
  { key: "filial", label: "Filial", tipo: "text", obrigatorio: true },
  { key: "dataInicio", label: "Data de início", tipo: "date" },
  { key: "metaMensal", label: "Meta mensal (R$)", tipo: "number", step: "100", obrigatorio: true },
  { key: "faturamentoDia", label: "Faturamento do dia (R$)", tipo: "number", step: "10" },
  { key: "faturamentoMes", label: "Faturamento do mês (R$)", tipo: "number", step: "100" },
  { key: "atendimentosDia", label: "Atendimentos no dia", tipo: "number", step: "1" },
  { key: "conversao", label: "Conversão (0 a 1 — ex.: 0,35 = 35%)", tipo: "number", step: "0.01" },
  { key: "pa", label: "PA (peças por atendimento)", tipo: "number", step: "0.1" },
];

const formularioVazio = {
  nome: "",
  funcao: "Vendedor(a)",
  filial: "",
  dataInicio: new Date().toISOString().slice(0, 10),
  metaMensal: "",
  faturamentoDia: "0",
  faturamentoMes: "0",
  atendimentosDia: "0",
  conversao: "0",
  pa: "0",
};

export default function NovoVendedor({ onClose, onCriado }) {
  const [form, setForm] = useState(formularioVazio);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const atualizar = (campo, valor) => setForm({ ...form, [campo]: valor });

  const salvar = async (evento) => {
    evento.preventDefault();

    if (!form.nome.trim() || !form.filial.trim()) {
      setErro("Preencha o nome e a filial do vendedor.");
      return;
    }
    if (!form.metaMensal || Number(form.metaMensal) <= 0) {
      setErro("Defina a meta mensal — é ela que determina a comissão do vendedor.");
      return;
    }

    setSalvando(true);
    setErro("");

    const resposta = await fetch("/api/sellers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, usuario: USUARIO }),
    });

    if (!resposta.ok) {
      const corpo = await resposta.json();
      setErro(corpo.erro);
      setSalvando(false);
      return;
    }

    onCriado();
    onClose();
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <form className="drawer" onClick={(e) => e.stopPropagation()} onSubmit={salvar}>
        <div className="drawer-header">
          <div>
            <h2>Novo vendedor</h2>
            <div className="filial">Cadastro de colaborador</div>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </div>

        {CAMPOS.map((campo) => (
          <div key={campo.key} className="campo">
            <label htmlFor={`novo-${campo.key}`}>
              {campo.label}
              {campo.obrigatorio && <span aria-hidden="true"> *</span>}
            </label>
            <input
              id={`novo-${campo.key}`}
              type={campo.tipo}
              step={campo.step}
              min={campo.tipo === "number" ? "0" : undefined}
              required={campo.obrigatorio}
              value={form[campo.key]}
              onChange={(e) => atualizar(campo.key, e.target.value)}
            />
          </div>
        ))}

        {erro && (
          <div className="save-hint erro" role="alert" style={{ marginBottom: 12 }}>
            {erro}
          </div>
        )}

        <button
          type="submit"
          className="btn"
          disabled={salvando}
          style={{ width: "100%", marginTop: 8 }}
        >
          {salvando ? "Salvando..." : "Cadastrar vendedor"}
        </button>
      </form>
    </div>
  );
}
