import { useEffect, useState } from "react";

export default function Auditoria() {
  const [eventos, setEventos] = useState([]);
  const [erro, setErro] = useState("");

  useEffect(() => {
    fetch("/api/audit")
      .then((resposta) => resposta.json())
      .then(setEventos)
      .catch(() => setErro("Não consegui carregar o histórico."));
  }, []);

  if (erro) return <p className="erro-painel">{erro}</p>;

  return (
    <>
      <div className="page-header">
        <h1>Auditoria</h1>
        <p>Toda alteração de cadastro ou de regra fica registrada aqui.</p>
      </div>

      <div className="panel">
        {eventos.length === 0 ? (
          <p className="texto-vazio">Nenhuma alteração registrada ainda.</p>
        ) : (
          eventos.map((evento) => (
            <div className="audit-item" key={evento.id}>
              <div className="dot edicao" />
              <div>
                <div className="when">
                  {new Date(evento.data).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
                <div className="who">{evento.usuario}</div>
                <div className="what">{evento.acao}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
