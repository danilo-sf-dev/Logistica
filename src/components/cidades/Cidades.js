import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MapPin,
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

const Cidades = () => {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCidade, setEditingCidade] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("dataCriacao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [errors, setErrors] = useState({});

  const { showNotification } = useNotification();

  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    nome: "",
    estado: "",
    regiao: "",
    distancia: "",
    observacao: "",
  });

  // Lista de estados brasileiros
  const estados = [
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
  ];

  const fetchCidades = useCallback(async () => {
    try {
      const q = query(
        collection(db, "cidades"),
        orderBy("dataCriacao", "desc")
      );
      const snapshot = await getDocs(q);
      const cidadesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCidades(cidadesData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
      showNotification("Erro ao carregar cidades", "error");
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchCidades();
  }, [fetchCidades]);

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.nome.trim()) newErrors.nome = "Nome da cidade é obrigatório";
    if (!formData.estado) newErrors.estado = "Estado é obrigatório";

    // Validação de distância
    if (formData.distancia && parseFloat(formData.distancia) < 0) {
      newErrors.distancia = "Distância deve ser um número positivo";
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
      const cidadeData = {
        ...formData,
        nome: formData.nome.toUpperCase(),
        regiao: formData.regiao.toUpperCase(),
        dataAtualizacao: new Date(),
      };

      if (editingCidade) {
        await updateDoc(doc(db, "cidades", editingCidade.id), cidadeData);
        showNotification("Cidade atualizada com sucesso!", "success");
      } else {
        await addDoc(collection(db, "cidades"), {
          ...cidadeData,
          dataCriacao: new Date(),
        });
        showNotification("Cidade cadastrada com sucesso!", "success");
      }

      setShowModal(false);
      setEditingCidade(null);
      resetForm();
      fetchCidades();
    } catch (error) {
      console.error("Erro ao salvar cidade:", error);
      showNotification("Erro ao salvar cidade", "error");
    }
  };

  const handleEdit = (cidade) => {
    setEditingCidade(cidade);
    setFormData({
      nome: cidade.nome || "",
      estado: cidade.estado || "",
      regiao: cidade.regiao || "",
      distancia: cidade.distancia || "",
      observacao: cidade.observacao || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
      try {
        await deleteDoc(doc(db, "cidades", id));
        showNotification("Cidade excluída com sucesso!", "success");
        fetchCidades();
      } catch (error) {
        console.error("Erro ao excluir cidade:", error);
        showNotification("Erro ao excluir cidade", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      estado: "",
      regiao: "",
      distancia: "",
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

  const filteredCidades = cidades.filter(
    (cidade) =>
      cidade.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cidade.estado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cidade.regiao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenação
  const sortedCidades = [...filteredCidades].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (
      sortField === "nome" ||
      sortField === "estado" ||
      sortField === "regiao"
    ) {
      aValue = aValue?.toLowerCase() || "";
      bValue = bValue?.toLowerCase() || "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedCidades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCidades = sortedCidades.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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
          <h1 className="text-2xl font-semibold text-gray-900">Cidades</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as cidades atendidas
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Cidade
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, estado ou região..."
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
                  onClick={() => handleSort("nome")}
                >
                  <div className="flex items-center">
                    Cidade
                    {getSortIcon("nome")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("estado")}
                >
                  <div className="flex items-center">
                    Estado
                    {getSortIcon("estado")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("regiao")}
                >
                  <div className="flex items-center">
                    Região
                    {getSortIcon("regiao")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("distancia")}
                >
                  <div className="flex items-center">
                    Distância
                    {getSortIcon("distancia")}
                  </div>
                </th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCidades.map((cidade) => (
                <tr key={cidade.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {cidade.nome}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{cidade.estado}</div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{cidade.regiao}</div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {cidade.distancia ? `${cidade.distancia} km` : "-"}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cidade)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cidade.id)}
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
                {Math.min(startIndex + itemsPerPage, sortedCidades.length)} de{" "}
                {sortedCidades.length} resultados
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
                )
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
                {editingCidade ? "Editar Cidade" : "Nova Cidade"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome da Cidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className={`input-field ${errors.nome ? "border-red-500" : ""}`}
                  />
                  {errors.nome && (
                    <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Estado *
                    </label>
                    <select
                      required
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      className={`input-field ${errors.estado ? "border-red-500" : ""}`}
                    >
                      <option value="">Selecione um estado</option>
                      {estados.map((estado) => (
                        <option key={estado.sigla} value={estado.sigla}>
                          {estado.sigla} - {estado.nome}
                        </option>
                      ))}
                    </select>
                    {errors.estado && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.estado}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Região
                    </label>
                    <input
                      type="text"
                      value={formData.regiao}
                      onChange={(e) =>
                        setFormData({ ...formData, regiao: e.target.value })
                      }
                      className="input-field"
                      placeholder="Ex: Nordeste, Sudeste..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Distância (km)
                  </label>
                  <input
                    type="text"
                    value={formData.distancia}
                    onChange={(e) =>
                      setFormData({ ...formData, distancia: e.target.value })
                    }
                    className={`input-field ${errors.distancia ? "border-red-500" : ""}`}
                    placeholder="Ex: 150"
                  />
                  {errors.distancia && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.distancia}
                    </p>
                  )}
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
                      setEditingCidade(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingCidade ? "Atualizar" : "Cadastrar"}
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

export default Cidades;
