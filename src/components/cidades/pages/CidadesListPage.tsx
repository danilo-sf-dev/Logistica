/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
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

  const handleExportConfirm = () => {
    handleExportExcel();
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
        regiao: editando.regiao ? editando.regiao.toLowerCase() : "",
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Cidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as cidades atendidas
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
            onClick={() => setShowImportModal(true)}
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Importar Excel
          </button>
          <button onClick={abrirCriacao} className="btn-primary">
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
                (_, i) => i + 1
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
                    Math.min(totalPaginado.totalPaginas, paginaAtual + 1)
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
        editando={editando}
        valores={valores}
        erros={erros}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
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
