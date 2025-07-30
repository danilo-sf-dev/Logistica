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

const Motoristas = () => {
  const [motoristas, setMotoristas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMotorista, setEditingMotorista] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("todos");

  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cnh: "",
    telefone: "",
    email: "",
    endereco: "",
    cidade: "",
    status: "disponivel",
    unidadeNegocio: "frigorifico",
    dataAdmissao: "",
    salario: "",
  });

  const fetchMotoristas = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "motoristas"));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingMotorista) {
        await updateDoc(doc(db, "motoristas", editingMotorista.id), {
          ...formData,
          dataAtualizacao: new Date(),
        });
        showNotification("Motorista atualizado com sucesso!", "success");
      } else {
        await addDoc(collection(db, "motoristas"), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
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
      telefone: motorista.telefone || "",
      email: motorista.email || "",
      endereco: motorista.endereco || "",
      cidade: motorista.cidade || "",
      status: motorista.status || "disponivel",
      unidadeNegocio: motorista.unidadeNegocio || "frigorifico",
      dataAdmissao: motorista.dataAdmissao || "",
      salario: motorista.salario || "",
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
      telefone: "",
      email: "",
      endereco: "",
      cidade: "",
      status: "disponivel",
      unidadeNegocio: "frigorifico",
      dataAdmissao: "",
      salario: "",
    });
  };

  const filteredMotoristas = motoristas.filter((motorista) => {
    const matchesSearch =
      motorista.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      motorista.cpf?.includes(searchTerm) ||
      motorista.cnh?.includes(searchTerm);

    const matchesStatus =
      filterStatus === "todos" || motorista.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

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
                placeholder="Buscar por nome, CPF ou CNH..."
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
        </div>
      </div>

      {/* Tabela */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Motorista</th>
                <th className="table-header">CPF/CNH</th>
                <th className="table-header">Contato</th>
                <th className="table-header">Status</th>
                <th className="table-header">Unidade</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMotoristas.map((motorista) => (
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
                    <div className="text-sm text-gray-900">{motorista.cpf}</div>
                    <div className="text-sm text-gray-500">{motorista.cnh}</div>
                  </td>
                  <td className="table-cell">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-1" />
                      {motorista.telefone}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMotorista ? "Editar Motorista" : "Novo Motorista"}
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
                      CPF
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cpf}
                      onChange={(e) =>
                        setFormData({ ...formData, cpf: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      CNH
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cnh}
                      onChange={(e) =>
                        setFormData({ ...formData, cnh: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Endereço
                  </label>
                  <input
                    type="text"
                    value={formData.endereco}
                    onChange={(e) =>
                      setFormData({ ...formData, endereco: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cidade
                    </label>
                    <input
                      type="text"
                      value={formData.cidade}
                      onChange={(e) =>
                        setFormData({ ...formData, cidade: e.target.value })
                      }
                      className="input-field"
                    />
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Salário
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.salario}
                    onChange={(e) =>
                      setFormData({ ...formData, salario: e.target.value })
                    }
                    className="input-field"
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
