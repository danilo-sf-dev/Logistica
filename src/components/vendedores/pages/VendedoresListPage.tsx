import React, { useEffect, useState, useRef } from "react";
import { Plus } from "lucide-react";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { TableExportModal } from "../../common/modals";
import { VendedoresTable } from "../ui/VendedoresTable";
import VendedorFormModal from "../ui/VendedorFormModal";
import { VendedoresFilters } from "../ui/VendedoresFilters";
import { useVendedores } from "../state/useVendedores";
import { maskCelular, formatCPF } from "../../../utils/masks";
import { ImportModal } from "../../import";

const VendedoresListPage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const hasLoaded = useRef(false);

  const {
    loading,
    loadingSubmit,
    loadingExport,
    loadingInativacao,
    loadingAtivacao,
    vendedoresPaginados,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    termoBusca,
    setTermoBusca,
    filtroAtivo,
    setFiltroAtivo,
    filtroCidade,
    setFiltroCidade,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    abrirCriacao,
    editarVendedor,
    inativarVendedor,
    confirmarInativacao,
    cancelarInativacao,
    ativarVendedor,
    confirmarAtivacao,
    cancelarAtivacao,
    carregar,
    mostrarModal,
    setMostrarModal,
    mostrarModalInativacao,
    vendedorParaInativar,
    mostrarModalAtivacao,
    vendedorParaAtivar,
    valores,
    setValores,
    erros,
    confirmar,
    editando,
    handleExportExcel,
  } = useVendedores();

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      carregar();
    }
  }, [carregar]);

  // Gerar nome do arquivo para exportação
  const generateFileName = () => {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `vendedores_${dataAtual}`;
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

  const handleImportSuccess = (result: any) => {
    // Recarregar dados da tabela após importação bem-sucedida
    carregar();
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Vendedores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os vendedores da empresa
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
            Novo Vendedor
          </button>
        </div>
      </div>

      <VendedoresFilters
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        filtroCidade={filtroCidade}
        setFiltroCidade={setFiltroCidade}
        filtroStatus={
          filtroAtivo === "todos" ? "todos" : filtroAtivo ? "ativo" : "inativo"
        }
        setFiltroStatus={(value) => {
          if (value === "todos") {
            setFiltroAtivo("todos");
          } else if (value === "ativo") {
            setFiltroAtivo(true);
          } else {
            setFiltroAtivo(false);
          }
        }}
      />

      <div className="card">
        <VendedoresTable
          vendedores={vendedoresPaginados}
          ordenarPor={ordenarPor}
          direcaoOrdenacao={direcaoOrdenacao}
          onOrdenar={alternarOrdenacao}
          onEditar={editarVendedor}
          onInativar={inativarVendedor}
          onAtivar={ativarVendedor}
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

      <VendedorFormModal
        aberto={mostrarModal}
        editando={editando}
        valores={valores}
        erros={erros}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
        somenteLeitura={editando ? !editando.ativo : false}
        loading={loadingSubmit}
      />

      {/* Modal de Confirmação de Inativação */}
      <ConfirmationModal
        type="warning"
        title="Confirmar Inativação"
        message="Tem certeza que deseja inativar este vendedor?"
        details={
          vendedorParaInativar
            ? [
                { label: "Nome", value: vendedorParaInativar.nome },
                {
                  label: "CPF",
                  value: formatCPF(vendedorParaInativar.cpf),
                },
                { label: "Região", value: vendedorParaInativar.regiao },
                {
                  label: "Unidade",
                  value:
                    vendedorParaInativar.unidadeNegocio === "ambos"
                      ? "Ambos"
                      : vendedorParaInativar.unidadeNegocio,
                },
                {
                  label: "Celular",
                  value: maskCelular(vendedorParaInativar.celular),
                },
              ]
            : []
        }
        isOpen={mostrarModalInativacao}
        onClose={cancelarInativacao}
        primaryAction={{
          label: "Confirmar Inativação",
          onClick: confirmarInativacao,
          variant: "warning",
          loading: loadingInativacao,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: cancelarInativacao,
          variant: "secondary",
        }}
      />

      {/* Modal de Confirmação de Ativação */}
      <ConfirmationModal
        type="success"
        title="Ativar Vendedor"
        message="Tem certeza que deseja ativar este vendedor?"
        details={
          vendedorParaAtivar
            ? [
                { label: "Nome", value: vendedorParaAtivar.nome },
                {
                  label: "CPF",
                  value: formatCPF(vendedorParaAtivar.cpf),
                },
                { label: "Região", value: vendedorParaAtivar.regiao },
                {
                  label: "Unidade",
                  value:
                    vendedorParaAtivar.unidadeNegocio === "ambos"
                      ? "Ambos"
                      : vendedorParaAtivar.unidadeNegocio,
                },
                {
                  label: "Celular",
                  value: maskCelular(vendedorParaAtivar.celular),
                },
              ]
            : []
        }
        isOpen={mostrarModalAtivacao}
        onClose={cancelarAtivacao}
        primaryAction={{
          label: "Confirmar Ativação",
          onClick: confirmarAtivacao,
          variant: "success",
          loading: loadingAtivacao,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: cancelarAtivacao,
          variant: "secondary",
        }}
      />

      <TableExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
        titulo="Vendedores"
        nomeArquivo={generateFileName()}
        loading={loadingExport}
      />

      {/* Modal de Importação */}
      <ImportModal
        entityType="vendedores"
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};

export default VendedoresListPage;
