import React, { useState } from "react";
import { Settings, Save, Bell, Shield, Database, Globe } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";
import { maskCelular, validateEmail, validateCelular } from "../../utils/masks";

const Configuracoes = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [perfilData, setPerfilData] = useState({
    displayName: userProfile?.displayName || "",
    email: userProfile?.email || "",
    telefone: userProfile?.telefone || "",
    cargo: userProfile?.cargo || "",
  });

  const [notificacoes, setNotificacoes] = useState({
    email: true,
    push: true,
    rotas: true,
    folgas: true,
    manutencao: true,
  });

  const [sistema, setSistema] = useState({
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    backup: true,
  });

  const validatePerfilForm = () => {
    const newErrors = {};

    // Validações específicas
    if (perfilData.email && !validateEmail(perfilData.email)) {
      newErrors.email = "Email inválido";
    }
    if (perfilData.telefone && !validateCelular(perfilData.telefone)) {
      newErrors.telefone = "Telefone inválido (formato: (73) 99999-9999)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();

    if (!validatePerfilForm()) {
      showNotification("Por favor, corrija os erros no formulário", "error");
      return;
    }

    setLoading(true);

    try {
      const perfilDataToSave = {
        ...perfilData,
        displayName: perfilData.displayName.toUpperCase(),
        cargo: perfilData.cargo.toUpperCase(),
      };

      await updateUserProfile(userProfile?.uid, perfilDataToSave);
      showNotification("Perfil atualizado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      showNotification("Erro ao atualizar perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificacoesChange = (key) => {
    setNotificacoes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSistemaChange = (key, value) => {
    setSistema((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const tabs = [
    { id: "perfil", name: "Perfil", icon: Settings },
    { id: "notificacoes", name: "Notificações", icon: Bell },
    { id: "sistema", name: "Sistema", icon: Database },
    { id: "seguranca", name: "Segurança", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
        <p className="mt-1 text-sm text-gray-500">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="mt-6">
        {activeTab === "perfil" && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Perfil do Usuário
            </h3>
            <form onSubmit={handlePerfilSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={perfilData.displayName}
                    onChange={(e) =>
                      setPerfilData({
                        ...perfilData,
                        displayName: e.target.value,
                      })
                    }
                    className="input-field"
                    placeholder="Digite seu nome completo"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O nome será salvo em maiúsculas automaticamente
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={perfilData.email}
                    onChange={(e) =>
                      setPerfilData({ ...perfilData, email: e.target.value })
                    }
                    className={`input-field ${errors.email ? "border-red-500" : ""}`}
                    placeholder="exemplo@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={perfilData.telefone}
                    onChange={(e) =>
                      setPerfilData({
                        ...perfilData,
                        telefone: maskCelular(e.target.value),
                      })
                    }
                    className={`input-field ${errors.telefone ? "border-red-500" : ""}`}
                    placeholder="(73) 99999-9999"
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.telefone}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cargo
                  </label>
                  <input
                    type="text"
                    value={perfilData.cargo}
                    onChange={(e) =>
                      setPerfilData({ ...perfilData, cargo: e.target.value })
                    }
                    className="input-field"
                    placeholder="Ex: Gerente, Analista..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O cargo será salvo em maiúsculas automaticamente
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "notificacoes" && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configurações de Notificações
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Notificações por Email
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receber notificações importantes por email
                  </p>
                </div>
                <button
                  onClick={() => handleNotificacoesChange("email")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacoes.email ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacoes.email ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Notificações Push
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receber notificações no navegador
                  </p>
                </div>
                <button
                  onClick={() => handleNotificacoesChange("push")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacoes.push ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacoes.push ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Novas Rotas
                  </h4>
                  <p className="text-sm text-gray-500">
                    Notificar sobre novas rotas atribuídas
                  </p>
                </div>
                <button
                  onClick={() => handleNotificacoesChange("rotas")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacoes.rotas ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacoes.rotas ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Solicitações de Folga
                  </h4>
                  <p className="text-sm text-gray-500">
                    Notificar sobre solicitações de folga
                  </p>
                </div>
                <button
                  onClick={() => handleNotificacoesChange("folgas")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacoes.folgas ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacoes.folgas ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Manutenção de Veículos
                  </h4>
                  <p className="text-sm text-gray-500">
                    Alertas sobre manutenção programada
                  </p>
                </div>
                <button
                  onClick={() => handleNotificacoesChange("manutencao")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notificacoes.manutencao ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notificacoes.manutencao
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "sistema" && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Configurações do Sistema
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Idioma
                </label>
                <select
                  value={sistema.idioma}
                  disabled
                  className="input-field bg-gray-100 cursor-not-allowed"
                >
                  <option value="pt-BR">Português (Brasil)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Idioma fixo em português brasileiro
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Fuso Horário
                </label>
                <select
                  value={sistema.timezone}
                  onChange={(e) =>
                    handleSistemaChange("timezone", e.target.value)
                  }
                  className="input-field"
                >
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                  <option value="America/Manaus">Manaus (GMT-4)</option>
                  <option value="America/Belem">Belém (GMT-3)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">
                    Backup Automático
                  </h4>
                  <p className="text-sm text-gray-500">
                    Fazer backup automático dos dados
                  </p>
                </div>
                <button
                  onClick={() => handleSistemaChange("backup", !sistema.backup)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sistema.backup ? "bg-primary-600" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      sistema.backup ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "seguranca" && (
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Segurança
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Segurança da Conta
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Para alterar sua senha, entre em contato com o
                        administrador do sistema.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Globe className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Informações de Sessão
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Último login:{" "}
                        {userProfile?.lastLogin
                          ? new Date(
                              userProfile.lastLogin.toDate()
                            ).toLocaleString("pt-BR")
                          : "N/A"}
                      </p>
                      <p>IP: 192.168.1.100</p>
                      <p>Dispositivo: Chrome - Windows</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button className="btn-secondary">
                  Encerrar Todas as Sessões
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Configuracoes;
