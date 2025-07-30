import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Map,
  MapPin,
  Calendar,
  Truck,
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

const Rotas = () => {
  const [rotas, setRotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRota, setEditingRota] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    origem: "",
    destino: "",
    motorista: "",
    veiculo: "",
    dataPartida: "",
    dataChegada: "",
    status: "agendada",
    unidadeNegocio: "frigorifico",
    observacoes: "",
  });

  useEffect(() => {
    fetchRotas();
  }, []);

  const fetchRotas = async () => {
    try {
      const snapshot = await getDocs(collection(db, "rotas"));
      const rotasData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRotas(rotasData);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      showNotification("Erro ao carregar rotas", "error");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingRota) {
        await updateDoc(doc(db, "rotas", editingRota.id), {
          ...formData,
          dataAtualizacao: new Date(),
        });
        showNotification("Rota atualizada com sucesso!", "success");
      } else {
        await addDoc(collection(db, "rotas"), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
        });
        showNotification("Rota criada com sucesso!", "success");
      }

      setShowModal(false);
      setEditingRota(null);
      resetForm();
      fetchRotas();
    } catch (error) {
      console.error("Erro ao salvar rota:", error);
      showNotification("Erro ao salvar rota", "error");
    }
  };

  const handleEdit = (rota) => {
    setEditingRota(rota);
    setFormData({
      origem: rota.origem || "",
      destino: rota.destino || "",
      motorista: rota.motorista || "",
      veiculo: rota.veiculo || "",
      dataPartida: rota.dataPartida || "",
      dataChegada: rota.dataChegada || "",
      status: rota.status || "agendada",
      unidadeNegocio: rota.unidadeNegocio || "frigorifico",
      observacoes: rota.observacoes || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta rota?")) {
      try {
        await deleteDoc(doc(db, "rotas", id));
        showNotification("Rota excluída com sucesso!", "success");
        fetchRotas();
      } catch (error) {
        console.error("Erro ao excluir rota:", error);
        showNotification("Erro ao excluir rota", "error");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      origem: "",
      destino: "",
      motorista: "",
      veiculo: "",
      dataPartida: "",
      dataChegada: "",
      status: "agendada",
      unidadeNegocio: "frigorifico",
      observacoes: "",
    });
  };

  const filteredRotas = rotas.filter(
    (rota) =>
      rota.origem?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rota.destino?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rota.motorista?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "agendada":
        return "bg-blue-100 text-blue-800";
      case "em_andamento":
        return "bg-yellow-100 text-yellow-800";
      case "concluida":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "agendada":
        return "Agendada";
      case "em_andamento":
        return "Em Andamento";
      case "concluida":
        return "Concluída";
      case "cancelada":
        return "Cancelada";
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
          <h1 className="text-2xl font-semibold text-gray-900">Rotas</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gerencie as rotas de transporte
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Rota
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por origem, destino ou motorista..."
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
                <th className="table-header">Rota</th>
                <th className="table-header">Motorista</th>
                <th className="table-header">Veículo</th>
                <th className="table-header">Datas</th>
                <th className="table-header">Status</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRotas.map((rota) => (
                <tr key={rota.id} className="hover:bg-gray-50">
                  <td className="table-cell">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Map className="h-5 w-5 text-purple-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {rota.origem} → {rota.destino}
                        </div>
                        <div className="text-sm text-gray-500">
                          {rota.unidadeNegocio}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      {rota.motorista}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">{rota.veiculo}</div>
                  </td>
                  <td className="table-cell">
                    <div className="text-sm text-gray-900">
                      <div>Partida: {rota.dataPartida}</div>
                      <div>Chegada: {rota.dataChegada}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        rota.status
                      )}`}
                    >
                      {getStatusText(rota.status)}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(rota)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rota.id)}
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
                {editingRota ? "Editar Rota" : "Nova Rota"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Origem
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.origem}
                    onChange={(e) =>
                      setFormData({ ...formData, origem: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Destino
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.destino}
                    onChange={(e) =>
                      setFormData({ ...formData, destino: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Veículo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.veiculo}
                      onChange={(e) =>
                        setFormData({ ...formData, veiculo: e.target.value })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Partida
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.dataPartida}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataPartida: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Data de Chegada
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.dataChegada}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataChegada: e.target.value,
                        })
                      }
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                      <option value="agendada">Agendada</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluida">Concluída</option>
                      <option value="cancelada">Cancelada</option>
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
                    </select>
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
                      setEditingRota(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingRota ? "Atualizar" : "Criar"}
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

export default Rotas;
