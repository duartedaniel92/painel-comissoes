import { useEffect, useState } from "react";
import NovoVendedor from "./NovoVendedor.jsx";
import DetalheVendedor from "./DetalheVendedor.jsx";

const moeda = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const percentual = (v) => `${Number(v || 0).toFixed(1)}%`;
const percentualDecimal = (v) => `${Math.round(Number(v || 0) * 100)}%`;

const COLUNAS = [
  { key: "nome", label: "Vendedor" },
  { key: "funcao", label: "Função" },
  { key: "filial", label: "Filial" },
  { key: "faturamentoMes", label: "Faturamento (mês)" },
  { key: "percentualMeta", label: "% da meta" },
  { key: "comissaoTotal", label: "Comissão" },
  { key: "conversao", label: "Conversão" },
];

export default function Vendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [busca, setBusca] = useState("");
  const [ordenarPor, setOrdenarPor] = useState("faturamentoMes");
  const [direcao, setDirecao] = useState("desc");
  const [erro, setErro] = useState("");
  const [selecionado, setSelecionado] = useState(null);
  const [mostrarNovo, setMostrarNovo] = useState(false);
  const [recarregar, setRecarregar] = useState(0);

  useEffect(() => {
    const parametros = new URLSearchParams({ busca, ordenarPor, direcao });

    fetch(`/api/sellers?${parametros}`)
      .then((resposta) => resposta.json())
      .then(setVendedores)
      .catch(() => setErro("Não consegui carregar a equipe."));
  }, [busca, ordenarPor, direcao, recarregar]);

  const alternarOrdenacao = (coluna) => {
    if (ordenarPor === coluna) {
      setDirecao(direcao === "asc" ? "desc" : "asc");
    } else {
      setOrdenarPor(coluna);
      setDirecao("desc");
    }
  };

  if (erro) return <p className="erro-painel">{erro}</p>;

  return (
    <>
      <div className="page-header">
        <h1>Mesa de Performance</h1>
        <p>Faturamento, meta e comissão de cada vendedor da equipe.</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="search"
          placeholder="Buscar por vendedor, função ou filial..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          aria-label="Buscar vendedores"
        />
        <button type="button" className="btn" onClick={() => setMostrarNovo(true)}>
          + Novo vendedor
        </button>
      </div>

      <div className="panel sem-padding">
        <div className="tabela-rolavel">
          <table>
            <caption className="sr-only">Equipe de vendas com faturamento, meta e comissão</caption>
            <thead>
              <tr>
                <th scope="col">
                  <span className="sr-only">Status da meta</span>
                </th>
                {COLUNAS.map((coluna) => (
                  <th key={coluna.key} scope="col">
                    <button
                      type="button"
                      className="th-ordenar"
                      onClick={() => alternarOrdenacao(coluna.key)}
                    >
                      {coluna.label}
                      <span aria-hidden="true">
                        {ordenarPor === coluna.key ? (direcao === "asc" ? " ↑" : " ↓") : ""}
                      </span>
                    </button>
                  </th>
                ))}
                <th scope="col">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id} className="seller-row">
                  <td>
                    <span className={`status-dot ${vendedor.status}`} />
                  </td>
                  <td>{vendedor.nome}</td>
                  <td>{vendedor.funcao}</td>
                  <td>{vendedor.filial}</td>
                  <td>{moeda(vendedor.faturamentoMes)}</td>
                  <td>{percentual(vendedor.percentualMeta)}</td>
                  <td>{moeda(vendedor.comissaoTotal)}</td>
                  <td>{percentualDecimal(vendedor.conversao)}</td>
                  <td>
                    <button
                      type="button"
                      className="acao-editar"
                      onClick={() => setSelecionado(vendedor.id)}
                      aria-label={`Editar ${vendedor.nome}`}
                    >
                      <span aria-hidden="true">editar ›</span>
                    </button>
                  </td>
                </tr>
              ))}

              {vendedores.length === 0 && (
                <tr>
                  <td colSpan={COLUNAS.length + 2} className="tabela-vazia">
                    {busca
                      ? `Nenhum vendedor encontrado para "${busca}".`
                      : "Nenhum vendedor cadastrado."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selecionado && (
        <DetalheVendedor
          vendedorId={selecionado}
          onClose={() => setSelecionado(null)}
          onAlterado={() => setRecarregar((n) => n + 1)}
        />
      )}

      {mostrarNovo && (
        <NovoVendedor
          onClose={() => setMostrarNovo(false)}
          onCriado={() => setRecarregar((n) => n + 1)}
        />
      )}
    </>
  );
}
