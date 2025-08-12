import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Veiculo, VeiculoFormData } from "../types";
import {
  maskPlaca,
  validatePlaca,
  validateCapacidade,
} from "../../../utils/masks";

interface VeiculoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VeiculoFormData) => Promise<boolean>;
  editingVeiculo?: Veiculo | null;
  checkPlacaExists: (placa: string, excludeId?: string) => Promise<boolean>;
  somenteLeitura?: boolean;
}

export const VeiculoFormModal: React.FC<VeiculoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingVeiculo,
  checkPlacaExists,
  somenteLeitura = false,
}) => {
  const [formData, setFormData] = useState<VeiculoFormData>({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    capacidade: "",
    tipoCarroceria: "truck",
    quantidadeEixos: "2",
    tipoBau: "frigorifico",
    status: "disponivel",
    unidadeNegocio: "frigorifico",
    ultimaManutencao: "",
    proximaManutencao: "",
    motorista: "",
    observacao: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof VeiculoFormData, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingVeiculo) {
      setFormData({
        placa: editingVeiculo.placa || "",
        modelo: editingVeiculo.modelo || "",
        marca: editingVeiculo.marca || "",
        ano: editingVeiculo.ano || "",
        capacidade: editingVeiculo.capacidade || "",
        tipoCarroceria: editingVeiculo.tipoCarroceria || "truck",
        quantidadeEixos: editingVeiculo.quantidadeEixos || "2",
        tipoBau: editingVeiculo.tipoBau || "frigorifico",
        status: editingVeiculo.status || "disponivel",
        unidadeNegocio: editingVeiculo.unidadeNegocio || "frigorifico",
        ultimaManutencao: editingVeiculo.ultimaManutencao || "",
        proximaManutencao: editingVeiculo.proximaManutencao || "",
        motorista: editingVeiculo.motorista || "",
        observacao: editingVeiculo.observacao || "",
      });
    } else {
      resetForm();
    }
  }, [editingVeiculo]);

  const resetForm = () => {
    setFormData({
      placa: "",
      modelo: "",
      marca: "",
      ano: "",
      capacidade: "",
      tipoCarroceria: "truck",
      quantidadeEixos: "2",
      tipoBau: "frigorifico",
      status: "disponivel",
      unidadeNegocio: "frigorifico",
      ultimaManutencao: "",
      proximaManutencao: "",
      motorista: "",
      observacao: "",
    });
    setErrors({});
  };

  const validateForm = async (): Promise<boolean> => {
    const newErrors: Partial<Record<keyof VeiculoFormData, string>> = {};

    // Validações obrigatórias
    if (!formData.placa.trim()) newErrors.placa = "Placa é obrigatória";
    if (!formData.capacidade.trim())
      newErrors.capacidade = "Capacidade é obrigatória";
    if (!formData.tipoCarroceria)
      newErrors.tipoCarroceria = "Tipo de carroceria é obrigatório";
    if (!formData.tipoBau) newErrors.tipoBau = "Tipo de baú é obrigatório";

    // Validações específicas
    if (formData.placa && !validatePlaca(formData.placa)) {
      newErrors.placa = "Placa inválida (formato: LWB9390 ou LWB9R90)";
    }
    if (formData.capacidade && !validateCapacidade(formData.capacidade)) {
      newErrors.capacidade = "Capacidade deve ser um número maior que zero";
    }
    if (formData.ano) {
      const anoAtual = new Date().getFullYear();
      const anoVeiculo = parseInt(formData.ano);
      if (anoVeiculo < 1900 || anoVeiculo > anoAtual + 1) {
        newErrors.ano = `Ano deve estar entre 1900 e ${anoAtual + 1}`;
      }
    }

    // Validação de placa duplicada
    if (formData.placa && !newErrors.placa) {
      const placaExists = await checkPlacaExists(
        formData.placa,
        editingVeiculo?.id
      );
      if (placaExists) {
        newErrors.placa = "Placa já cadastrada para outro veículo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(await validateForm())) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(formData);
      if (success) {
        onClose();
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
            {somenteLeitura && editingVeiculo && (
              <span className="ml-3 text-sm text-gray-500 font-normal">
                (Somente leitura - veículo inativo)
              </span>
            )}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Placa *
              </label>
              <input
                type="text"
                required
                value={formData.placa}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    placa: maskPlaca(e.target.value),
                  })
                }
                className={`input-field ${errors.placa ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="ABC1234"
                maxLength={7}
                disabled={somenteLeitura}
              />
              {errors.placa && (
                <p className="text-red-500 text-xs mt-1">{errors.placa}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ano
              </label>
              <input
                type="text"
                value={formData.ano}
                onChange={(e) =>
                  setFormData({ ...formData, ano: e.target.value })
                }
                className={`input-field ${errors.ano ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="2024"
                disabled={somenteLeitura}
              />
              {errors.ano && (
                <p className="text-red-500 text-xs mt-1">{errors.ano}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marca
              </label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) =>
                  setFormData({ ...formData, marca: e.target.value })
                }
                className={`input-field ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Modelo *
              </label>
              <input
                type="text"
                required
                value={formData.modelo}
                onChange={(e) =>
                  setFormData({ ...formData, modelo: e.target.value })
                }
                className={`input-field ${errors.modelo ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              />
              {errors.modelo && (
                <p className="text-red-500 text-xs mt-1">{errors.modelo}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacidade (kg) *
              </label>
              <input
                type="text"
                required
                value={formData.capacidade}
                onChange={(e) =>
                  setFormData({ ...formData, capacidade: e.target.value })
                }
                className={`input-field ${errors.capacidade ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                placeholder="5000"
                disabled={somenteLeitura}
              />
              {errors.capacidade && (
                <p className="text-red-500 text-xs mt-1">{errors.capacidade}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={`input-field ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              >
                <option value="disponivel">Disponível</option>
                <option value="em_uso">Em Uso</option>
                <option value="manutencao">Manutenção</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Carroceria *
              </label>
              <select
                value={formData.tipoCarroceria}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tipoCarroceria: e.target.value,
                  })
                }
                className={`input-field ${errors.tipoCarroceria ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              >
                <option value="truck">Truck</option>
                <option value="toco">Toco</option>
                <option value="bitruck">Bitruck</option>
                <option value="carreta">Carreta</option>
                <option value="carreta_ls">Carreta LS</option>
                <option value="carreta_3_eixos">Carreta 3 Eixos</option>
                <option value="truck_3_eixos">Truck 3 Eixos</option>
                <option value="truck_4_eixos">Truck 4 Eixos</option>
              </select>
              {errors.tipoCarroceria && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.tipoCarroceria}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Quantidade de Eixos
              </label>
              <select
                value={formData.quantidadeEixos}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantidadeEixos: e.target.value,
                  })
                }
                className={`input-field ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              >
                <option value="2">2 Eixos</option>
                <option value="3">3 Eixos</option>
                <option value="4">4 Eixos</option>
                <option value="5">5 Eixos</option>
                <option value="6">6 Eixos</option>
                <option value="7">7 Eixos</option>
                <option value="8">8 Eixos</option>
                <option value="9">9 Eixos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Baú *
              </label>
              <select
                value={formData.tipoBau}
                onChange={(e) =>
                  setFormData({ ...formData, tipoBau: e.target.value })
                }
                className={`input-field ${errors.tipoBau ? "border-red-500" : ""} ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              >
                <option value="frigorifico">Frigorífico</option>
                <option value="carga_seca">Carga Seca</option>
                <option value="baucher">Baucher</option>
                <option value="graneleiro">Graneleiro</option>
                <option value="tanque">Tanque</option>
                <option value="caçamba">Caçamba</option>
                <option value="plataforma">Plataforma</option>
              </select>
              {errors.tipoBau && (
                <p className="text-red-500 text-xs mt-1">{errors.tipoBau}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Unidade de Negócio
            </label>
            <select
              value={formData.unidadeNegocio}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unidadeNegocio: e.target.value,
                })
              }
              className={`input-field ${
                somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={somenteLeitura}
            >
              <option value="frigorifico">Frigorífico</option>
              <option value="ovos">Ovos</option>
              <option value="ambos">Ambos</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Última Manutenção
              </label>
              <input
                type="date"
                value={formData.ultimaManutencao}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    ultimaManutencao: e.target.value,
                  })
                }
                className={`input-field ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Próxima Manutenção
              </label>
              <input
                type="date"
                value={formData.proximaManutencao}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    proximaManutencao: e.target.value,
                  })
                }
                className={`input-field ${
                  somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={somenteLeitura}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Observação
            </label>
            <textarea
              value={formData.observacao}
              onChange={(e) =>
                setFormData({ ...formData, observacao: e.target.value })
              }
              className={`input-field ${
                somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              rows={3}
              placeholder="Observações adicionais..."
              disabled={somenteLeitura}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              {somenteLeitura ? "Fechar" : "Cancelar"}
            </button>
            {!somenteLeitura && (
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : editingVeiculo
                    ? "Atualizar"
                    : "Cadastrar"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
