import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Veiculo, VeiculoFormData } from "../types";
import type {
  StatusVeiculo,
  UnidadeNegocio,
  TipoCarroceria,
} from "../../../types";
import { maskPlaca } from "../../../utils/masks";

interface VeiculoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: VeiculoFormData) => Promise<boolean>;
  editingVeiculo?: Veiculo | null;
  checkPlacaExists: (placa: string, excludeId?: string) => Promise<boolean>;
  somenteLeitura?: boolean;
  erros?: Partial<Record<keyof VeiculoFormData, string>>;
}

export const VeiculoFormModal: React.FC<VeiculoFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingVeiculo,
  checkPlacaExists,
  somenteLeitura = false,
  erros = {},
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
  };

  const handleSubmit = async () => {
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-2rem)]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg sm:text-xl font-medium text-gray-900">
              {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
              {somenteLeitura && editingVeiculo && (
                <span className="ml-3 text-sm text-gray-500 font-normal">
                  (Somente leitura - veículo inativo)
                </span>
              )}
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
                  Placa <span className="text-black">*</span>
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
                  className={`input-field ${erros.placa ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="ABC1234"
                  maxLength={7}
                  disabled={somenteLeitura}
                />
                {erros.placa && (
                  <p className="text-red-500 text-xs mt-1">{erros.placa}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano <span className="text-black">*</span>
                </label>
                <input
                  type="text"
                  value={formData.ano}
                  onChange={(e) =>
                    setFormData({ ...formData, ano: e.target.value })
                  }
                  className={`input-field ${erros.ano ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="2024"
                  disabled={somenteLeitura}
                />
                {erros.ano && (
                  <p className="text-red-500 text-xs mt-1">{erros.ano}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marca <span className="text-black">*</span>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo <span className="text-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData({ ...formData, modelo: e.target.value })
                  }
                  className={`input-field ${erros.modelo ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  disabled={somenteLeitura}
                />
                {erros.modelo && (
                  <p className="text-red-500 text-xs mt-1">{erros.modelo}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade (kg) <span className="text-black">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.capacidade}
                  onChange={(e) =>
                    setFormData({ ...formData, capacidade: e.target.value })
                  }
                  className={`input-field ${erros.capacidade ? "border-red-500" : ""} ${
                    somenteLeitura ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="5000"
                  disabled={somenteLeitura}
                />
                {erros.capacidade && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.capacidade}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as StatusVeiculo,
                    })
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Carroceria *
                </label>
                <select
                  value={formData.tipoCarroceria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipoCarroceria: e.target.value as TipoCarroceria,
                    })
                  }
                  className={`input-field ${erros.tipoCarroceria ? "border-red-500" : ""} ${
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
                {erros.tipoCarroceria && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.tipoCarroceria}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Eixos <span className="text-black">*</span>
                </label>
                <select
                  value={formData.quantidadeEixos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantidadeEixos: e.target.value,
                    })
                  }
                  className={`input-field ${erros.quantidadeEixos ? "border-red-500" : ""} ${
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
                {erros.quantidadeEixos && (
                  <p className="text-red-500 text-xs mt-1">
                    {erros.quantidadeEixos}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Baú <span className="text-black">*</span>
                </label>
                <select
                  value={formData.tipoBau}
                  onChange={(e) =>
                    setFormData({ ...formData, tipoBau: e.target.value })
                  }
                  className={`input-field ${erros.tipoBau ? "border-red-500" : ""} ${
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
                {erros.tipoBau && (
                  <p className="text-red-500 text-xs mt-1">{erros.tipoBau}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidade de Negócio
              </label>
              <select
                value={formData.unidadeNegocio}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    unidadeNegocio: e.target.value as UnidadeNegocio,
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
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

            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 pb-2 border-t">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto btn-secondary py-3 sm:py-2"
                disabled={isSubmitting}
              >
                {somenteLeitura ? "Fechar" : "Cancelar"}
              </button>
              {!somenteLeitura && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full sm:w-auto btn-primary py-3 sm:py-2"
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
          </div>
        </div>
      </div>
    </div>
  );
};
