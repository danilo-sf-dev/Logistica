import React, { useState } from "react";
import { ModalConfirmacaoExclusaoGenerico } from "../index";
import type { Cidade } from "../types";

const CidadesTestePage: React.FC = () => {
  const [mostrarModalGenerico, setMostrarModalGenerico] = useState(false);

  // Cidade de exemplo para teste
  const cidadeTeste: Cidade = {
    id: "teste-123",
    nome: "São Paulo",
    estado: "SP",
    regiao: "sudeste",
    distancia: 0,
    pesoMinimo: 100,
    rotaId: null,
  };

  const handleConfirmarExclusao = () => {
    console.log("Exclusão confirmada!");
    setMostrarModalGenerico(false);
  };

  const handleCancelarExclusao = () => {
    console.log("Exclusão cancelada!");
    setMostrarModalGenerico(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Teste de Modais de Confirmação
      </h1>

      <div className="grid grid-cols-1 gap-8">
        {/* Modal Genérico */}
        <div className="bg-white p-6 rounded-lg shadow-md border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Modal Genérico (Novo)
          </h2>
          <p className="text-gray-600 mb-4">
            Este é o novo modal genérico que criamos.
          </p>
          <button
            onClick={() => setMostrarModalGenerico(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Abrir Modal Genérico
          </button>
        </div>
      </div>

      {/* Instruções */}
      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Como testar:
        </h3>
        <ol className="list-decimal list-inside text-gray-600 space-y-2">
          <li>Clique em qualquer um dos botões acima para abrir os modais</li>
          <li>Compare a aparência e comportamento dos dois modais</li>
          <li>Teste clicar fora do modal para fechar (se disponível)</li>
          <li>Teste os botões de ação</li>
          <li>
            Verifique se as informações da cidade estão sendo exibidas
            corretamente
          </li>
        </ol>
      </div>

      {/* Modal Genérico */}
      <ModalConfirmacaoExclusaoGenerico
        aberto={mostrarModalGenerico}
        cidade={cidadeTeste}
        onConfirmar={handleConfirmarExclusao}
        onCancelar={handleCancelarExclusao}
      />
    </div>
  );
};

export default CidadesTestePage;
