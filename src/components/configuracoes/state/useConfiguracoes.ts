import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNotification } from "../../../contexts/NotificationContext";
import { validateEmail, validateCelular } from "../../../utils/masks";
import type {
  PerfilData,
  NotificacoesConfig,
  SistemaConfig,
  FormErrors,
} from "../types";

export const useConfiguracoes = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const { showNotification } = useNotification();

  const [activeTab, setActiveTab] = useState("perfil");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [configLoaded, setConfigLoaded] = useState(false);

  const [perfilData, setPerfilData] = useState<PerfilData>({
    displayName: userProfile?.displayName || "",
    email: userProfile?.email || "",
    telefone: userProfile?.telefone || "",
    cargo: userProfile?.cargo || "",
  });

  const [notificacoes, setNotificacoes] = useState<NotificacoesConfig>({
    email: userProfile?.notificacoes?.email ?? false, // Desabilitado - não implementado
    push: userProfile?.notificacoes?.push ?? true, // Habilitado - toast notifications funcionam
    rotas: userProfile?.notificacoes?.rotas ?? true, // Habilitado - implementado
    folgas: userProfile?.notificacoes?.folgas ?? true, // Habilitado - implementado
    manutencao: userProfile?.notificacoes?.manutencao ?? true, // Habilitado - implementado
  });

  const [sistema, setSistema] = useState<SistemaConfig>({
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    backup: false, // Desabilitado - não implementado
  });

  // Carregar configurações apenas uma vez quando userProfile estiver disponível
  useEffect(() => {
    if (userProfile && !configLoaded) {
      if (!userProfile.notificacoes) {
        // Definir valores padrão se não existirem configurações salvas
        setNotificacoes({
          email: false, // Desabilitado - não implementado
          push: true, // Habilitado - toast notifications funcionam
          rotas: true, // Habilitado - implementado
          folgas: true, // Habilitado - implementado
          manutencao: true, // Habilitado - implementado
        });
      } else {
        // Carregar configurações salvas do usuário
        setNotificacoes({
          email: userProfile.notificacoes.email ?? false,
          push: userProfile.notificacoes.push ?? true,
          rotas: userProfile.notificacoes.rotas ?? true,
          folgas: userProfile.notificacoes.folgas ?? true,
          manutencao: userProfile.notificacoes.manutencao ?? true,
        });
      }
      setConfigLoaded(true);
    }
  }, [userProfile, configLoaded]);

  const validatePerfilForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    if (perfilData.email && !validateEmail(perfilData.email)) {
      newErrors.email = "Email inválido";
    }
    if (perfilData.telefone && !validateCelular(perfilData.telefone)) {
      newErrors.telefone = "Telefone inválido (formato: (73) 99999-9999)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [perfilData]);

  const handlePerfilSubmit = useCallback(
    async (data: PerfilData) => {
      if (!validatePerfilForm()) {
        showNotification("Por favor, corrija os erros no formulário", "error");
        return;
      }

      setLoading(true);

      try {
        const perfilDataToSave = {
          ...data,
          displayName: data.displayName.toUpperCase(),
          cargo: data.cargo.toUpperCase(),
          // Incluir configurações de notificações
          notificacoes,
        };

        await updateUserProfile(userProfile?.uid, perfilDataToSave);
        showNotification(
          "Perfil e configurações atualizados com sucesso!",
          "success",
        );
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        showNotification("Erro ao atualizar perfil", "error");
      } finally {
        setLoading(false);
      }
    },
    [
      validatePerfilForm,
      showNotification,
      updateUserProfile,
      userProfile?.uid,
      notificacoes,
    ],
  );

  const handlePerfilChange = useCallback(
    (field: keyof PerfilData, value: string) => {
      setPerfilData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const handleNotificacoesChange = useCallback(
    (key: keyof NotificacoesConfig) => {
      // Não permitir alterar email (desabilitado)
      if (key === "email") {
        showNotification("Notificações por email em breve!", "info");
        return;
      }

      // Apenas alterar o estado local (não salva automaticamente)
      setNotificacoes((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [showNotification],
  );

  const handleSistemaChange = useCallback(
    (key: keyof SistemaConfig, value: any) => {
      setSistema((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  return {
    activeTab,
    setActiveTab,
    loading,
    errors,
    perfilData,
    notificacoes,
    sistema,
    handlePerfilSubmit,
    handlePerfilChange,
    handleNotificacoesChange,
    handleSistemaChange,
  };
};

export default useConfiguracoes;
