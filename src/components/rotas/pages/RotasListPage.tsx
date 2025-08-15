import React, { useState } from "react";
import { Plus, Map } from "lucide-react";
import { useRotas } from "../state/useRotas";
import { RotaFormModal } from "../ui/RotaFormModal";
import { RotasFilters } from "../ui/RotasFilters";
import { RotasTable } from "../ui/RotasTable";
import ModalConfirmacaoExclusaoGenerico from "../ui/ModalConfirmacaoExclusaoGenerico";
import { Rota } from "../types";

export const RotasListPage: React.FC = () => {
  const {
    rotas,
    loading,
    filters,
    filteredRotas,
    createRota,
    updateRota,
    deleteRota,
    updateFilters,
  } = useRotas();

  const [showModal, setShowModal] = useState(false);
  const [editingRota, setEditingRota] = useState<Rota | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rotaToDelete, setRotaToDelete] = useState<Rota | null>(null);

  const handleCreateRota = async (data: any) => {
    const success = await createRota(data);
    if (success) {
      setShowModal(false);
    }
    return success;
  };

  const handleUpdateRota = async (data: any) => {
    if (!editingRota) return false;

    const success = await updateRota(editingRota.id, data);
    if (success) {
      setShowModal(false);
      setEditingRota(null);
    }
    return success;
  };

  const handleEdit = (rota: Rota) => {
    setEditingRota(rota);
    setShowModal(true);
  };

  const handleDelete = (rota: Rota) => {
    setRotaToDelete(rota);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!rotaToDelete) return;

    const success = await deleteRota(rotaToDelete.id);

    if (success) {
      setShowDeleteModal(false);
      setRotaToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRota(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setRotaToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rotas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as rotas de transporte da empresa
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Rota
        </button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                <Map className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Total de Rotas
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {rotas?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Map className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Com Cidades</p>
              <p className="text-2xl font-semibold text-gray-900">
                {rotas?.filter((r) => r.cidades?.length > 0).length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-8 w-8">
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Map className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Com Peso Mínimo
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {rotas?.filter((r) => r.pesoMinimo > 0).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <RotasFilters filters={filters} onFiltersChange={updateFilters} />

      {/* Tabela */}
      <RotasTable
        rotas={filteredRotas || []}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* Modal de Formulário */}
      <RotaFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={editingRota ? handleUpdateRota : handleCreateRota}
        editingRota={editingRota}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmacaoExclusaoGenerico
        aberto={showDeleteModal}
        rota={rotaToDelete}
        onConfirmar={confirmDelete}
        onCancelar={handleCloseDeleteModal}
      />
    </div>
  );
};
