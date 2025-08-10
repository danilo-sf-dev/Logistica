// Regiões oficiais do Brasil
export const REGIOES_BRASIL = [
  { valor: "norte", nome: "Norte" },
  { valor: "nordeste", nome: "Nordeste" },
  { valor: "centro-oeste", nome: "Centro-Oeste" },
  { valor: "sudeste", nome: "Sudeste" },
  { valor: "sul", nome: "Sul" },
] as const;

// Estados brasileiros
export const ESTADOS_BRASIL = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
] as const;

// Mapeamento de estados para regiões
export const ESTADO_PARA_REGIAO: Record<string, string> = {
  // Norte
  AC: "norte",
  AP: "norte",
  AM: "norte",
  PA: "norte",
  RO: "norte",
  RR: "norte",
  TO: "norte",

  // Nordeste
  AL: "nordeste",
  BA: "nordeste",
  CE: "nordeste",
  MA: "nordeste",
  PB: "nordeste",
  PE: "nordeste",
  PI: "nordeste",
  RN: "nordeste",
  SE: "nordeste",

  // Centro-Oeste
  DF: "centro-oeste",
  GO: "centro-oeste",
  MT: "centro-oeste",
  MS: "centro-oeste",

  // Sudeste
  ES: "sudeste",
  MG: "sudeste",
  RJ: "sudeste",
  SP: "sudeste",

  // Sul
  PR: "sul",
  RS: "sul",
  SC: "sul",
};

// Função helper para obter a região de um estado
export const obterRegiaoPorEstado = (
  siglaEstado: string
): string | undefined => {
  return ESTADO_PARA_REGIAO[siglaEstado];
};

// Tipos para as constantes
export type RegiaoBrasil = (typeof REGIOES_BRASIL)[number]["valor"];
export type EstadoBrasil = (typeof ESTADOS_BRASIL)[number]["sigla"];
