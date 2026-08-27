import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Vendedores from "../components/Vendedores.jsx";

const VENDEDORES = [
  {
    id: "v1",
    nome: "Carla Menezes",
    funcao: "Vendedora Sênior",
    filial: "Shopping Center Norte",
    metaMensal: 30000,
    faturamentoMes: 18400,
    percentualMeta: 61.3,
    taxaAplicada: 1,
    bonusFixo: 0,
    comissaoTotal: 184,
    conversao: 0.42,
    status: "amarelo",
  },
];

describe("mesa de performance", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve({ json: () => Promise.resolve(VENDEDORES) }))
    );
  });

  it("mostra os vendedores que a API devolve", async () => {
    render(<Vendedores />);

    expect(await screen.findByText("Carla Menezes")).toBeInTheDocument();
    expect(screen.getByText("Shopping Center Norte")).toBeInTheDocument();
  });

  it("mostra a comissão calculada de cada vendedor", async () => {
    render(<Vendedores />);

    expect(await screen.findByText(/184,00/)).toBeInTheDocument();
  });

  it("busca por nome envia o termo para a API", async () => {
    const usuario = userEvent.setup();
    render(<Vendedores />);

    await screen.findByText("Carla Menezes");
    await usuario.type(screen.getByLabelText("Buscar vendedores"), "carla");

    const chamadas = fetch.mock.calls.map(([url]) => url);
    expect(chamadas.some((url) => url.includes("busca=carla"))).toBe(true);
  });
});
