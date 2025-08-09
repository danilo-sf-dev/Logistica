/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  Phone,
  Mail,
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
  maskCPF,
  maskCelular,
  maskMoeda,
  validateCPF,
  validateEmail,
  validateCelular,
  formatCPF,
  formatCelular,
  formatMoeda,
} from "../../utils/masks";

const Motoristas = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMotorista, setEditingMotorista] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");
  const [filterTipoContrato, setFilterTipoContrato] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("dataCriacao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [errors, setErrors] = useState({});

  const { showNotification } = useNotification();

  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    celular: "",
    email: "",
    endereco: "",
    cidade: "",
    status: "disponivel",
    tipoContrato: "integral",
    unidadeNegocio: "frigorifico",
    dataAdmissao: "",
    salario: "",
    observacao: "",
  });

  const fetchMotoristas = useCallback(async () => {
    try {
      const q = query(
        collection(db, "motoristas"),
        orderBy("dataCriacao", "desc"),
      );
      const snapshot = await getDocs(q);
      const motoristasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMotoristas(motoristasData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar motoristas:", error);
      showNotification("Erro ao carregar motoristas", "error");
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchMotoristas();
  }, [fetchMotoristas]);

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.cpf.trim()) newErrors.cpf = "CPF é obrigatório";
    if (!formData.cnh.trim()) newErrors.cnh = "CNH é obrigatório";
    if (!formData.celular.trim()) newErrors.celular = "Celular é obrigatório";
    if (!formData.endereco.trim())
      newErrors.endereco = "Endereço é obrigatório";
    if (!formData.cidade.trim()) newErrors.cidade = "Cidade é obrigatório";

    // Validações específicas
    if (formData.cpf && !validateCPF(formData.cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (formData.celular && !validateCelular(formData.celular)) {
      newErrors.celular = "Celular deve ter DDD e começar com 9";
    }

    // Validação de CPF duplicado
    if (formData.cpf) {
      const cpfLimpo = formData.cpf.replace(/\D/g, "");
      const motoristaComMesmoCPF = motoristas.find((motorista) => {
        const motoristaCPFLimpo = motorista.cpf.replace(/\D/g, "");
        return (
          motoristaCPFLimpo === cpfLimpo &&
          motorista.id !== editingMotorista?.id
        );
      });

      if (motoristaComMesmoCPF) {
        newErrors.cpf = "CPF já cadastrado para outro motorista";
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
      const motoristaData = {
        ...formData,
        nome: formData.nome.toUpperCase(),
        dataAtualizacao: new Date(),
      };

      if (editingMotorista) {
        await updateDoc(
          doc(db, "motoristas", editingMotorista.id),
          motoristaData,
        );
        showNotification("Motorista atualizado com sucesso!", "success");
      } else {
        await addDoc(collection(db, "motoristas"), {
          ...motoristaData,
          dataCriacao: new Date(),
        });
        showNotification("Motorista cadastrado com sucesso!", "success");
      }

      setShowModal(false);
      setEditingMotorista(null);
      resetForm();
      fetchMotoristas();
    } catch (error) {
      console.error("Erro ao salvar motorista:", error);
      showNotification("Erro ao salvar motorista", "error");
    }
  };

  const handleEdit = (motorista) => {
    setEditingMotorista(motorista);
    setFormData({
      nome: motorista.nome || "",
      cpf: motorista.cpf || "",
      cnh: motorista.cnh || "",
      celular: motorista.celular || motorista.telefone || "",
      email: motorista.email || "",
      endereco: motorista.endereco || "",
      cidade: motorista.cidade || "",
      status: motorista.status || "disponivel",
      tipoContrato: motorista.tipoContrato || "integral",
      unidadeNegocio: motorista.unidadeNegocio || "frigorifico",
      dataAdmissao: motorista.dataAdmissao || "",
      salario: motorista.salario || "",
      observacao: motorista.observacao || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este motorista?")) {
      try {
        await deleteDoc(doc(db, "motoristas", id));
        showNotification("Motorista excluído com sucesso!", "success");
        fetchMotoristas();
      } catch (error) {
        console.error("Erro ao excluir motorista:", error);
        showNotification("Erro ao excluir motorista", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      cpf: "",
      cnh: "",
      celular: "",
      email: "",
      endereco: "",
      cidade: "",
      status: "disponivel",
      tipoContrato: "integral",
      unidadeNegocio: "frigorifico",
      dataAdmissao: "",
      salario: "",
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

  const filteredMotoristas = motoristas.filter((motorista) => {
    const matchesSearch =
      motorista.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.cpf?.includes(searchTerm) ||
      motorista.cnh?.includes(searchTerm) ||
      motorista.cidade?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "todos" || motorista.status === filterStatus;

    const matchesTipoContrato =
      filterTipoContrato === "todos" ||
      motorista.tipoContrato === filterTipoContrato;

    return matchesSearch && matchesStatus && matchesTipoContrato;
  });

  // Ordenação
  const sortedMotoristas = [...filteredMotoristas].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "nome") {
      aValue = aValue?.toLowerCase() || "";
      bValue = bValue?.toLowerCase() || "";
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Paginação
  const totalPages = Math.ceil(sortedMotoristas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMotoristas = sortedMotoristas.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "trabalhando":
        return "bg-green-100 text-green-800";
      case "disponivel":
        return "bg-blue-100 text-blue-800";
      case "folga":
        return "bg-yellow-100 text-yellow-800";
      case "ferias":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "trabalhando":
        return "Trabalhando";
      case "disponivel":
        return "Disponível";
      case "folga":
        return "Folga";
      case "ferias":
        return "Férias";
      default:
        return "Desconhecido";
    }
  };

  const getTipoContratoText = (tipo) => {
    switch (tipo) {
      case "integral":
        return "Integral";
      case "temporario":
        return "Temporário";
      case "folguista":
        return "Folguista";
      case "inativo":
        return "Inativo";
      default:
        return "Integral";
    }
  };

  const getTipoContratoColor = (tipo) => {
    switch (tipo) {
      case "integral":
        return "bg-blue-100 text-blue-800";
      case "temporario":
        return "bg-yellow-100 text-yellow-800";
      case "folguista":
        return "bg-purple-100 text-purple-800";
      case "inativo":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
          <h1 className="text-2xl font-semibold text-gray-900">Motoristas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os motoristas da frota
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Motorista
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, CPF, CNH ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos os status</option>
              <option value="trabalhando">Trabalhando</option>
              <option value="disponivel">Disponível</option>
              <option value="folga">Folga</option>
              <option value="ferias">Férias</option>
            </select>
          </div>
          <div className="sm:w-48">
            <select
              value={filterTipoContrato}
              onChange={(e) => setFilterTipoContrato(e.target.value)}
              className="input-field"
            >
              <option value="todos">Todos os contratos</option>
              <option value="integral">Integral</option>
              <option value="temporario">Temporário</option>
              <option value="folguista">Folguista</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
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
                    Motorista
                    {getSortIcon("nome")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("cpf")}
                >
                  <div className="flex items-center">
                    CPF
                    {getSortIcon("cpf")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("cnh")}
                >
                  <div className="flex items-center">
                    CNH
                    {getSortIcon("cnh")}
                  </div>
                </th>
                <th className="table-header">Contato</th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("tipoContrato")}
                >
                  <div className="flex items-center">
                    Tipo de Contrato
                    {getSortIcon("tipoContrato")}
                  </div>
                </th>
                <th className="table-header">Unidade</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedMotoristas.map((motorista) => (
                <tr key={motorista.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {motorista.nome}
                        </div>
                        <div className="text-sm text-gray-500">
                          {motorista.cidade}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {formatCPF(motorista.cpf)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{motorista.cnh}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-1" />
                      {formatCelular(motorista.celular || motorista.telefone)}
                    </div>
                    {motorista.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {motorista.email}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(motorista.status)}`}
                    >
                      {getStatusText(motorista.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTipoContratoColor(motorista.tipoContrato || "integral")}`}
                    >
                      {getTipoContratoText(
                        motorista.tipoContrato || "integral",
                      )}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900 capitalize">
                      {motorista.unidadeNegocio}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(motorista)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(motorista.id)}
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
                {Math.min(startIndex + itemsPerPage, sortedMotoristas.length)}{" "}
                de {sortedMotoristas.length} resultados
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
                {editingMotorista ? "Editar Motorista" : "Novo Motorista"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome *
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
                      CPF *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          cpf: maskCPF(e.target.value),
                        })
                      }
                      className={`input-field ${errors.cpf ? "border-red-500" : ""}`}
                      placeholder="000.000.000-00"
                    />
                    {errors.cpf && (
                      <p className="text-red-500 text-xs mt-1">{errors.cpf}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CNH *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cnh}
                      onChange={(e) =>
                        setFormData({ ...formData, cnh: e.target.value })
                      }
                      className={`input-field ${errors.cnh ? "border-red-500" : ""}`}
                    />
                    {errors.cnh && (
                      <p className="text-red-500 text-xs mt-1">{errors.cnh}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Celular *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.celular}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          celular: maskCelular(e.target.value),
                        })
                      }
                      className={`input-field ${errors.celular ? "border-red-500" : ""}`}
                      placeholder="(73) 99999-9999"
                    />
                    {errors.celular && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.celular}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    className={`input-field ${errors.endereco ? "border-red-500" : ""}`}
                  />
                  {errors.endereco && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endereco}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      className={`input-field ${errors.cidade ? "border-red-500" : ""}`}
                    />
                    {errors.cidade && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.cidade}
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
                      <option value="trabalhando">Trabalhando</option>
                      <option value="folga">Folga</option>
                      <option value="ferias">Férias</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo de Contrato
                    </label>
                    <select
                      value={formData.tipoContrato}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tipoContrato: e.target.value,
                        })
                      }
                      className="input-field"
                    >
                      <option value="integral">Integral</option>
                      <option value="temporario">Temporário</option>
                      <option value="folguista">Folguista</option>
                      <option value="inativo">Inativo</option>
                    </select>
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Admissão
                    </label>
                    <input
                      type="date"
                      value={formData.dataAdmissao}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataAdmissao: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Salário
                    </label>
                    <input
                      type="text"
                      value={formData.salario}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          salario: maskMoeda(e.target.value),
                        })
                      }
                      className="input-field"
                      placeholder="R$ 0,00"
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
                      setEditingMotorista(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMotorista ? "Atualizar" : "Cadastrar"}
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

export default Motoristas;
