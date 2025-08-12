import React, { useEffect, useState, useRef } from "react";
import { ChevronDown, X } from "lucide-react";
import { cidadesService } from "../../cidades/data/cidadesService";
import type { Cidade } from "../../cidades/types";

interface CidadesFilterProps {
  value: string;
  onChange: (cidadeId: string) => void;
  placeholder?: string;
}

const CidadesFilter: React.FC<CidadesFilterProps> = ({
  value,
  onChange,
  placeholder = "Filtrar por cidade",
}) => {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carregarCidades = async () => {
      try {
        setLoading(true);
        const dados = await cidadesService.listar();
        setCidades(dados);
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarCidades();
  }, []);

  // Fechar dropdown quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const cidadesFiltradas = cidades.filter(
    (cidade) =>
      cidade.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cidade.estado.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const cidadeSelecionada = cidades.find((cidade) => cidade.id === value);

  const handleSelectCidade = (cidadeId: string) => {
    onChange(cidadeId);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearFilter = () => {
    onChange("");
    setSearchTerm("");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`min-h-[42px] border rounded-md p-2 cursor-pointer ${
          isOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"
        } hover:border-gray-400 bg-white`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <span
            className={cidadeSelecionada ? "text-gray-900" : "text-gray-500"}
          >
            {cidadeSelecionada
              ? `${cidadeSelecionada.nome} - ${cidadeSelecionada.estado}`
              : placeholder}
          </span>
          <div className="flex items-center gap-1">
            {value && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearFilter();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Campo de busca */}
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              placeholder="Buscar cidades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Lista de cidades */}
          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Carregando cidades...
              </div>
            ) : cidadesFiltradas.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma cidade encontrada
              </div>
            ) : (
              <>
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-gray-50 text-sm text-gray-600"
                  onClick={() => handleSelectCidade("")}
                >
                  Todas as cidades
                </div>
                {cidadesFiltradas.map((cidade) => (
                  <div
                    key={cidade.id}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSelectCidade(cidade.id)}
                  >
                    <div className="font-medium">{cidade.nome}</div>
                    <div className="text-sm text-gray-500">{cidade.estado}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CidadesFilter;
