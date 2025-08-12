import React from "react";
import { Search } from "lucide-react";
import { ErrorPage } from "./ErrorPage";

export const NotFoundPage: React.FC = () => {
  return (
    <ErrorPage
      code="404"
      title="Página não encontrada"
      message="Ops! Parece que você se perdeu no caminho."
      description="A página que você está procurando não existe ou foi movida para outro endereço."
      icon={<Search className="h-8 w-8 text-red-500" />}
      showHomeButton={true}
      showBackButton={true}
      showRefreshButton={false}
    />
  );
};

export default NotFoundPage;
