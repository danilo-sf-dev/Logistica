import React, { useEffect, useState } from "react";
import ConfirmationModal from "../../common/modals/ConfirmationModal";
import { FuncionariosTable } from "../ui/FuncionariosTable";
import FuncionarioFormModal from "../ui/FuncionarioFormModal";
import { TableExportModal } from "../../common/modals";
import { useFuncionarios } from "../state/useFuncionarios";

import { FuncionariosFilters } from "../ui/FuncionariosFilters";

import { maskCPF } from "utils/masks";

const FuncionariosListPage: React.FC = () => {
  const [showExportModal, setShowExportModal] = useState(false);

  const {
    loading,
    funcionariosPaginados,
    totalPaginado,
    paginaAtual,
    setPaginaAtual,
    termoBusca,
    setTermoBusca,
    filtroStatus,
    setFiltroStatus,
    filtroFuncao,
    setFiltroFuncao,
    filtroAtivo,
    setFiltroAtivo,
    ordenarPor,
    direcaoOrdenacao,
    alternarOrdenacao,
    abrirCriacao,
    editarFuncionario,
    inativarFuncionario,
    confirmarInativacao,
    cancelarInativacao,
    ativarFuncionario,
    confirmarAtivacao,
    cancelarAtivacao,
    carregar,
    mostrarModal,
    setMostrarModal,
    mostrarModalInativacao,
    funcionarioParaInativar,
    mostrarModalAtivacao,
    funcionarioParaAtivar,
    valores,
    setValores,
    confirmar,
    editando,
    handleExportExcel,
    erros,
  } = useFuncionarios();

  useEffect(() => {
    carregar();
    // Sincronizar status dos funcionários automaticamente ao carregar a página
    const sincronizarStatusAutomaticamente = async () => {
      try {
        const { folgasService } = await import(
          "../../folgas/data/folgasService"
        );
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
    const nomeArquivo = `funcionarios_${dataAtual}`;
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
          <h1 className="text-2xl font-semibold text-gray-900">Funcionários</h1>
          <p className="mt-1 text-sm text-gray-500">Gerencie a equipe</p>
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
            Novo Funcionário
          </button>
        </div>
      </div>

      <FuncionariosFilters
        termoBusca={termoBusca}
        setTermoBusca={setTermoBusca}
        filtroStatus={filtroStatus}
        setFiltroStatus={setFiltroStatus}
        filtroFuncao={filtroFuncao}
        setFiltroFuncao={setFiltroFuncao}
        filtroAtivo={
          filtroAtivo === "todos" ? "todos" : filtroAtivo ? "ativo" : "inativo"
        }
        setFiltroAtivo={(value) => {
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
        <FuncionariosTable
          funcionarios={funcionariosPaginados}
          ordenarPor={ordenarPor}
          direcaoOrdenacao={direcaoOrdenacao}
          onOrdenar={alternarOrdenacao}
          onEditar={editarFuncionario}
          onInativar={inativarFuncionario}
          onAtivar={ativarFuncionario}
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

      <FuncionarioFormModal
        aberto={mostrarModal}
        editando={editando}
        valores={valores}
        onChange={setValores}
        onCancelar={() => setMostrarModal(false)}
        onConfirmar={confirmar}
        somenteLeitura={editando ? !editando.ativo : false}
        erros={erros}
      />

      {/* Modal de Confirmação de Inativação */}
      <ConfirmationModal
        type="warning"
        title="Confirmar Inativação"
        message="Tem certeza que deseja inativar este funcionário?"
        details={
          funcionarioParaInativar
            ? [
                { label: "Nome", value: funcionarioParaInativar.nome },
                {
                  label: "Função",
                  value: funcionarioParaInativar.funcao || "motorista",
                },
                {
                  label: "CPF",
                  value: maskCPF(funcionarioParaInativar.cpf || ""),
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
        title="Ativar Funcionário"
        message="Tem certeza que deseja ativar este funcionário?"
        details={
          funcionarioParaAtivar
            ? [
                { label: "Nome", value: funcionarioParaAtivar.nome },
                {
                  label: "Função",
                  value: funcionarioParaAtivar.funcao || "motorista",
                },
                {
                  label: "CPF",
                  value: maskCPF(funcionarioParaAtivar.cpf || ""),
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
        titulo="Funcionários"
        nomeArquivo={generateFileName()}
      />
    </div>
  );
};

export default FuncionariosListPage;
