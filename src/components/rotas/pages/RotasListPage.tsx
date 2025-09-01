import React, { useState } from "react";
import { Plus, Map } from "lucide-react";
import { useRotas } from "../state/useRotas";
import { RotaFormModal } from "../ui/RotaFormModal";
import { RotasFilters } from "../ui/RotasFilters";
import { RotasTable } from "../ui/RotasTable";
import ModalConfirmacaoExclusaoGenerico from "../ui/ModalConfirmacaoExclusaoGenerico";
import { TableExportModal } from "../../common/modals";
import { Rota } from "../types";

export const RotasListPage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    rotas,
    loading,
    loadingSubmit,
    loadingExport,
    loadingExclusao,
    filters,
    sortConfig,
    filteredRotas,
    createRota,
    updateRota,
    deleteRota,
    updateFilters,
    handleSort,
    handleExportExcel,
    erros,
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

  // Gerar nome do arquivo para exportação
  const generateFileName = () => {
    const dataAtual = new Date()
      .toLocaleDateString("pt-BR")
      .replace(/\//g, "-");
    const nomeArquivo = `rotas_${dataAtual}`;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Rotas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as rotas de transporte da empresa
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
            onClick={() => setShowModal(true)}
            className="w-full sm:w-auto btn-primary flex items-center justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nova Rota
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
        sortConfig={sortConfig}
        onSort={handleSort}
      />

      {/* Modal de Formulário */}
      <RotaFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={editingRota ? handleUpdateRota : handleCreateRota}
        editingRota={editingRota}
        erros={erros}
        loading={loadingSubmit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmacaoExclusaoGenerico
        aberto={showDeleteModal}
        rota={rotaToDelete}
        onConfirmar={confirmDelete}
        onCancelar={handleCloseDeleteModal}
        loading={loadingExclusao}
      />

      <TableExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        onExport={handleExportConfirm}
        titulo="Rotas"
        nomeArquivo={generateFileName()}
        loading={loadingExport}
      />
    </div>
  );
};
