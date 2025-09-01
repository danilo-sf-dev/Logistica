/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CidadesTable } from "components/cidades/ui/CidadesTable";
import { CidadesFilters } from "components/cidades/ui/CidadesFilters";
import { useCidades } from "../state/useCidades";
import { CidadeFormModal } from "components/cidades/ui/CidadeFormModal";
import { ConfirmationModal, TableExportModal } from "components/common/modals";
import { CidadesTableExportService } from "../export/CidadesTableExportService";
import type { TableExportFilters } from "../../relatorios/export/BaseTableExportService";
import { ImportModal } from "../../import/ui/ImportModal";
import type { ImportResult } from "../../import/types/importTypes";

const CidadesListPage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const {
    loading,
    loadingSubmit,
    loadingExport,
    loadingExclusao,
    cidadesPaginadas,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    itensPorPagina,
    termoBusca,
    setTermoBusca,
    filtroRegiao,
    setFiltroRegiao,
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
    editando,
    mostrarModalExclusao,
    cidadeParaExcluir,
    confirmarExclusao,
    cancelarExclusao,
    handleExportExcel,
  } = useCidades();

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Gerar nome do arquivo para exportação
  const generateFileName = () => {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `cidades_${dataAtual}`;
    return `${nomeArquivo}.xlsx`;
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleExportConfirm = async () => {
    try {
      await handleExportExcel();
      // Modal só fecha quando a exportação for bem-sucedida
      setShowExportModal(false);
    } catch (error) {
      // Em caso de erro, o modal permanece aberto
      console.error("Erro na exportação:", error);
    }
  };

  const handleImportSuccess = (result: ImportResult) => {
    // Recarregar dados da tabela após importação
    carregar();

    // Mostrar notificação de sucesso
    const message =
      result.failedRows === 0
        ? `Importação concluída com sucesso! ${result.importedRows} registros importados.`
        : `Importação parcial: ${result.importedRows} registros importados, ${result.failedRows} falharam.`;

    // Aqui você pode usar um sistema de notificação se disponível
    console.log(message);
  };

  useEffect(() => {
    if (editando) {
      setValores({
        nome: editando.nome || "",
        estado: editando.estado || "",
        regiao: editando.regiao || "",
        distancia: editando.distancia ? String(editando.distancia) : "",
        pesoMinimo: editando.pesoMinimo ? String(editando.pesoMinimo) : "",
        rotaId: editando.rotaId || "",
        observacao: editando.observacao || "",
      });
    }
  }, [editando, setValores]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as cidades atendidas
          </p>
        </div>

        {/* Botões de ação - Layout responsivo */}
        <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
          <button
            onClick={handleExportClick}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
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
            onClick={() => setShowImportModal(true)}
            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Importar Excel
          </button>
          <button
            onClick={abrirCriacao}
            className="w-full sm:w-auto btn-primary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Cidade
          </button>
        </div>
      </div>

      <CidadesFilters
        termo={termoBusca}
        onChangeTermo={setTermoBusca}
        filtroRegiao={filtroRegiao}
        onChangeFiltroRegiao={setFiltroRegiao}
      />

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
            <div className="flex justify-between flex-1 sm:hidden">
              <button
                onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
                disabled={paginaAtual === 1}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                onClick={() =>
                  setPaginaAtual(
                    Math.min(totalPaginado.totalPaginas, paginaAtual + 1),
                  )
                }
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
                  <span className="font-medium">
                    {totalPaginado.inicio + 1}
                  </span>{" "}
                  a <span className="font-medium">{totalPaginado.fim}</span> de{" "}
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
                    onClick={() => setPaginaAtual(Math.max(1, paginaAtual - 1))}
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
                  {Array.from(
                    { length: totalPaginado.totalPaginas },
                    (_, i) => i + 1,
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPaginaAtual(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        paginaAtual === page
                          ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
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
        )}
      </div>

      <CidadeFormModal
        aberto={mostrarModal}
        editando={editando}
        valores={valores}
        erros={erros}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
        loading={loadingSubmit}
      />

      <ConfirmationModal
        type="danger"
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta cidade?"
        details={
          cidadeParaExcluir
            ? [
                { label: "Cidade", value: cidadeParaExcluir.nome },
                { label: "Estado", value: cidadeParaExcluir.estado },
                { label: "Região", value: cidadeParaExcluir.regiao },
              ]
            : []
        }
        warning="Esta ação não pode ser revertida. Todos os vínculos serão perdidos e será necessário criar uma cidade novamente para ter vínculos novamente."
        primaryAction={{
          label: "Confirmar Exclusão",
          onClick: confirmarExclusao,
          variant: "danger",
          loading: loadingExclusao,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: cancelarExclusao,
        }}
        isOpen={mostrarModalExclusao}
        onClose={cancelarExclusao}
      />

      <TableExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
        titulo="Cidades"
        nomeArquivo={generateFileName()}
        loading={loadingExport}
      />

      <ImportModal
        entityType="cidades"
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default CidadesListPage;
