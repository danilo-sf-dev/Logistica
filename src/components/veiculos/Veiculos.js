import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Truck, Calendar, Wrench } from 'lucide-react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useNotification } from '../../contexts/NotificationContext';

const Veiculos = () => {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    marca: '',
    ano: '',
    capacidade: '',
    status: 'disponivel',
    unidadeNegocio: 'frigorifico',
    ultimaManutencao: '',
    proximaManutencao: '',
    motorista: ''
  });

  useEffect(() => {
    fetchVeiculos();
  }, []);

  const fetchVeiculos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'veiculos'));
      const veiculosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setVeiculos(veiculosData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar veículos:', error);
      showNotification('Erro ao carregar veículos', 'error');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingVeiculo) {
        await updateDoc(doc(db, 'veiculos', editingVeiculo.id), {
          ...formData,
          dataAtualizacao: new Date()
        });
        showNotification('Veículo atualizado com sucesso!', 'success');
      } else {
        await addDoc(collection(db, 'veiculos'), {
          ...formData,
          dataCriacao: new Date(),
          dataAtualizacao: new Date()
        });
        showNotification('Veículo cadastrado com sucesso!', 'success');
      }
      
      setShowModal(false);
      setEditingVeiculo(null);
      resetForm();
      fetchVeiculos();
    } catch (error) {
      console.error('Erro ao salvar veículo:', error);
      showNotification('Erro ao salvar veículo', 'error');
    }
  };

  const handleEdit = (veiculo) => {
    setEditingVeiculo(veiculo);
    setFormData({
      placa: veiculo.placa || '',
      modelo: veiculo.modelo || '',
      marca: veiculo.marca || '',
      ano: veiculo.ano || '',
      capacidade: veiculo.capacidade || '',
      status: veiculo.status || 'disponivel',
      unidadeNegocio: veiculo.unidadeNegocio || 'frigorifico',
      ultimaManutencao: veiculo.ultimaManutencao || '',
      proximaManutencao: veiculo.proximaManutencao || '',
      motorista: veiculo.motorista || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este veículo?')) {
      try {
        await deleteDoc(doc(db, 'veiculos', id));
        showNotification('Veículo excluído com sucesso!', 'success');
        fetchVeiculos();
      } catch (error) {
        console.error('Erro ao excluir veículo:', error);
        showNotification('Erro ao excluir veículo', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      placa: '',
      modelo: '',
      marca: '',
      ano: '',
      capacidade: '',
      status: 'disponivel',
      unidadeNegocio: 'frigorifico',
      ultimaManutencao: '',
      proximaManutencao: '',
      motorista: ''
    });
  };

  const filteredVeiculos = veiculos.filter(veiculo =>
    veiculo.placa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    veiculo.marca?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'disponivel': return 'bg-green-100 text-green-800';
      case 'em_uso': return 'bg-blue-100 text-blue-800';
      case 'manutencao': return 'bg-yellow-100 text-yellow-800';
      case 'inativo': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'em_uso': return 'Em Uso';
      case 'manutencao': return 'Manutenção';
      case 'inativo': return 'Inativo';
      default: return 'Desconhecido';
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
                <th className="table-header">Veículo</th>
                <th className="table-header">Placa</th>
                <th className="table-header">Capacidade</th>
                <th className="table-header">Status</th>
                <th className="table-header">Unidade</th>
                <th className="table-header">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredVeiculos.map((veiculo) => (
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
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(veiculo.status)}`}>
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
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingVeiculo ? 'Editar Veículo' : 'Novo Veículo'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Placa</label>
                    <input
                      type="text"
                      required
                      value={formData.placa}
                      onChange={(e) => setFormData({...formData, placa: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ano</label>
                    <input
                      type="number"
                      required
                      value={formData.ano}
                      onChange={(e) => setFormData({...formData, ano: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Marca</label>
                    <input
                      type="text"
                      required
                      value={formData.marca}
                      onChange={(e) => setFormData({...formData, marca: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Modelo</label>
                    <input
                      type="text"
                      required
                      value={formData.modelo}
                      onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacidade (kg)</label>
                    <input
                      type="number"
                      required
                      value={formData.capacidade}
                      onChange={(e) => setFormData({...formData, capacidade: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="input-field"
                    >
                      <option value="disponivel">Disponível</option>
                      <option value="em_uso">Em Uso</option>
                      <option value="manutencao">Manutenção</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Unidade de Negócio</label>
                  <select
                    value={formData.unidadeNegocio}
                    onChange={(e) => setFormData({...formData, unidadeNegocio: e.target.value})}
                    className="input-field"
                  >
                    <option value="frigorifico">Frigorífico</option>
                    <option value="ovos">Ovos</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Última Manutenção</label>
                    <input
                      type="date"
                      value={formData.ultimaManutencao}
                      onChange={(e) => setFormData({...formData, ultimaManutencao: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Próxima Manutenção</label>
                    <input
                      type="date"
                      value={formData.proximaManutencao}
                      onChange={(e) => setFormData({...formData, proximaManutencao: e.target.value})}
                      className="input-field"
                    />
                  </div>
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
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    {editingVeiculo ? 'Atualizar' : 'Cadastrar'}
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