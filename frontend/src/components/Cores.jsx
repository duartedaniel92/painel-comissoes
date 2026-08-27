import { useState } from "react";
import { PALETAS, aplicarTema, lerTemaSalvo } from "../tema.js";

export default function Cores() {
  const [tema, setTema] = useState(lerTemaSalvo);
  const [aberto, setAberto] = useState(false);

  const escolher = (paleta) => {
    const novo = { accent: paleta.accent, bg: paleta.bg, panel: paleta.panel };
    setTema(novo);
    aplicarTema(novo);
  };

  return (
    <div className="panel">
      <button
        type="button"
        className="painel-toggle"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
      >
        Personalizar cores {aberto ? "▲" : "▼"}
      </button>

      {aberto && (
        <div className="paletas">
          {PALETAS.map((paleta) => (
            <button
              key={paleta.nome}
              type="button"
              className={`paleta ${tema.accent === paleta.accent ? "ativa" : ""}`}
              onClick={() => escolher(paleta)}
            >
              <span className="amostra" style={{ background: paleta.accent }} aria-hidden="true" />
              {paleta.nome}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
