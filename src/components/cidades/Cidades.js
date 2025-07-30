import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, MapPin } from "lucide-react";
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

const Cidades = () => {
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCidade, setEditingCidade] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    nome: "",
    estado: "",
    regiao: "",
    distancia: "",
  });

  useEffect(() => {
    fetchCidades();
  }, []);

  const fetchCidades = async () => {
    try {
      const snapshot = await getDocs(collection(db, "cidades"));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCidade) {
        await updateDoc(doc(db, "cidades", editingCidade.id), {
          ...formData,
          dataAtualizacao: new Date(),
        });
        showNotification("Cidade atualizada com sucesso!", "success");
      } else {
        await addDoc(collection(db, "cidades"), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date(),
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
    });
  };

  const filteredCidades = cidades.filter(
    (cidade) =>
      cidade.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cidade.estado?.toLowerCase().includes(searchTerm.toLowerCase())
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
            placeholder="Buscar por nome ou estado..."
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
                <th className="table-header">Cidade</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Região</th>
                <th className="table-header">Distância</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCidades.map((cidade) => (
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
                      {cidade.distancia} km
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingCidade(cidade);
                          setFormData({
                            nome: cidade.nome || "",
                            estado: cidade.estado || "",
                            regiao: cidade.regiao || "",
                            distancia: cidade.distancia || "",
                          });
                          setShowModal(true);
                        }}
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCidade ? "Editar Cidade" : "Nova Cidade"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome da Cidade
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
                      Estado
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.estado}
                      onChange={(e) =>
                        setFormData({ ...formData, estado: e.target.value })
                      }
                      className="input-field"
                    />
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Distância (km)
                  </label>
                  <input
                    type="number"
                    value={formData.distancia}
                    onChange={(e) =>
                      setFormData({ ...formData, distancia: e.target.value })
                    }
                    className="input-field"
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
