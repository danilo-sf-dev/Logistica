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
  maskCelular,
  validateEmail,
  validateCelular,
  formatCelular,
} from "../../utils/masks";

const Vendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("dataCriacao");
  const [sortDirection, setSortDirection] = useState("desc");
  const [errors, setErrors] = useState({});

  const { showNotification } = useNotification();

  const itemsPerPage = 15;

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    celular: "",
    regiao: "",
    codigoVendSistema: "",
    unidadeNegocio: "frigorifico",
    status: "ativo",
  });

  const fetchVendedores = useCallback(async () => {
    try {
      const q = query(
        collection(db, "vendedores"),
        orderBy("dataCriacao", "desc")
      );
      const snapshot = await getDocs(q);
      const vendedoresData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVendedores(vendedoresData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
      showNotification("Erro ao carregar vendedores", "error");
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    fetchVendedores();
  }, [fetchVendedores]);

  const validateForm = () => {
    const newErrors = {};

    // Validações obrigatórias
    if (!formData.nome.trim()) newErrors.nome = "Nome é obrigatório";
    if (!formData.regiao.trim()) newErrors.regiao = "Região é obrigatória";
    if (!formData.unidadeNegocio)
      newErrors.unidadeNegocio = "Unidade de negócio é obrigatória";

    // Validações específicas
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }
    if (formData.celular && !validateCelular(formData.celular)) {
      newErrors.celular = "Celular inválido (formato: (73) 99999-9999)";
    }
    if (formData.codigoVendSistema) {
      const codigo = parseInt(formData.codigoVendSistema);
      if (isNaN(codigo) || codigo < 0) {
        newErrors.codigoVendSistema =
          "Código deve ser um número inteiro positivo";
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
      const vendedorData = {
        ...formData,
        nome: formData.nome.toUpperCase(),
        regiao: formData.regiao.toUpperCase(),
        dataAtualizacao: new Date(),
      };

      if (editingVendedor) {
        await updateDoc(
          doc(db, "vendedores", editingVendedor.id),
          vendedorData
        );
        showNotification("Vendedor atualizado com sucesso!", "success");
      } else {
        await addDoc(collection(db, "vendedores"), {
          ...vendedorData,
          dataCriacao: new Date(),
        });
        showNotification("Vendedor cadastrado com sucesso!", "success");
      }

      setShowModal(false);
      setEditingVendedor(null);
      resetForm();
      fetchVendedores();
    } catch (error) {
      console.error("Erro ao salvar vendedor:", error);
      showNotification("Erro ao salvar vendedor", "error");
    }
  };

  const handleEdit = (vendedor) => {
    setEditingVendedor(vendedor);
    setFormData({
      nome: vendedor.nome || "",
      email: vendedor.email || "",
      celular: vendedor.celular || vendedor.telefone || "", // Suporte para campo antigo
      regiao: vendedor.regiao || "",
      codigoVendSistema: vendedor.codigoVendSistema || "",
      unidadeNegocio: vendedor.unidadeNegocio || "frigorifico",
      status: vendedor.status || "ativo",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este vendedor?")) {
      try {
        await deleteDoc(doc(db, "vendedores", id));
        showNotification("Vendedor excluído com sucesso!", "success");
        fetchVendedores();
      } catch (error) {
        console.error("Erro ao excluir vendedor:", error);
        showNotification("Erro ao excluir vendedor", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      email: "",
      celular: "",
      regiao: "",
      codigoVendSistema: "",
      unidadeNegocio: "frigorifico",
      status: "ativo",
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

  const filteredVendedores = vendedores.filter(
    (vendedor) =>
      vendedor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.regiao?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Ordenação
  const sortedVendedores = [...filteredVendedores].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (
      sortField === "nome" ||
      sortField === "email" ||
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
  const totalPages = Math.ceil(sortedVendedores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedVendedores = sortedVendedores.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800";
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
          <h1 className="text-2xl font-semibold text-gray-900">Vendedores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie os vendedores da empresa
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Vendedor
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou região..."
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
                    Vendedor
                    {getSortIcon("nome")}
                  </div>
                </th>
                <th className="table-header">Contato</th>
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
                  onClick={() => handleSort("unidadeNegocio")}
                >
                  <div className="flex items-center">
                    Unidade
                    {getSortIcon("unidadeNegocio")}
                  </div>
                </th>
                <th
                  className="table-header cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedVendedores.map((vendedor) => (
                <tr key={vendedor.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {vendedor.nome}
                        </div>
                        {vendedor.codigoVendSistema && (
                          <div className="text-sm text-gray-500">
                            Código: {vendedor.codigoVendSistema}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-1" />
                      {formatCelular(vendedor.celular || vendedor.telefone)}
                    </div>
                    {vendedor.email && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Mail className="h-4 w-4 mr-1" />
                        {vendedor.email}
                      </div>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {vendedor.regiao}
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-sm text-gray-900 capitalize">
                      {vendedor.unidadeNegocio === "ambos"
                        ? "Ambos"
                        : vendedor.unidadeNegocio}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(vendedor.status)}`}
                    >
                      {vendedor.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(vendedor)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(vendedor.id)}
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
                {Math.min(startIndex + itemsPerPage, sortedVendedores.length)}{" "}
                de {sortedVendedores.length} resultados
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
                {editingVendedor ? "Editar Vendedor" : "Novo Vendedor"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Código Vend.Sistema
                    </label>
                    <input
                      type="text"
                      value={formData.codigoVendSistema}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          codigoVendSistema: e.target.value,
                        })
                      }
                      className={`input-field ${errors.codigoVendSistema ? "border-red-500" : ""}`}
                      placeholder="Ex: 12345"
                    />
                    {errors.codigoVendSistema && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.codigoVendSistema}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      placeholder="exemplo@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Celular
                    </label>
                    <input
                      type="text"
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
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Região *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.regiao}
                      onChange={(e) =>
                        setFormData({ ...formData, regiao: e.target.value })
                      }
                      className={`input-field ${errors.regiao ? "border-red-500" : ""}`}
                      placeholder="Ex: Nordeste, Sudeste..."
                    />
                    {errors.regiao && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.regiao}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unidade de Negócio *
                    </label>
                    <select
                      required
                      value={formData.unidadeNegocio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          unidadeNegocio: e.target.value,
                        })
                      }
                      className={`input-field ${errors.unidadeNegocio ? "border-red-500" : ""}`}
                    >
                      <option value="frigorifico">Frigorífico</option>
                      <option value="ovos">Ovos</option>
                      <option value="ambos">Ambos</option>
                    </select>
                    {errors.unidadeNegocio && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.unidadeNegocio}
                      </p>
                    )}
                  </div>
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
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingVendedor(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingVendedor ? "Atualizar" : "Cadastrar"}
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

export default Vendedores;
