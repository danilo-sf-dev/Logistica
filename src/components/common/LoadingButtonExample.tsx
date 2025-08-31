import React, { useState } from "react";
import LoadingButton from "./LoadingButton";

// Exemplo de uso do LoadingButton
export const LoadingButtonExample: React.FC = () => {
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const handleSave = async () => {
    setLoading1(true);
    // Simular chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading1(false);
  };

  const handleExport = async () => {
    setLoading2(true);
    // Simular exportação
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setLoading2(false);
  };

  const handleDelete = async () => {
    setLoading3(true);
    // Simular exclusão
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading3(false);
  };

  return (
    <div className="space-y-4">
      {/* Botão Primary */}
      <LoadingButton
        loading={loading1}
        onClick={handleSave}
        variant="primary"
        size="md"
      >
        Salvar
      </LoadingButton>

      {/* Botão Secondary */}
      <LoadingButton
        loading={loading2}
        onClick={handleExport}
        variant="secondary"
        size="lg"
      >
        Exportar Excel
      </LoadingButton>

      {/* Botão Danger */}
      <LoadingButton
        loading={loading3}
        onClick={handleDelete}
        variant="danger"
        size="sm"
      >
        Excluir
      </LoadingButton>

      {/* Botão Success */}
      <LoadingButton variant="success" size="md">
        Aprovar
      </LoadingButton>
    </div>
  );
};

export default LoadingButtonExample;
