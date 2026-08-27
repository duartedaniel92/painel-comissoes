import { useEffect, useState } from "react";

const moeda = (v) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const percentual = (v) => `${Number(v || 0).toFixed(1)}%`;

export default function Exportar() {
  const [vendedores, setVendedores] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/sellers")
      .then((resposta) => resposta.json())
      .then(setVendedores)
      .catch(() => setErro("Não consegui carregar a prévia."));
  }, []);

  if (erro) return <p className="erro-painel">{erro}</p>;

  return (
    <>
      <div className="page-header">
        <h1>Exportar Folha</h1>
        <p>Prévia da folha de comissões. O arquivo sai em CSV, pronto para o Excel.</p>
      </div>

      <a className="btn" href="/api/export/folha.csv" download>
        Baixar folha em CSV
      </a>

      <div className="panel sem-padding" style={{ marginTop: 20 }}>
        <div className="tabela-rolavel">
          <table>
            <caption className="sr-only">Prévia da folha de comissões por vendedor</caption>
            <thead>
              <tr>
                <th scope="col">Vendedor</th>
                <th scope="col">Meta</th>
                <th scope="col">Faturamento</th>
                <th scope="col">% da meta</th>
                <th scope="col">Bônus</th>
                <th scope="col">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((vendedor) => (
                <tr key={vendedor.id}>
                  <td>{vendedor.nome}</td>
                  <td>{moeda(vendedor.metaMensal)}</td>
                  <td>{moeda(vendedor.faturamentoMes)}</td>
                  <td>{percentual(vendedor.percentualMeta)}</td>
                  <td>{vendedor.bonusFixo > 0 ? moeda(vendedor.bonusFixo) : "—"}</td>
                  <td className="celula-comissao">{moeda(vendedor.comissaoTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
