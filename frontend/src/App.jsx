import { useState } from "react";
import Painel from "./components/Painel.jsx";

const PAGINAS = [{ id: "painel", nome: "Painel Principal", Componente: Painel }];

export default function App() {
  const [paginaAtual, setPaginaAtual] = useState("painel");
  const { Componente } = PAGINAS.find((p) => p.id === paginaAtual);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          Kings Sneakers
          <span>comissões</span>
        </div>

        <nav className="nav">
          {PAGINAS.map((pagina) => (
            <button
              key={pagina.id}
              type="button"
              className={`nav-item ${paginaAtual === pagina.id ? "ativo" : ""}`}
              onClick={() => setPaginaAtual(pagina.id)}
            >
              {pagina.nome}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          Kings Sneakers
          <br />
          dados de demonstração
        </div>
      </aside>

      <main className="main" id="conteudo">
        <Componente />
      </main>
    </div>
  );
}
