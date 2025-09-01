import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useVeiculos } from "../state/useVeiculos";
import { VeiculosTable } from "../ui/VeiculosTable";
import { VeiculosFiltersComponent as VeiculosFilters } from "../ui/VeiculosFilters";
import { VeiculoFormModal } from "../ui/VeiculoFormModal";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { TableExportModal } from "../../common/modals";
import { ImportModal } from "../../import";
import { Veiculo, VeiculoFormData } from "../types";

export const VeiculosListPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  const [showAtivacaoModal, setShowAtivacaoModal] = useState(false);
  const [showInativacaoModal, setShowInativacaoModal] = useState(false);
  const [veiculoToToggle, setVeiculoToToggle] = useState<Veiculo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  const {
    loading,
    loadingSubmit,
    loadingExport,
    loadingToggleStatus,
    filters,
    sortConfig,
    createVeiculo,
    updateVeiculo,
    toggleVeiculoStatus,
    checkPlacaExists,
    updateFilters,
    updateSortConfig,
    getFilteredAndSortedVeiculos,
    handleExportExcel,
    fetchVeiculos,
    erros,
  } = useVeiculos();

  const itemsPerPage = 15;

  const handleCreateVeiculo = async (data: VeiculoFormData) => {
    const success = await createVeiculo(data);
    if (success) {
      setCurrentPage(1);
    }
    return success;
  };

  const handleUpdateVeiculo = async (data: VeiculoFormData) => {
    if (!editingVeiculo) return false;
    const success = await updateVeiculo(editingVeiculo.id, data);
    if (success) {
      setEditingVeiculo(null);
    }
    return success;
  };

  const handleEdit = (veiculo: Veiculo) => {
    setEditingVeiculo(veiculo);
    setShowModal(true);
  };

  const handleToggleStatus = (veiculo: Veiculo) => {
    setVeiculoToToggle(veiculo);
    if (veiculo.status === "inativo") {
      setShowAtivacaoModal(true);
    } else {
      setShowInativacaoModal(true);
    }
  };

  const confirmToggleStatus = async () => {
    if (veiculoToToggle) {
      const novoStatus =
        veiculoToToggle.status === "inativo" ? "disponivel" : "inativo";
      await toggleVeiculoStatus(veiculoToToggle.id, novoStatus);

      setShowAtivacaoModal(false);
      setShowInativacaoModal(false);
      setVeiculoToToggle(null);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingVeiculo(null);
  };

  const handleSubmit = async (data: VeiculoFormData) => {
    if (editingVeiculo) {
      return await handleUpdateVeiculo(data);
    } else {
      return await handleCreateVeiculo(data);
    }
  };

  // Gerar nome do arquivo para exportação
  const generateFileName = () => {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `veiculos_${dataAtual}`;
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

  const handleImportSuccess = () => {
    setShowImportModal(false);
    // Recarregar dados após importação
    fetchVeiculos();
  };

  const filteredAndSortedVeiculos = getFilteredAndSortedVeiculos();
  const totalPages = Math.ceil(filteredAndSortedVeiculos.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Veículos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie a frota de veículos
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
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto btn-primary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Veículo
          </button>
        </div>
      </div>

      {/* Filtros */}
      <VeiculosFilters filters={filters} onFiltersChange={updateFilters} />

      {/* Tabela */}
      <VeiculosTable
        veiculos={filteredAndSortedVeiculos}
        loading={loading}
        sortConfig={sortConfig}
        onSort={updateSortConfig}
        onEdit={handleEdit}
        onToggleStatus={handleToggleStatus}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg">
          <div className="flex justify-between flex-1 sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
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
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(
                    currentPage * itemsPerPage,
                    filteredAndSortedVeiculos.length,
                  )}
                </span>{" "}
                de{" "}
                <span className="font-medium">
                  {filteredAndSortedVeiculos.length}
                </span>{" "}
                resultados
              </p>
            </div>
            <div>
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-primary-50 border-primary-500 text-primary-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
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

      {/* Modal de Formulário */}
      <VeiculoFormModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={handleSubmit}
        editingVeiculo={editingVeiculo}
        checkPlacaExists={checkPlacaExists}
        somenteLeitura={
          editingVeiculo ? editingVeiculo.status === "inativo" : false
        }
        erros={erros}
        loading={loadingSubmit}
      />

      {/* Modal de Confirmação de Ativação */}
      <ConfirmationModal
        type="success"
        title="Ativar Veículo"
        message={`Tem certeza que deseja ativar o veículo ${veiculoToToggle?.placa}?`}
        warning="Este veículo voltará a estar disponível para uso."
        isOpen={showAtivacaoModal}
        onClose={() => setShowAtivacaoModal(false)}
        primaryAction={{
          label: "Sim, Ativar",
          onClick: confirmToggleStatus,
          variant: "success",
          loading: loadingToggleStatus,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: () => setShowAtivacaoModal(false),
          variant: "secondary",
        }}
      />

      {/* Modal de Confirmação de Inativação */}
      <ConfirmationModal
        type="warning"
        title="Inativar Veículo"
        message={`Tem certeza que deseja inativar o veículo ${veiculoToToggle?.placa}?`}
        warning="Este veículo não estará mais disponível para uso até ser reativado."
        isOpen={showInativacaoModal}
        onClose={() => setShowInativacaoModal(false)}
        primaryAction={{
          label: "Sim, Inativar",
          onClick: confirmToggleStatus,
          variant: "warning",
          loading: loadingToggleStatus,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: () => setShowInativacaoModal(false),
          variant: "secondary",
        }}
      />

      <TableExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
        titulo="Veículos"
        nomeArquivo={generateFileName()}
        loading={loadingExport}
      />

      <ImportModal
        entityType="veiculos"
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={handleImportSuccess}
      />
    </div>
  );
};
