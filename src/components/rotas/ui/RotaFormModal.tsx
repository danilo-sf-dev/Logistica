import React, { useState, useEffect } from "react";
import { X, Eye } from "lucide-react";
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

export const RotaFormModal: React.FC<RotaFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingRota,
  erros = {},
}) => {
  const [formData, setFormData] = useState<RotaFormData>({
    nome: "",
    dataRota: "",
    pesoMinimo: 0,
    diaSemana: [], // Mudado para array
    cidades: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cidadesVinculadas, setCidadesVinculadas] = useState<Cidade[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  useEffect(() => {
    if (editingRota) {
      setFormData({
        nome: editingRota.nome,
        dataRota: editingRota.dataRota,
        pesoMinimo: editingRota.pesoMinimo,
        diaSemana: Array.isArray(editingRota.diaSemana)
          ? [...editingRota.diaSemana]
          : [], // Garantir que seja array
        cidades: [...editingRota.cidades],
      });

      // Buscar dados das cidades vinculadas
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
      dataRota: "",
      pesoMinimo: 0,
      diaSemana: [], // Mudado para array
      cidades: [],
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const success = await onSubmit(formData);

    if (success) {
      onClose();
      resetForm();
    }

    setIsSubmitting(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingRota ? "Editar Rota" : "Nova Rota"}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data da Rota *
              </label>
              <input
                type="date"
                required
                value={formData.dataRota}
                onChange={(e) =>
                  setFormData({ ...formData, dataRota: e.target.value })
                }
                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${erros.dataRota ? "border-red-500" : ""}`}
              />
              {erros.dataRota && (
                <p className="text-red-500 text-xs mt-1">{erros.dataRota}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso Mínimo (kg)
              </label>
              <input
                type="text"
                value={
                  formData.pesoMinimo > 0 ? formData.pesoMinimo.toString() : ""
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
                <p className="text-red-500 text-xs mt-1">{erros.pesoMinimo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dias da Semana *
              </label>
              <div className="space-y-2">
                {DIAS_SEMANA.map((dia) => (
                  <label key={dia} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.diaSemana.includes(dia)}
                      onChange={() => toggleDiaSemana(dia)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{dia}</span>
                  </label>
                ))}
              </div>
              {erros.diaSemana && (
                <p className="text-red-500 text-xs mt-1">{erros.diaSemana}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
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

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Salvando..."
                : editingRota
                  ? "Atualizar"
                  : "Criar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
