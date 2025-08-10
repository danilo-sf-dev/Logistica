import React, { useEffect } from "react";
import { FuncionariosTable } from "../ui/FuncionariosTable";
import FuncionarioFormModal from "../ui/FuncionarioFormModal";
import ModalConfirmacaoInativacao from "../ui/ModalConfirmacaoInativacao";
import ModalConfirmacaoAtivacao from "../ui/ModalConfirmacaoAtivacao";
import { useFuncionarios } from "../state/useFuncionarios";

const FuncionariosListPage: React.FC = () => {
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
    filtroContrato,
    setFiltroContrato,
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
  } = useFuncionarios();

  useEffect(() => {
    carregar();
  }, [carregar]);

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
        <button onClick={abrirCriacao} className="btn-primary">
          Novo Funcionário
        </button>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nome, CPF, CNH ou cidade..."
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={filtroFuncao}
              onChange={(e) => setFiltroFuncao(e.target.value as any)}
              className="input-field"
            >
              <option value="todos">Todas as funções</option>
              <option value="motorista">Motorista</option>
              <option value="ajudante">Ajudante</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
              className="input-field"
            >
              <option value="todos">Todos os status</option>
              <option value="trabalhando">Trabalhando</option>
              <option value="disponivel">Disponível</option>
              <option value="folga">Folga</option>
              <option value="ferias">Férias</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filtroContrato}
              onChange={(e) => setFiltroContrato(e.target.value as any)}
              className="input-field"
            >
              <option value="todos">Todos os contratos</option>
              <option value="integral">Integral</option>
              <option value="temporario">Temporário</option>
              <option value="folguista">Folguista</option>
              <option value="inativo">Inativo</option>
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
        </div>
      </div>

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
      />

      <ModalConfirmacaoInativacao
        aberto={mostrarModalInativacao}
        funcionario={funcionarioParaInativar}
        onConfirmar={confirmarInativacao}
        onCancelar={cancelarInativacao}
      />

      <ModalConfirmacaoAtivacao
        aberto={mostrarModalAtivacao}
        funcionario={funcionarioParaAtivar}
        onConfirmar={confirmarAtivacao}
        onCancelar={cancelarAtivacao}
      />
    </div>
  );
};

export default FuncionariosListPage;
