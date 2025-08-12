import React from "react";
import { Server } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const ServerErrorPage: React.FC = () => {
  return (
    <ErrorPage
      code="500"
      title="Erro interno do servidor"
      message="Algo deu errado no nosso servidor."
      description="Nossa equipe foi notificada e está trabalhando para resolver o problema. Tente novamente em alguns minutos."
      icon={<Server className="h-8 w-8 text-red-500" />}
      showHomeButton={true}
      showBackButton={false}
      showRefreshButton={true}
    />
  );
};

export default ServerErrorPage;
