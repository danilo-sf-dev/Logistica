import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useVeiculos } from "../state/useVeiculos";
import { VeiculosTable } from "../ui/VeiculosTable";
import { VeiculosFiltersComponent as VeiculosFilters } from "../ui/VeiculosFilters";
import { VeiculoFormModal } from "../ui/VeiculoFormModal";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { Veiculo, VeiculoFormData } from "../types";

export const VeiculosListPage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState<Veiculo | null>(null);
  const [showAtivacaoModal, setShowAtivacaoModal] = useState(false);
  const [showInativacaoModal, setShowInativacaoModal] = useState(false);
  const [veiculoToToggle, setVeiculoToToggle] = useState<Veiculo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading,
    filters,
    sortConfig,
    createVeiculo,
    updateVeiculo,
    toggleVeiculoStatus,
    checkPlacaExists,
    updateFilters,
    updateSortConfig,
    getFilteredAndSortedVeiculos,
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

  const filteredAndSortedVeiculos = getFilteredAndSortedVeiculos();
  const totalPages = Math.ceil(filteredAndSortedVeiculos.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Veículos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie a frota de veículos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </button>
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
          <div className="flex items-center text-sm text-gray-700">
            <span>
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(
                currentPage * itemsPerPage,
                filteredAndSortedVeiculos.length,
              )}{" "}
              de {filteredAndSortedVeiculos.length} resultados
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm border rounded-md ${
                  currentPage === page
                    ? "bg-primary-600 text-white border-primary-600"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próximo
            </button>
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
          disabled: loading,
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
          disabled: loading,
        }}
        secondaryAction={{
          label: "Cancelar",
          onClick: () => setShowInativacaoModal(false),
          variant: "secondary",
        }}
      />
    </div>
  );
};
