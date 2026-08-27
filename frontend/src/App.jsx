import { useState } from "react";
import Painel from "./components/Painel.jsx";
import Vendedores from "./components/Vendedores.jsx";
import Regras from "./components/Regras.jsx";
import Auditoria from "./components/Auditoria.jsx";
import Exportar from "./components/Exportar.jsx";

const PAGINAS = [
  { id: "painel", nome: "Painel Principal", Componente: Painel },
  { id: "vendedores", nome: "Vendedores", Componente: Vendedores },
  { id: "regras", nome: "Regras de Comissão", Componente: Regras },
  { id: "auditoria", nome: "Auditoria", Componente: Auditoria },
  { id: "exportar", nome: "Exportar", Componente: Exportar },
];

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
