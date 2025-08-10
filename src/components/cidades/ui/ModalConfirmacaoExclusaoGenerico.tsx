import React from "react";
import ConfirmationModal from "components/common/modals/ConfirmationModal";
import type { Cidade } from "../types";

interface Props {
  aberto: boolean;
  cidade: Cidade | null;
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacaoExclusaoGenerico: React.FC<Props> = ({
  aberto,
  cidade,
  onConfirmar,
  onCancelar,
}) => {
  if (!cidade) return null;

  return (
    <ConfirmationModal
      type="danger"
      title="Confirmar Exclusão"
      message="Tem certeza que deseja excluir esta cidade?"
      details={[
        { label: "Cidade", value: cidade.nome },
        { label: "Estado", value: cidade.estado },
        { label: "Região", value: cidade.regiao },
      ]}
      warning="Esta ação não pode ser revertida. Todos os vínculos serão perdidos e será necessário criar uma cidade novamente para ter vínculos novamente."
      primaryAction={{
        label: "Confirmar Exclusão",
        onClick: onConfirmar,
        variant: "danger",
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
