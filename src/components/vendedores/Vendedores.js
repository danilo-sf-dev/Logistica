import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit, Trash2, Search, User, Phone, Mail } from "lucide-react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useNotification } from "../../contexts/NotificationContext";

const Vendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVendedor, setEditingVendedor] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    regiao: "",
    unidadeNegocio: "frigorifico",
    status: "ativo",
  });

  const fetchVendedores = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "vendedores"));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingVendedor) {
        await updateDoc(doc(db, "vendedores", editingVendedor.id), {
          ...formData,
          dataAtualizacao: new Date(),
        });
        showNotification("Vendedor atualizado com sucesso!", "success");
      } else {
        await addDoc(collection(db, "vendedores"), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
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
      telefone: "",
      regiao: "",
      unidadeNegocio: "frigorifico",
      status: "ativo",
    });
  };

  const filteredVendedores = vendedores.filter(
    (vendedor) =>
      vendedor.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar por nome ou email..."
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
                <th className="table-header">Vendedor</th>
                <th className="table-header">Contato</th>
                <th className="table-header">Região</th>
                <th className="table-header">Unidade</th>
                <th className="table-header">Status</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVendedores.map((vendedor) => (
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
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-1" />
                      {vendedor.telefone}
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
                      {vendedor.unidadeNegocio}
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
                        onClick={() => {
                          setEditingVendedor(vendedor);
                          setFormData({
                            nome: vendedor.nome || "",
                            email: vendedor.email || "",
                            telefone: vendedor.telefone || "",
                            regiao: vendedor.regiao || "",
                            unidadeNegocio:
                              vendedor.unidadeNegocio || "frigorifico",
                            status: vendedor.status || "ativo",
                          });
                          setShowModal(true);
                        }}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVendedor ? "Editar Vendedor" : "Novo Vendedor"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    className="input-field"
                  />
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
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <input
                      type="text"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    />
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
                    </select>
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
