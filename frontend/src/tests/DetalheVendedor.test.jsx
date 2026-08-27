import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DetalheVendedor from "../components/DetalheVendedor.jsx";

const VENDEDOR = {
  id: "v1",
  nome: "Carla Menezes",
  funcao: "Vendedora Sênior",
  filial: "Shopping Center Norte",
  dataInicio: "2026-08-01",
  metaMensal: 30000,
  faturamentoDia: 2150,
  faturamentoMes: 18400,
  atendimentosDia: 14,
  conversao: 0.42,
  pa: 1.8,
  percentualMeta: 61.3,
  taxaAplicada: 1,
  bonusFixo: 0,
  comissaoTotal: 184,
  vendas: [
    {
      id: "s1",
      produto: "Tênis Runner Pro",
      categoria: "Calçados",
      valor: 450,
      comissaoItem: 22.5,
    },
  ],
};

// o PUT devolve o vendedor sem a lista de vendas: elas não mudaram
const RESPOSTA_DO_SALVAR = { ...VENDEDOR, metaMensal: 25000, percentualMeta: 73.6 };
delete RESPOSTA_DO_SALVAR.vendas;

describe("gaveta do vendedor", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url, opcoes) =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(opcoes?.method === "PUT" ? RESPOSTA_DO_SALVAR : VENDEDOR),
        })
      )
    );
  });

  it("mostra os dados e as vendas do dia", async () => {
    render(<DetalheVendedor vendedorId="v1" onClose={() => {}} onAlterado={() => {}} />);

    expect(await screen.findByText("Carla Menezes")).toBeInTheDocument();
    expect(screen.getByText("Tênis Runner Pro")).toBeInTheDocument();
  });

  it("salvar não derruba a tela nem some com as vendas", async () => {
    const usuario = userEvent.setup();
    render(<DetalheVendedor vendedorId="v1" onClose={() => {}} onAlterado={() => {}} />);

    await screen.findByText("Carla Menezes");
    await usuario.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => expect(screen.getByText("Alterações salvas.")).toBeInTheDocument());
    // sem preservar as vendas, o render estoura em vendedor.vendas.length
    expect(screen.getByText("Tênis Runner Pro")).toBeInTheDocument();
  });
});
