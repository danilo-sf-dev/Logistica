import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Truck, 
  Route, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Clock,
  MapPin
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

const Dashboard = () => {
  const [stats, setStats] = useState({
    motoristas: 0,
    veiculos: 0,
    rotas: 0,
    folgas: 0
  });
  const [motoristasStatus, setMotoristasStatus] = useState([]);
  const [rotasData, setRotasData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar dados básicos
      const motoristasSnapshot = await getDocs(collection(db, 'motoristas'));
      const veiculosSnapshot = await getDocs(collection(db, 'veiculos'));
      const rotasSnapshot = await getDocs(collection(db, 'rotas'));
      const folgasSnapshot = await getDocs(collection(db, 'folgas'));

      setStats({
        motoristas: motoristasSnapshot.size,
        veiculos: veiculosSnapshot.size,
        rotas: rotasSnapshot.size,
        folgas: folgasSnapshot.size
      });

      // Buscar status dos motoristas
      const motoristasData = motoristasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const statusCount = motoristasData.reduce((acc, motorista) => {
        const status = motorista.status || 'disponivel';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const statusData = [
        { name: 'Trabalhando', value: statusCount.trabalhando || 0, color: '#10B981' },
        { name: 'Disponível', value: statusCount.disponivel || 0, color: '#3B82F6' },
        { name: 'Folga', value: statusCount.folga || 0, color: '#F59E0B' },
        { name: 'Férias', value: statusCount.ferias || 0, color: '#EF4444' }
      ];

      setMotoristasStatus(statusData);

      // Dados de rotas para gráfico
      const rotasData = rotasSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const rotasPorDia = rotasData.reduce((acc, rota) => {
        const data = new Date(rota.dataCriacao?.toDate()).toLocaleDateString('pt-BR');
        acc[data] = (acc[data] || 0) + 1;
        return acc;
      }, {});

      const rotasChartData = Object.entries(rotasPorDia).map(([data, quantidade]) => ({
        data,
        quantidade
      }));

      setRotasData(rotasChartData);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar dados do dashboard:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center mt-1">
              {trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <span className={`ml-1 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
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
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Visão geral das operações de logística
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Motoristas"
          value={stats.motoristas}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Veículos"
          value={stats.veiculos}
          icon={Truck}
          color="bg-green-500"
        />
        <StatCard
          title="Rotas Ativas"
          value={stats.rotas}
          icon={Route}
          color="bg-purple-500"
        />
        <StatCard
          title="Folgas Pendentes"
          value={stats.folgas}
          icon={Calendar}
          color="bg-orange-500"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status dos Motoristas */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Status dos Motoristas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={motoristasStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {motoristasStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rotas por Dia */}
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rotas Criadas por Dia</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rotasData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantidade" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Atividades Recentes */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Atividades Recentes</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Route className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Nova rota criada para São Paulo
              </p>
              <p className="text-sm text-gray-500">
                Motorista João Silva - 2 horas atrás
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Folga aprovada para Maria Santos
              </p>
              <p className="text-sm text-gray-500">
                15/01/2025 - 4 horas atrás
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-purple-600" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                Veículo ABC-1234 em manutenção
              </p>
              <p className="text-sm text-gray-500">
                Retorno previsto: 18/01/2025 - 6 horas atrás
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 