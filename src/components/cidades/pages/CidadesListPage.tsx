/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from "react";
import { CidadesTable } from "components/cidades/ui/CidadesTable";
import { CidadesFilters } from "components/cidades/ui/CidadesFilters";
import { useCidades } from "../state/useCidades";
import { CidadeFormModal } from "components/cidades/ui/CidadeFormModal";

const CidadesListPage: React.FC = () => {
  const {
    loading,
    cidadesPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    abrirCriacao,
    editarCidade,
    excluirCidade,
    carregar,
    mostrarModal,
    setMostrarModal,
    valores,
    setValores,
    erros,
    confirmar,
  } = useCidades();

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as cidades atendidas
          </p>
        </div>
        <button onClick={abrirCriacao} className="btn-primary">
          Nova Cidade
        </button>
      </div>

      <div className="card">
        <CidadesFilters termo={termoBusca} onChangeTermo={setTermoBusca} />
      </div>

      <div className="card">
        <CidadesTable
          cidades={cidadesPaginadas}
          ordenarPor={ordenarPor}
          direcaoOrdenacao={direcaoOrdenacao}
          onOrdenar={alternarOrdenacao}
          onEditar={editarCidade}
          onExcluir={excluirCidade}
        />

        {totalPaginado.totalPaginas > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="text-sm text-gray-700">
              Mostrando {totalPaginado.inicio + 1} a {totalPaginado.fim} de{" "}
              {totalPaginado.total} resultados
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              {Array.from(
                { length: totalPaginado.totalPaginas },
                (_, i) => i + 1,
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setPaginaAtual(page)}
                  className={`px-3 py-1 text-sm border rounded-md ${
                    paginaAtual === page
                      ? "bg-primary-600 text-white border-primary-600"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() =>
                  setPaginaAtual(
                    Math.min(totalPaginado.totalPaginas, paginaAtual + 1),
                  )
                }
                disabled={paginaAtual === totalPaginado.totalPaginas}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      <CidadeFormModal
        aberto={mostrarModal}
        editando={null}
        valores={valores}
        erros={erros}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
      />
    </div>
  );
};

export default CidadesListPage;
