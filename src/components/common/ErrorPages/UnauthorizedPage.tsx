import React from "react";
import { Shield } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const UnauthorizedPage: React.FC = () => {
  return (
    <ErrorPage
      code="401"
      title="Acesso não autorizado"
      message="Você não tem permissão para acessar esta página."
      description="Faça login com uma conta que tenha as permissões necessárias."
      icon={<Shield className="h-8 w-8 text-red-500" />}
      showHomeButton={true}
      showBackButton={true}
      showRefreshButton={false}
    />
  );
};

export default UnauthorizedPage;
