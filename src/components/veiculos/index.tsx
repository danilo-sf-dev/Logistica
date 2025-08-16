export { VeiculosListPage } from "./pages/VeiculosListPage";
export { VeiculoFormModal } from "./ui/VeiculoFormModal";
export { VeiculosTable } from "./ui/VeiculosTable";
export { VeiculosFiltersComponent as VeiculosFilters } from "./ui/VeiculosFilters";

export { useVeiculos } from "./state/useVeiculos";
export { VeiculosService } from "./data/veiculosService";
export * from "./export";
export type {
  Veiculo,
  VeiculoFormData,
  VeiculosFiltersType,
  VeiculosSortConfig,
} from "./types";
