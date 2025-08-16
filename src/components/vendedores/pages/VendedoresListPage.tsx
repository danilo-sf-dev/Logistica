import React, { useEffect, useState } from "react";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { TableExportModal } from "../../common/modals";
import { VendedoresTable } from "../ui/VendedoresTable";
import VendedorFormModal from "../ui/VendedorFormModal";
import CidadesFilter from "../ui/CidadesFilter";
import { useVendedores } from "../state/useVendedores";
import { maskCelular, formatCPF } from "../../../utils/masks";

const VendedoresListPage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    loading,
    vendedoresPaginados,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    termoBusca,
    setTermoBusca,
    filtroUnidadeNegocio,
    setFiltroUnidadeNegocio,
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
    confirmar,
    editando,
    handleExportExcel,
  } = useVendedores();

  useEffect(() => {
    carregar();
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

  const handleExportConfirm = () => {
    handleExportExcel();
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Vendedores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os vendedores da empresa
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
          <button onClick={abrirCriacao} className="btn-primary">
            Novo Vendedor
          </button>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome, CPF, email ou região..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filtroUnidadeNegocio}
              onChange={(e) => setFiltroUnidadeNegocio(e.target.value as any)}
              className="input-field"
            >
              <option value="todos">Todas as unidades</option>
              <option value="frigorifico">Frigorífico</option>
              <option value="ovos">Ovos</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>

          <div className="sm:w-48">
            <select
              value={
                filtroAtivo === "todos"
                  ? "todos"
                  : filtroAtivo
                    ? "true"
                    : "false"
              }
              onChange={(e) => {
                const value = e.target.value;
                setFiltroAtivo(value === "todos" ? "todos" : value === "true");
              }}
              className="input-field"
            >
              <option value="todos">Todos os status</option>
              <option value="true">Apenas ativos</option>
              <option value="false">Apenas inativos</option>
            </select>
          </div>

          <div className="sm:w-48">
            <CidadesFilter
              value={filtroCidade}
              onChange={setFiltroCidade}
              placeholder="Filtrar por cidade"
            />
          </div>
        </div>
      </div>

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

      <VendedorFormModal
        aberto={mostrarModal}
        editando={editando}
        valores={valores}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
        somenteLeitura={editando ? !editando.ativo : false}
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
      />
    </div>
  );
};

export default VendedoresListPage;
