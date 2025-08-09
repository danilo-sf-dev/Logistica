import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Truck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNotification } from "../../contexts/NotificationContext";
import {
  maskPlaca,
  validatePlaca,
  validateCapacidade,
} from "../../utils/masks";

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("dataCriacao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [errors, setErrors] = useState({});

  const { showNotification } = useNotification();

  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    marca: "",
    ano: "",
    capacidade: "",
    tipoCarroceria: "truck",
    quantidadeEixos: "2",
    tipoBau: "frigorifico",
    status: "disponivel",
    unidadeNegocio: "frigorifico",
    ultimaManutencao: "",
    proximaManutencao: "",
    motorista: "",
    observacao: "",
  });

  const fetchVeiculos = useCallback(async () => {
    try {
      const q = query(
        collection(db, "veiculos"),
        orderBy("dataCriacao", "desc"),
      );
      const snapshot = await getDocs(q);
      const veiculosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVeiculos(veiculosData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      showNotification("Erro ao carregar veículos", "error");
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchVeiculos();
  }, [fetchVeiculos]);

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.placa.trim()) newErrors.placa = "Placa é obrigatória";
    if (!formData.modelo.trim()) newErrors.modelo = "Modelo é obrigatório";
    if (!formData.capacidade.trim())
      newErrors.capacidade = "Capacidade é obrigatória";
    if (!formData.tipoCarroceria)
      newErrors.tipoCarroceria = "Tipo de carroceria é obrigatório";
    if (!formData.tipoBau) newErrors.tipoBau = "Tipo de baú é obrigatório";

    // Validações específicas
    if (formData.placa && !validatePlaca(formData.placa)) {
      newErrors.placa = "Placa inválida (formato: LWB9390 ou LWB9R90)";
    }
    if (formData.capacidade && !validateCapacidade(formData.capacidade)) {
      newErrors.capacidade = "Capacidade deve ser um número maior que zero";
    }
    if (formData.ano) {
      const anoAtual = new Date().getFullYear();
      const anoVeiculo = parseInt(formData.ano);
      if (anoVeiculo < 1900 || anoVeiculo > anoAtual + 1) {
        newErrors.ano = `Ano deve estar entre 1900 e ${anoAtual + 1}`;
      }
    }

    // Validação de placa duplicada
    if (formData.placa) {
      const placaLimpa = formData.placa
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();
      const veiculoComMesmaPlaca = veiculos.find((veiculo) => {
        const veiculoPlacaLimpa = veiculo.placa
          .replace(/[^A-Za-z0-9]/g, "")
          .toUpperCase();
        return (
          veiculoPlacaLimpa === placaLimpa && veiculo.id !== editingVeiculo?.id
        );
      });

      if (veiculoComMesmaPlaca) {
        newErrors.placa = "Placa já cadastrada para outro veículo";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    try {
      const veiculoData = {
        ...formData,
        placa: formData.placa.toUpperCase(),
        modelo: formData.modelo.toUpperCase(),
        marca: formData.marca.toUpperCase(),
        dataAtualizacao: new Date(),
      };

      if (editingVeiculo) {
        await updateDoc(doc(db, "veiculos", editingVeiculo.id), veiculoData);
        showNotification("Veículo atualizado com sucesso!", "success");
      } else {
        await addDoc(collection(db, "veiculos"), {
          ...veiculoData,
          dataCriacao: new Date(),
        });
        showNotification("Veículo cadastrado com sucesso!", "success");
      }

      setShowModal(false);
      setEditingVeiculo(null);
      resetForm();
      fetchVeiculos();
    } catch (error) {
      console.error("Erro ao salvar veículo:", error);
      showNotification("Erro ao salvar veículo", "error");
    }
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      placa: veiculo.placa || "",
      modelo: veiculo.modelo || "",
      marca: veiculo.marca || "",
      ano: veiculo.ano || "",
      capacidade: veiculo.capacidade || "",
      tipoCarroceria: veiculo.tipoCarroceria || "truck",
      quantidadeEixos: veiculo.quantidadeEixos || "2",
      tipoBau: veiculo.tipoBau || "frigorifico",
      status: veiculo.status || "disponivel",
      unidadeNegocio: veiculo.unidadeNegocio || "frigorifico",
      ultimaManutencao: veiculo.ultimaManutencao || "",
      proximaManutencao: veiculo.proximaManutencao || "",
      motorista: veiculo.motorista || "",
      observacao: veiculo.observacao || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este veículo?")) {
      try {
        await deleteDoc(doc(db, "veiculos", id));
        showNotification("Veículo excluído com sucesso!", "success");
        fetchVeiculos();
      } catch (error) {
        console.error("Erro ao excluir veículo:", error);
        showNotification("Erro ao excluir veículo", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      placa: "",
      modelo: "",
      marca: "",
      ano: "",
      capacidade: "",
      tipoCarroceria: "truck",
      quantidadeEixos: "2",
      tipoBau: "frigorifico",
      status: "disponivel",
      unidadeNegocio: "frigorifico",
      ultimaManutencao: "",
      proximaManutencao: "",
      motorista: "",
      observacao: "",
    });
    setErrors({});
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const filteredVeiculos = veiculos.filter(
    (veiculo) =>
      veiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      veiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Ordenação
  const sortedVeiculos = [...filteredVeiculos].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (
      sortField === "placa" ||
      sortField === "modelo" ||
      sortField === "marca"
    ) {
      aValue = aValue?.toLowerCase() || "";
      bValue = bValue?.toLowerCase() || "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedVeiculos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVeiculos = sortedVeiculos.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "disponivel":
        return "bg-green-100 text-green-800";
      case "em_uso":
        return "bg-blue-100 text-blue-800";
      case "manutencao":
        return "bg-yellow-100 text-yellow-800";
      case "inativo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "disponivel":
        return "Disponível";
      case "em_uso":
        return "Em Uso";
      case "manutencao":
        return "Manutenção";
      case "inativo":
        return "Inativo";
      default:
        return "Desconhecido";
    }
  };

  const getTipoCarroceriaText = (tipo) => {
    switch (tipo) {
      case "truck":
        return "Truck";
      case "toco":
        return "Toco";
      case "bitruck":
        return "Bitruck";
      case "carreta":
        return "Carreta";
      case "carreta_ls":
        return "Carreta LS";
      case "carreta_3_eixos":
        return "Carreta 3 Eixos";
      case "truck_3_eixos":
        return "Truck 3 Eixos";
      case "truck_4_eixos":
        return "Truck 4 Eixos";
      default:
        return "Truck";
    }
  };

  const getTipoBauText = (tipo) => {
    switch (tipo) {
      case "frigorifico":
        return "Frigorífico";
      case "carga_seca":
        return "Carga Seca";
      case "baucher":
        return "Baucher";
      case "graneleiro":
        return "Graneleiro";
      case "tanque":
        return "Tanque";
      case "caçamba":
        return "Caçamba";
      case "plataforma":
        return "Plataforma";
      default:
        return "Frigorífico";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Veículos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie a frota de veículos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Veículo
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por placa, modelo ou marca..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("marca")}
                >
                  <div className="flex items-center">
                    Veículo
                    {getSortIcon("marca")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("placa")}
                >
                  <div className="flex items-center">
                    Placa
                    {getSortIcon("placa")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("capacidade")}
                >
                  <div className="flex items-center">
                    Capacidade
                    {getSortIcon("capacidade")}
                  </div>
                </th>
                <th className="table-header">Carroceria/Baú</th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="table-header">Unidade</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVeiculos.map((veiculo) => (
                <tr key={veiculo.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                          <Truck className="h-5 w-5 text-green-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {veiculo.marca} {veiculo.modelo}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ano: {veiculo.ano}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm font-medium text-gray-900">
                      {veiculo.placa}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {veiculo.capacidade} kg
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {getTipoCarroceriaText(veiculo.tipoCarroceria || "truck")}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getTipoBauText(veiculo.tipoBau || "frigorifico")}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(veiculo.status)}`}
                    >
                      {getStatusText(veiculo.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900 capitalize">
                      {veiculo.unidadeNegocio}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(veiculo)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(veiculo.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex items-center text-sm text-gray-700">
              <span>
                Mostrando {startIndex + 1} a{" "}
                {Math.min(startIndex + itemsPerPage, sortedVeiculos.length)} de{" "}
                {sortedVeiculos.length} resultados
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm border rounded-md ${
                      currentPage === page
                        ? "bg-primary-600 text-white border-primary-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Placa *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.placa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          placa: maskPlaca(e.target.value),
                        })
                      }
                      className={`input-field ${errors.placa ? "border-red-500" : ""}`}
                      placeholder="ABC1234"
                      maxLength="7"
                    />
                    {errors.placa && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.placa}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ano
                    </label>
                    <input
                      type="text"
                      value={formData.ano}
                      onChange={(e) =>
                        setFormData({ ...formData, ano: e.target.value })
                      }
                      className={`input-field ${errors.ano ? "border-red-500" : ""}`}
                      placeholder="2024"
                    />
                    {errors.ano && (
                      <p className="text-red-500 text-xs mt-1">{errors.ano}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Marca
                    </label>
                    <input
                      type="text"
                      value={formData.marca}
                      onChange={(e) =>
                        setFormData({ ...formData, marca: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.modelo}
                      onChange={(e) =>
                        setFormData({ ...formData, modelo: e.target.value })
                      }
                      className={`input-field ${errors.modelo ? "border-red-500" : ""}`}
                    />
                    {errors.modelo && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.modelo}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Capacidade (kg) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.capacidade}
                      onChange={(e) =>
                        setFormData({ ...formData, capacidade: e.target.value })
                      }
                      className={`input-field ${errors.capacidade ? "border-red-500" : ""}`}
                      placeholder="5000"
                    />
                    {errors.capacidade && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.capacidade}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="em_uso">Em Uso</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Carroceria *
                    </label>
                    <select
                      value={formData.tipoCarroceria}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipoCarroceria: e.target.value,
                        })
                      }
                      className={`input-field ${errors.tipoCarroceria ? "border-red-500" : ""}`}
                    >
                      <option value="truck">Truck</option>
                      <option value="toco">Toco</option>
                      <option value="bitruck">Bitruck</option>
                      <option value="carreta">Carreta</option>
                      <option value="carreta_ls">Carreta LS</option>
                      <option value="carreta_3_eixos">Carreta 3 Eixos</option>
                      <option value="truck_3_eixos">Truck 3 Eixos</option>
                      <option value="truck_4_eixos">Truck 4 Eixos</option>
                    </select>
                    {errors.tipoCarroceria && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.tipoCarroceria}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantidade de Eixos
                    </label>
                    <select
                      value={formData.quantidadeEixos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantidadeEixos: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="2">2 Eixos</option>
                      <option value="3">3 Eixos</option>
                      <option value="4">4 Eixos</option>
                      <option value="5">5 Eixos</option>
                      <option value="6">6 Eixos</option>
                      <option value="7">7 Eixos</option>
                      <option value="8">8 Eixos</option>
                      <option value="9">9 Eixos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Baú *
                    </label>
                    <select
                      value={formData.tipoBau}
                      onChange={(e) =>
                        setFormData({ ...formData, tipoBau: e.target.value })
                      }
                      className={`input-field ${errors.tipoBau ? "border-red-500" : ""}`}
                    >
                      <option value="frigorifico">Frigorífico</option>
                      <option value="carga_seca">Carga Seca</option>
                      <option value="baucher">Baucher</option>
                      <option value="graneleiro">Graneleiro</option>
                      <option value="tanque">Tanque</option>
                      <option value="caçamba">Caçamba</option>
                      <option value="plataforma">Plataforma</option>
                    </select>
                    {errors.tipoBau && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.tipoBau}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unidade de Negócio
                  </label>
                  <select
                    value={formData.unidadeNegocio}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        unidadeNegocio: e.target.value,
                      })
                    }
                    className="input-field"
                  >
                    <option value="frigorifico">Frigorífico</option>
                    <option value="ovos">Ovos</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Última Manutenção
                    </label>
                    <input
                      type="date"
                      value={formData.ultimaManutencao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ultimaManutencao: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Próxima Manutenção
                    </label>
                    <input
                      type="date"
                      value={formData.proximaManutencao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          proximaManutencao: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Observação
                  </label>
                  <textarea
                    value={formData.observacao}
                    onChange={(e) =>
                      setFormData({ ...formData, observacao: e.target.value })
                    }
                    className="input-field"
                    rows="3"
                    placeholder="Observações adicionais..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingVeiculo(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingVeiculo ? "Atualizar" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Veiculos;
