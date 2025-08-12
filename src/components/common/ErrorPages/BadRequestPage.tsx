import React from "react";
import { AlertTriangle } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const BadRequestPage: React.FC = () => {
  return (
    <ErrorPage
      code="400"
      title="Requisição inválida"
      message="A requisição enviada não está no formato correto."
      description="Verifique se todos os dados foram preenchidos corretamente e tente novamente."
      icon={<AlertTriangle className="h-8 w-8 text-orange-500" />}
      showHomeButton={true}
      showBackButton={true}
      showRefreshButton={true}
    />
  );
};

export default BadRequestPage;
