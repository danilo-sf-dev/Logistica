import React from "react";
import { ConfiguracoesPage } from "./pages/ConfiguracoesPage";
import type { ConfiguracoesProps } from "./types";

const Configuracoes: React.FC<ConfiguracoesProps> = (props) => {
  return <ConfiguracoesPage {...props} />;
};

export default Configuracoes;
