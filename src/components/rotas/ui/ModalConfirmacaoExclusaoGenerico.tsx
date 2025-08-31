import React from "react";
import ConfirmationModal from "components/common/modals/ConfirmationModal";
import type { Rota } from "../types";

interface Props {
  aberto: boolean;
  rota: Rota | null;
  onConfirmar: () => void;
  onCancelar: () => void;
  loading?: boolean;
}

const ModalConfirmacaoExclusaoGenerico: React.FC<Props> = ({
  aberto,
  rota,
  onConfirmar,
  onCancelar,
  loading = false,
}) => {
  if (!rota) return null;

  return (
    <ConfirmationModal
      type="danger"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta rota?"
      details={[
        { label: "Rota", value: rota.nome },
        {
          label: "Data",
          value: new Date(rota.dataRota).toLocaleDateString("pt-BR"),
        },
        {
          label: "Dias da Semana",
          value: Array.isArray(rota.diaSemana)
            ? rota.diaSemana.join(", ")
            : rota.diaSemana || "Não definido",
        },
        {
          label: "Peso Mínimo",
          value: rota.pesoMinimo > 0 ? `${rota.pesoMinimo} kg` : "Não definido",
        },
        {
          label: "Cidades Vinculadas",
          value:
            rota.cidades && rota.cidades.length > 0
              ? `${rota.cidades.length} cidade(s)`
              : "0 cidades",
        },
      ]}
      warning="Esta ação não pode ser revertida. Todos os vínculos com cidades serão perdidos e será necessário criar uma rota novamente para ter vínculos novamente."
      primaryAction={{
        label: "Confirmar Exclusão",
        onClick: onConfirmar,
        variant: "danger",
        loading: loading,
      }}
      secondaryAction={{
        label: "Cancelar",
        onClick: onCancelar,
      }}
      isOpen={aberto}
      onClose={onCancelar}
    />
  );
};

export default ModalConfirmacaoExclusaoGenerico;
