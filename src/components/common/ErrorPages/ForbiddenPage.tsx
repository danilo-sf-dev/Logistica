import React from "react";
import { Lock } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const ForbiddenPage: React.FC = () => {
  return (
    <ErrorPage
      code="403"
      title="Acesso proibido"
      message="Você não tem permissão para acessar este recurso."
      description="Esta área é restrita. Entre em contato com o administrador se acredita que isso é um erro."
      icon={<Lock className="h-8 w-8 text-red-500" />}
      showHomeButton={true}
      showBackButton={true}
      showRefreshButton={false}
    />
  );
};

export default ForbiddenPage;
