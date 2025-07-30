import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Calendar,
  User,
  Check,
  X,
} from "lucide-react";
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

const Folgas = () => {
  const [folgas, setFolgas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFolga, setEditingFolga] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    motorista: "",
    dataInicio: "",
    dataFim: "",
    tipo: "folga",
    status: "pendente",
    observacoes: "",
  });

  useEffect(() => {
    fetchFolgas();
  }, []);

  const fetchFolgas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "folgas"));
      const folgasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFolgas(folgasData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar folgas:", error);
      showNotification("Erro ao carregar folgas", "error");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingFolga) {
        await updateDoc(doc(db, "folgas", editingFolga.id), {
          ...formData,
          dataAtualizacao: new Date(),
        });
        showNotification("Folga atualizada com sucesso!", "success");
      } else {
        await addDoc(collection(db, "folgas"), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        });
        showNotification("Folga solicitada com sucesso!", "success");
      }

      setShowModal(false);
      setEditingFolga(null);
      resetForm();
      fetchFolgas();
    } catch (error) {
      console.error("Erro ao salvar folga:", error);
      showNotification("Erro ao salvar folga", "error");
    }
  };

  const handleAprovar = async (id) => {
    try {
      await updateDoc(doc(db, "folgas", id), {
        status: "aprovada",
        dataAtualizacao: new Date(),
      });
      showNotification("Folga aprovada com sucesso!", "success");
      fetchFolgas();
    } catch (error) {
      console.error("Erro ao aprovar folga:", error);
      showNotification("Erro ao aprovar folga", "error");
    }
  };

  const handleRejeitar = async (id) => {
    try {
      await updateDoc(doc(db, "folgas", id), {
        status: "rejeitada",
        dataAtualizacao: new Date(),
      });
      showNotification("Folga rejeitada", "success");
      fetchFolgas();
    } catch (error) {
      console.error("Erro ao rejeitar folga:", error);
      showNotification("Erro ao rejeitar folga", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta folga?")) {
      try {
        await deleteDoc(doc(db, "folgas", id));
        showNotification("Folga excluída com sucesso!", "success");
        fetchFolgas();
      } catch (error) {
        console.error("Erro ao excluir folga:", error);
        showNotification("Erro ao excluir folga", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      motorista: "",
      dataInicio: "",
      dataFim: "",
      tipo: "folga",
      status: "pendente",
      observacoes: "",
    });
  };

  const filteredFolgas = folgas.filter((folga) =>
    folga.motorista?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "aprovada":
        return "bg-green-100 text-green-800";
      case "rejeitada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pendente":
        return "Pendente";
      case "aprovada":
        return "Aprovada";
      case "rejeitada":
        return "Rejeitada";
      default:
        return "Desconhecido";
    }
  };

  const getTipoText = (tipo) => {
    switch (tipo) {
      case "folga":
        return "Folga";
      case "ferias":
        return "Férias";
      case "licenca":
        return "Licença";
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Gestão de Folgas
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie solicitações de folgas e férias
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Solicitação
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por motorista..."
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
                <th className="table-header">Motorista</th>
                <th className="table-header">Tipo</th>
                <th className="table-header">Período</th>
                <th className="table-header">Status</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFolgas.map((folga) => (
                <tr key={folga.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-orange-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {folga.motorista}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {getTipoText(folga.tipo)}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      <div>Início: {folga.dataInicio}</div>
                      <div>Fim: {folga.dataFim}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        folga.status
                      )}`}
                    >
                      {getStatusText(folga.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      {folga.status === "pendente" && (
                        <>
                          <button
                            onClick={() => handleAprovar(folga.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Aprovar"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRejeitar(folga.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Rejeitar"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(folga.id)}
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
                {editingFolga ? "Editar Solicitação" : "Nova Solicitação"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Motorista
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.motorista}
                    onChange={(e) =>
                      setFormData({ ...formData, motorista: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tipo
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) =>
                        setFormData({ ...formData, tipo: e.target.value })
                      }
                      className="input-field"
                    >
                      <option value="folga">Folga</option>
                      <option value="ferias">Férias</option>
                      <option value="licenca">Licença</option>
                    </select>
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
                      <option value="pendente">Pendente</option>
                      <option value="aprovada">Aprovada</option>
                      <option value="rejeitada">Rejeitada</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dataInicio}
                      onChange={(e) =>
                        setFormData({ ...formData, dataInicio: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Fim
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.dataFim}
                      onChange={(e) =>
                        setFormData({ ...formData, dataFim: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                    className="input-field"
                    rows="3"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingFolga(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingFolga ? "Atualizar" : "Solicitar"}
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

export default Folgas;
