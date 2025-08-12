import { useState, useCallback } from "react";
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

  const [perfilData, setPerfilData] = useState<PerfilData>({
    displayName: userProfile?.displayName || "",
    email: userProfile?.email || "",
    telefone: userProfile?.telefone || "",
    cargo: userProfile?.cargo || "",
  });

  const [notificacoes, setNotificacoes] = useState<NotificacoesConfig>({
    email: true,
    push: true,
    rotas: true,
    folgas: true,
    manutencao: true,
  });

  const [sistema, setSistema] = useState<SistemaConfig>({
    idioma: "pt-BR",
    timezone: "America/Sao_Paulo",
    backup: true,
  });

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
        };

        await updateUserProfile(userProfile?.uid, perfilDataToSave);
        showNotification("Perfil atualizado com sucesso!", "success");
      } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        showNotification("Erro ao atualizar perfil", "error");
      } finally {
        setLoading(false);
      }
    },
    [validatePerfilForm, showNotification, updateUserProfile, userProfile?.uid],
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
      setNotificacoes((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [],
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
