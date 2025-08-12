import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { funcionariosService } from "../../funcionarios/data/funcionariosService";
import type { Funcionario } from "../../funcionarios/types";

interface FuncionarioSelectProps {
  value: string;
  onChange: (funcionarioId: string, funcionarioNome: string) => void;
  placeholder?: string;
  error?: string;
}

export function FuncionarioSelect({
  value,
  onChange,
  placeholder = "Selecione um funcionário",
  error,
}: FuncionarioSelectProps) {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] =
    useState<Funcionario | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Carregar funcionários ativos
  useEffect(() => {
    const carregarFuncionarios = async () => {
      try {
        setLoading(true);
        const todosFuncionarios = await funcionariosService.listar();
        const funcionariosAtivos = todosFuncionarios.filter((f) => f.ativo);
        setFuncionarios(funcionariosAtivos);

        // Se já tem um valor selecionado, encontrar o funcionário
        if (value) {
          const funcionario = funcionariosAtivos.find((f) => f.id === value);
          if (funcionario) {
            setSelectedFuncionario(funcionario);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar funcionários:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarFuncionarios();
  }, [value]);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtrar funcionários baseado na pesquisa
  const funcionariosFiltrados = funcionarios.filter(
    (funcionario) =>
      funcionario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      funcionario.cpf.includes(searchTerm),
  );

  const handleSelect = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    onChange(funcionario.id, funcionario.nome);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = () => {
    setSelectedFuncionario(null);
    onChange("", "");
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`input-field cursor-pointer flex items-center justify-between ${
          error ? "border-red-500" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className={selectedFuncionario ? "text-gray-900" : "text-gray-500"}
        >
          {selectedFuncionario ? selectedFuncionario.nome : placeholder}
        </span>
        <div className="flex items-center space-x-2">
          {selectedFuncionario && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Campo de pesquisa */}
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Pesquisar funcionário..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Lista de funcionários */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Carregando funcionários...
              </div>
            ) : funcionariosFiltrados.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm
                  ? "Nenhum funcionário encontrado"
                  : "Nenhum funcionário disponível"}
              </div>
            ) : (
              funcionariosFiltrados.map((funcionario) => (
                <div
                  key={funcionario.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSelect(funcionario)}
                >
                  <div className="font-medium text-gray-900">
                    {funcionario.nome}
                  </div>
                  <div className="text-sm text-gray-500">
                    CPF: {funcionario.cpf} •{" "}
                    {funcionario.funcao || "Sem função"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
