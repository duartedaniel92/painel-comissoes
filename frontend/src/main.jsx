import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { aplicarTema, lerTemaSalvo } from "./tema.js";
import "./index.css";

// antes do primeiro render, senão a página pisca na cor padrão
aplicarTema(lerTemaSalvo());

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
