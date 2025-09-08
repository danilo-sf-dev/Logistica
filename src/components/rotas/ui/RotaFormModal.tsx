import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
import LoadingButton from "../../common/LoadingButton";
import { Rota, RotaFormData } from "../types";
import { cidadesService } from "../../cidades/data/cidadesService";
import type { Cidade } from "../../cidades/types";
import { REGIOES_BRASIL } from "../../../utils/constants";

interface RotaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RotaFormData) => Promise<boolean>;
  editingRota?: Rota | null;
  erros?: Partial<Record<keyof RotaFormData, string>>;
  loading?: boolean;
}

const DIAS_SEMANA = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

const QUALQUER_DIA = "Qualquer dia da semana";

export const RotaFormModal: React.FC<RotaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRota,
  erros = {},
  loading = false,
}) => {
  const [formData, setFormData] = useState<RotaFormData>({
    nome: "",
    pesoMinimo: 0,
    diaSemana: [],
    cidades: [],
  });

  const [cidadesVinculadas, setCidadesVinculadas] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    if (editingRota) {
      setFormData({
        nome: editingRota.nome,
        pesoMinimo: editingRota.pesoMinimo,
        diaSemana: Array.isArray(editingRota.diaSemana)
          ? [...editingRota.diaSemana]
          : [],
        cidades: [...editingRota.cidades],
      });

      if (editingRota.cidades && editingRota.cidades.length > 0) {
        buscarCidadesVinculadas(editingRota.cidades);
      } else {
        setCidadesVinculadas([]);
      }
    } else {
      resetForm();
      setCidadesVinculadas([]);
    }
  }, [editingRota]);

  const buscarCidadesVinculadas = async (cidadeIds: string[]) => {
    setLoadingCidades(true);
    try {
      const cidades = await Promise.all(
        cidadeIds.map((id) => cidadesService.getById(id)),
      );
      const cidadesValidas = cidades.filter(
        (cidade): cidade is Cidade => cidade !== null,
      );
      setCidadesVinculadas(cidadesValidas);
    } catch (error) {
      console.error("Erro ao buscar cidades vinculadas:", error);
      setCidadesVinculadas([]);
    } finally {
      setLoadingCidades(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      pesoMinimo: 0,
      diaSemana: [],
      cidades: [],
    });
  };

  const handleSubmit = async () => {
    const success = await onSubmit(formData);

    if (success) {
      onClose();
      resetForm();
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const toggleDiaSemana = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diaSemana: prev.diaSemana.includes(dia)
        ? prev.diaSemana.filter((d) => d !== dia)
        : [...prev.diaSemana, dia],
    }));
  };

  const toggleQualquerDia = () => {
    setFormData((prev) => {
      const temQualquerDia = prev.diaSemana.includes(QUALQUER_DIA);

      if (temQualquerDia) {
        // Se "Qualquer dia" está marcado, desmarca e volta aos dias individuais
        return {
          ...prev,
          diaSemana: prev.diaSemana.filter((dia) => dia !== QUALQUER_DIA),
        };
      } else {
        // Se "Qualquer dia" não está marcado, marca e desmarca todos os individuais
        return {
          ...prev,
          diaSemana: [QUALQUER_DIA],
        };
      }
    });
  };

  const isQualquerDiaSelecionado = () => {
    return formData.diaSemana.includes(QUALQUER_DIA);
  };

  const isDiaIndividualSelecionado = (dia: string) => {
    return formData.diaSemana.includes(dia) && !isQualquerDiaSelecionado();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editingRota ? "Editar Rota" : "Nova Rota"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Rota *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${erros.nome ? "border-red-500" : ""}`}
                  placeholder="Ex: Rota Sul"
                />
                {erros.nome && (
                  <p className="text-red-500 text-xs mt-1">{erros.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso Mínimo (kg)
                </label>
                <input
                  type="text"
                  value={
                    formData.pesoMinimo > 0
                      ? formData.pesoMinimo.toString()
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    const peso = value === "" ? 0 : parseFloat(value) || 0;
                    setFormData({ ...formData, pesoMinimo: peso });
                  }}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${erros.pesoMinimo ? "border-red-500" : ""}`}
                  placeholder="0.00"
                />
                {erros.pesoMinimo && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.pesoMinimo}
                  </p>
                )}
              </div>
            </div>

            <div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dias da Semana *
                </label>
                <div className="space-y-2">
                  {/* Checkbox "Qualquer dia da semana" */}
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isQualquerDiaSelecionado()}
                      onChange={toggleQualquerDia}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {QUALQUER_DIA}
                    </span>
                  </label>

                  {/* Separador visual */}
                  <div className="border-t border-gray-200 my-2"></div>

                  {/* Dias individuais */}
                  {DIAS_SEMANA.map((dia) => (
                    <label key={dia} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={isDiaIndividualSelecionado(dia)}
                        onChange={() => {
                          // Se selecionar um dia individual, desmarca "Qualquer dia"
                          if (!isDiaIndividualSelecionado(dia)) {
                            setFormData((prev) => ({
                              ...prev,
                              diaSemana: prev.diaSemana.filter(
                                (d) => d !== QUALQUER_DIA,
                              ),
                            }));
                          }
                          toggleDiaSemana(dia);
                        }}
                        disabled={isQualquerDiaSelecionado()}
                        className={`h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded ${
                          isQualquerDiaSelecionado()
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      />
                      <span
                        className={`ml-2 text-sm text-gray-700 ${
                          isQualquerDiaSelecionado() ? "opacity-50" : ""
                        }`}
                      >
                        {dia}
                      </span>
                    </label>
                  ))}
                </div>
                {erros.diaSemana && (
                  <p className="text-red-500 text-xs mt-1">{erros.diaSemana}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cidades Vinculadas à Rota
              </label>
              <div className="p-3 bg-gray-50 rounded-md border">
                {formData.cidades && formData.cidades.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Eye className="h-4 w-4 mr-2" />
                      Cidades vinculadas: {formData.cidades.length}
                    </div>
                    {loadingCidades ? (
                      <div className="text-center py-2">
                        <p className="text-sm text-gray-500">
                          Carregando cidades...
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {cidadesVinculadas.map((cidade) => {
                          const regiaoNome = cidade.regiao
                            ? REGIOES_BRASIL.find(
                                (r) => r.valor === cidade.regiao,
                              )?.nome
                            : null;

                          return (
                            <span
                              key={cidade.id}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {cidade.nome} - {cidade.estado}
                              {regiaoNome && ` (${regiaoNome})`}
                            </span>
                          );
                        })}
                      </div>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Para vincular cidades a esta rota, vá para a seção de
                      Cidades e selecione esta rota no dropdown.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Eye className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">
                      Nenhuma cidade vinculada
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Para vincular cidades a esta rota, vá para a seção de
                      Cidades e selecione esta rota no dropdown.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <LoadingButton
                onClick={handleSubmit}
                loading={loading}
                variant="primary"
                size="md"
                className="w-full sm:w-auto"
              >
                {editingRota ? "Atualizar" : "Criar"}
              </LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
