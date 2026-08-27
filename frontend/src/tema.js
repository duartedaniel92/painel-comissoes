// Tema do painel, guardado no navegador.

const CHAVE = "painel-comissoes:tema";

export const TEMA_PADRAO = {
  accent: "#34d399",
  bg: "#0b1220",
  panel: "#121b2e",
};

export const PALETAS = [
  { nome: "Verde (padrão)", accent: "#34d399", bg: "#0b1220", panel: "#121b2e" },
  { nome: "Azul corporativo", accent: "#3b82f6", bg: "#0a0f1e", panel: "#101a30" },
  { nome: "Roxo", accent: "#a78bfa", bg: "#100b1e", panel: "#1a1330" },
  { nome: "Laranja Kings", accent: "#f59e0b", bg: "#1a1108", panel: "#241a0e" },
  { nome: "Claro", accent: "#0d9488", bg: "#f4f6fa", panel: "#ffffff" },
];

export function aplicarTema(tema) {
  const raiz = document.documentElement;

  raiz.style.setProperty("--accent", tema.accent);
  raiz.style.setProperty("--bg", tema.bg);
  raiz.style.setProperty("--panel", tema.panel);

  // no fundo claro o texto escuro é o único que dá para ler
  const fundoClaro = tema.bg === "#f4f6fa";
  raiz.style.setProperty("--text", fundoClaro ? "#0b1220" : "#e8edf7");
  raiz.style.setProperty("--text-muted", fundoClaro ? "#5b6478" : "#94a3b8");
  raiz.style.setProperty("--border", fundoClaro ? "#dde3ec" : "#1e293b");

  localStorage.setItem(CHAVE, JSON.stringify(tema));
}

export function lerTemaSalvo() {
  const salvo = localStorage.getItem(CHAVE);
  return salvo ? JSON.parse(salvo) : TEMA_PADRAO;
}
