import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useFolgas } from "../state/useFolgas";
import { folgasService } from "../data/folgasService";
import { FolgasFilters } from "../ui/FolgasFilters";
import { FolgasTable } from "../ui/FolgasTable";
import { FolgaFormModal } from "../ui/FolgaFormModal";
import { ConfirmationModal, TableExportModal } from "../../common/modals";

export function FolgasListPage() {
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    loading,
    folgasPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    termoBusca,
    setTermoBusca,
    filtroStatus,
    setFiltroStatus,
    filtroTipo,
    setFiltroTipo,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    mostrarModal,
    editando,
    valores,
    setValores,
    setMostrarModal,
    mostrarModalExclusao,
    folgaParaExcluir,
    abrirCriacao,
    editarFolga,
    excluirFolga,
    confirmarExclusao,
    cancelarExclusao,
    aprovarFolga,
    rejeitarFolga,
    confirmar,
    carregar,
    erros,
    handleExportExcel,
  } = useFolgas();

  useEffect(() => {
    carregar();
    // Sincronizar status dos funcionários automaticamente ao carregar a página
    const sincronizarStatusAutomaticamente = async () => {
      try {
        await folgasService.sincronizarStatusFuncionarios();
      } catch (error) {
        console.error("Erro na sincronização automática:", error);
      }
    };
    sincronizarStatusAutomaticamente();
  }, [carregar]);

  // Gerar nome do arquivo para exportação
  const generateFileName = () => {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `folgas_${dataAtual}`;
    return `${nomeArquivo}.xlsx`;
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = () => {
    handleExportExcel();
  };

  const renderPaginacao = () => {
    if (totalPaginado.totalPaginas <= 1) return null;

    const paginas = [];
    const inicio = Math.max(1, paginaAtual - 2);
    const fim = Math.min(totalPaginado.totalPaginas, paginaAtual + 2);

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="flex justify-between flex-1 sm:hidden">
          <button
            onClick={() => setPaginaAtual(paginaAtual - 1)}
            disabled={paginaAtual === 1}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <button
            onClick={() => setPaginaAtual(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginado.totalPaginas}
            className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próximo
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">{totalPaginado.inicio + 1}</span> a{" "}
              <span className="font-medium">{totalPaginado.fim}</span> de{" "}
              <span className="font-medium">{totalPaginado.total}</span>{" "}
              resultados
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPaginaAtual(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Anterior</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {paginas.map((pagina) => (
                <button
                  key={pagina}
                  onClick={() => setPaginaAtual(pagina)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    pagina === paginaAtual
                      ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {pagina}
                </button>
              ))}
              <button
                onClick={() => setPaginaAtual(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginado.totalPaginas}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="sr-only">Próximo</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestão de Folgas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie solicitações de folgas e férias
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleExportClick}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Exportar Excel
          </button>
          <button
            onClick={abrirCriacao}
            className="btn-primary flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Filtros */}
      <FolgasFilters
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
      />

      {/* Tabela */}
      <FolgasTable
        folgas={folgasPaginadas}
        loading={loading}
        ordenarPor={ordenarPor}
        direcaoOrdenacao={direcaoOrdenacao}
        alternarOrdenacao={alternarOrdenacao}
        editarFolga={editarFolga}
        excluirFolga={excluirFolga}
        aprovarFolga={aprovarFolga}
        rejeitarFolga={rejeitarFolga}
      />

      {/* Paginação */}
      {renderPaginacao()}

      {/* Modal de Formulário */}
      <FolgaFormModal
        mostrar={mostrarModal}
        editando={!!editando}
        valores={valores}
        setValores={setValores}
        onConfirmar={confirmar}
        onCancelar={() => setMostrarModal(false)}
        erros={erros}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmationModal
        type="danger"
        isOpen={mostrarModalExclusao}
        onClose={cancelarExclusao}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a solicitação de folga do funcionário "${folgaParaExcluir?.funcionarioNome}"?`}
        primaryAction={{
          label: "Excluir",
          onClick: confirmarExclusao,
          variant: "danger",
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: cancelarExclusao,
          variant: "secondary",
        }}
      />

      <TableExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
        titulo="Folgas"
        nomeArquivo={generateFileName()}
      />
    </div>
  );
}
