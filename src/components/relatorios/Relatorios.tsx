import React from "react";
import { RelatoriosPage } from "./pages/RelatoriosPage";
import type { RelatoriosProps } from "./types";

const Relatorios: React.FC<RelatoriosProps> = (props) => {
  return <RelatoriosPage {...props} />;
};

export default Relatorios;
