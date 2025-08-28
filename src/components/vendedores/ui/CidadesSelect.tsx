import React, { useEffect, useState, useRef } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cidadesService } from "../../cidades/data/cidadesService";
import type { Cidade } from "../../cidades/types";
import { REGIOES_BRASIL } from "../../../utils/constants";

interface CidadesSelectProps {
  value: string[];
  onChange: (cidadesIds: string[]) => void;
  disabled?: boolean;
  placeholder?: string;
}

const CidadesSelect: React.FC<CidadesSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Selecione as cidades",
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
      cidade.estado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cidade.regiao &&
        cidade.regiao.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const cidadesSelecionadas = cidades.filter((cidade) =>
    value.includes(cidade.id),
  );

  const toggleCidade = (cidadeId: string) => {
    if (disabled) return;

    const newValue = value.includes(cidadeId)
      ? value.filter((id) => id !== cidadeId)
      : [...value, cidadeId];
    onChange(newValue);
  };

  const removeCidade = (cidadeId: string) => {
    if (disabled) return;
    onChange(value.filter((id) => id !== cidadeId));
  };

  const clearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cidades Atendidas
      </label>

      {/* Campo principal */}
      <div className="relative">
        <div
          className={`min-h-[42px] border rounded-md p-2 cursor-pointer ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white hover:border-gray-400"
          } ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : "border-gray-300"}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {cidadesSelecionadas.length > 0 ? (
              cidadesSelecionadas.map((cidade) => {
                const regiaoNome = cidade.regiao
                  ? REGIOES_BRASIL.find((r) => r.valor === cidade.regiao)?.nome
                  : null;

                return (
                  <span
                    key={cidade.id}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {cidade.nome} - {cidade.estado}
                    {regiaoNome && ` (${regiaoNome})`}
                    {!disabled && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCidade(cidade.id);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                );
              })
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
          </div>

          {!disabled && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              {value.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearAll();
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
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && !disabled && (
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
              cidadesFiltradas.map((cidade) => {
                const isSelected = value.includes(cidade.id);
                const regiaoNome = cidade.regiao
                  ? REGIOES_BRASIL.find((r) => r.valor === cidade.regiao)?.nome
                  : null;

                return (
                  <div
                    key={cidade.id}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 ${
                      isSelected ? "bg-blue-50" : ""
                    }`}
                    onClick={() => toggleCidade(cidade.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium">{cidade.nome}</div>
                      <div className="text-sm text-gray-500">
                        {cidade.estado}
                        {regiaoNome && ` - ${regiaoNome}`}
                      </div>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-blue-600" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Contador */}
          {value.length > 0 && (
            <div className="p-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-600">
              {value.length} cidade{value.length !== 1 ? "s" : ""} selecionada
              {value.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CidadesSelect;
