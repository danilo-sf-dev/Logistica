import React, { useState, useEffect, useCallback } from "react";
import { Download, Users, Map, Truck, Calendar } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";
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
  Cell,
} from "recharts";

const Relatorios = () => {
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");
  const [dadosMotoristas, setDadosMotoristas] = useState([]);
  const [dadosVeiculos, setDadosVeiculos] = useState([]);
  const [dadosRotas, setDadosRotas] = useState([]);
  const [dadosFolgas, setDadosFolgas] = useState([]);

  const fetchRelatorios = useCallback(async () => {
    setLoading(true);
    try {
      // Buscar dados dos motoristas
      const motoristasSnapshot = await getDocs(collection(db, "motoristas"));
      const motoristasData = motoristasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Buscar dados dos veículos
      const veiculosSnapshot = await getDocs(collection(db, "veiculos"));
      const veiculosData = veiculosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Buscar dados das rotas
      const rotasSnapshot = await getDocs(collection(db, "rotas"));
      const rotasData = rotasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Buscar dados das folgas
      const folgasSnapshot = await getDocs(collection(db, "folgas"));
      const folgasData = folgasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Processar dados para relatórios
      processarDadosMotoristas(motoristasData);
      processarDadosVeiculos(veiculosData);
      processarDadosRotas(rotasData);
      processarDadosFolgas(folgasData);

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar dados para relatórios:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRelatorios();
  }, [fetchRelatorios]);

  const processarDadosMotoristas = (motoristas) => {
    const statusCount = motoristas.reduce((acc, motorista) => {
      const status = motorista.status || "disponivel";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const dados = [
      {
        name: "Trabalhando",
        value: statusCount.trabalhando || 0,
        color: "#10B981",
      },
      {
        name: "Disponível",
        value: statusCount.disponivel || 0,
        color: "#3B82F6",
      },
      { name: "Folga", value: statusCount.folga || 0, color: "#F59E0B" },
      { name: "Férias", value: statusCount.ferias || 0, color: "#EF4444" },
    ];

    setDadosMotoristas(dados);
  };

  const processarDadosVeiculos = (veiculos) => {
    const statusCount = veiculos.reduce((acc, veiculo) => {
      const status = veiculo.status || "disponivel";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const dados = [
      {
        name: "Disponível",
        value: statusCount.disponivel || 0,
        color: "#10B981",
      },
      { name: "Em Uso", value: statusCount.em_uso || 0, color: "#3B82F6" },
      {
        name: "Manutenção",
        value: statusCount.manutencao || 0,
        color: "#F59E0B",
      },
      { name: "Inativo", value: statusCount.inativo || 0, color: "#EF4444" },
    ];

    setDadosVeiculos(dados);
  };

  const processarDadosRotas = (rotas) => {
    const statusCount = rotas.reduce((acc, rota) => {
      const status = rota.status || "agendada";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const dados = [
      { name: "Agendada", value: statusCount.agendada || 0, color: "#3B82F6" },
      {
        name: "Em Andamento",
        value: statusCount.em_andamento || 0,
        color: "#F59E0B",
      },
      {
        name: "Concluída",
        value: statusCount.concluida || 0,
        color: "#10B981",
      },
      {
        name: "Cancelada",
        value: statusCount.cancelada || 0,
        color: "#EF4444",
      },
    ];

    setDadosRotas(dados);
  };

  const processarDadosFolgas = (folgas) => {
    const statusCount = folgas.reduce((acc, folga) => {
      const status = folga.status || "pendente";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const dados = [
      { name: "Pendente", value: statusCount.pendente || 0, color: "#F59E0B" },
      { name: "Aprovada", value: statusCount.aprovada || 0, color: "#10B981" },
      {
        name: "Rejeitada",
        value: statusCount.rejeitada || 0,
        color: "#EF4444",
      },
    ];

    setDadosFolgas(dados);
  };

  const handleDownload = (tipo) => {
    // Implementar download de relatórios
    console.log(`Download do relatório: ${tipo}`);
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
          <h1 className="text-2xl font-semibold text-gray-900">Relatórios</h1>
          <p className="mt-1 text-sm text-gray-500">
            Análise detalhada das operações de logística
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="input-field w-32"
          >
            <option value="semana">Semana</option>
            <option value="mes">Mês</option>
            <option value="trimestre">Trimestre</option>
            <option value="ano">Ano</option>
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Motoristas
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosMotoristas.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Veículos
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosVeiculos.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <Map className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rotas Ativas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosRotas.filter((item) => item.name === "Em Andamento")[0]
                  ?.value || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-500">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Folgas Pendentes
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {dadosFolgas.filter((item) => item.name === "Pendente")[0]
                  ?.value || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status dos Motoristas */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Status dos Motoristas
            </h3>
            <button
              onClick={() => handleDownload("motoristas")}
              className="text-primary-600 hover:text-primary-900"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosMotoristas}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosMotoristas.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status dos Veículos */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Status dos Veículos
            </h3>
            <button
              onClick={() => handleDownload("veiculos")}
              className="text-primary-600 hover:text-primary-900"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosVeiculos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosVeiculos.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status das Rotas */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Status das Rotas
            </h3>
            <button
              onClick={() => handleDownload("rotas")}
              className="text-primary-600 hover:text-primary-900"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosRotas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status das Folgas */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Status das Folgas
            </h3>
            <button
              onClick={() => handleDownload("folgas")}
              className="text-primary-600 hover:text-primary-900"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosFolgas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Relatórios Detalhados */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Relatórios Detalhados
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button
            onClick={() => handleDownload("motoristas_detalhado")}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Users className="h-6 w-6 text-primary-600 mr-2" />
            <span>Motoristas Detalhado</span>
          </button>

          <button
            onClick={() => handleDownload("veiculos_detalhado")}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Truck className="h-6 w-6 text-primary-600 mr-2" />
            <span>Veículos Detalhado</span>
          </button>

          <button
            onClick={() => handleDownload("rotas_detalhado")}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Map className="h-6 w-6 text-primary-600 mr-2" />
            <span>Rotas Detalhado</span>
          </button>

          <button
            onClick={() => handleDownload("folgas_detalhado")}
            className="flex items-center justify-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Calendar className="h-6 w-6 text-primary-600 mr-2" />
            <span>Folgas Detalhado</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
