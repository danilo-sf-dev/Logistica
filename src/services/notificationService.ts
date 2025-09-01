import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { toast } from "react-hot-toast";

export interface NotificationConfig {
  email: boolean;
  push: boolean;
  rotas: boolean;
  folgas: boolean;
  manutencao: boolean;
}

export interface NotificationData {
  id: string;
  type: "funcionario" | "rota" | "folga" | "veiculo" | "sistema";
  title: string;
  message: string;
  userId?: string;
  targetUsers?: string[];
  createdAt: Date;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export class NotificationService {
  // Criar notificação no Firestore
  static async createNotification(
    data: Omit<NotificationData, "id" | "createdAt" | "read">
  ): Promise<void> {
    try {
      // Buscar usuários que devem receber a notificação
      const usersToNotify = await this.getUsersToNotify(data);

      // Criar notificação para cada usuário elegível
      for (const user of usersToNotify) {
        const notificationRef = doc(collection(db, "notificacoes"));
        const notification: NotificationData = {
          ...data,
          id: notificationRef.id,
          createdAt: new Date(),
          read: false,
          userId: user.id, // Associar ao usuário específico
          targetUsers: [user.id], // Lista de usuários que devem ver
        };

        await setDoc(notificationRef, notification);

        // Enviar notificação imediata (toast)
        await this.sendNotificationToUser(user, notification);
      }
    } catch (error) {
      console.error("Erro ao criar notificação:", error);
      throw error;
    }
  }

  // Buscar usuários que devem receber a notificação
  static async getUsersToNotify(
    notificationData: Omit<NotificationData, "id" | "createdAt" | "read">
  ): Promise<any[]> {
    try {
      const usersRef = collection(db, "users");
      const usersQuery = query(
        usersRef,
        where("role", "in", ["admin", "gerente"])
      );
      const usersSnapshot = await getDocs(usersQuery);

      const users: any[] = [];
      usersSnapshot.forEach((doc) => {
        const userData = doc.data();

        // Verificar se o usuário tem notificações habilitadas para este tipo
        if (this.shouldNotifyUser(userData, notificationData)) {
          users.push({ id: doc.id, ...userData });
        }
      });

      return users;
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return [];
    }
  }

  // Verificar se usuário deve receber a notificação
  static shouldNotifyUser(
    userData: any,
    notificationData: Omit<NotificationData, "id" | "createdAt" | "read">
  ): boolean {
    const notificacoes = userData.notificacoes || {};

    switch (notificationData.type) {
      case "rota":
        return notificacoes.rotas !== false;
      case "folga":
        return notificacoes.folgas !== false;
      case "veiculo":
        return notificacoes.manutencao !== false;
      case "funcionario":
        return notificacoes.funcionarios !== false;
      default:
        return true;
    }
  }

  // Enviar notificação para um usuário específico
  static async sendNotificationToUser(
    user: any,
    notification: NotificationData
  ): Promise<void> {
    try {
      const notificacoes = user.notificacoes || {};

      // Enviar notificação push se habilitada
      if (notificacoes.push && user.fcmToken) {
        await this.sendPushNotification(user.fcmToken, notification);
      }

      // Enviar email se habilitado
      if (notificacoes.email && user.email) {
        await this.sendEmailNotification(user.email, notification);
      }
    } catch (error) {
      console.error("Erro ao enviar notificação para usuário:", error);
    }
  }

  // Enviar notificação push (FCM)
  static async sendPushNotification(
    fcmToken: string,
    notification: NotificationData
  ): Promise<void> {
    try {
      // Aqui você pode integrar com Firebase Functions para enviar FCM
      // Por enquanto, vamos apenas mostrar um toast
      toast.success(`${notification.title}: ${notification.message}`, {
        duration: 5000,
        position: "top-right",
      });
    } catch (error) {
      console.error("Erro ao enviar push notification:", error);
    }
  }

  // Enviar notificação por email
  static async sendEmailNotification(
    email: string,
    notification: NotificationData
  ): Promise<void> {
    try {
      // Aqui você pode integrar com Firebase Functions para enviar email
      // Por enquanto, vamos apenas logar
      console.log(`Email enviado para ${email}:`, {
        subject: notification.title,
        body: notification.message,
      });
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }
  }

  // Notificações específicas por tipo
  static async notifyNewFuncionario(funcionarioData: any): Promise<void> {
    await this.createNotification({
      type: "funcionario",
      title: "Novo Funcionário Cadastrado",
      message: `Funcionário ${funcionarioData.nome} foi cadastrado no sistema.`,
      priority: "medium",
    });
  }

  static async notifyNewRota(rotaData: any): Promise<void> {
    await this.createNotification({
      type: "rota",
      title: "Nova Rota Criada",
      message: `Rota de ${rotaData.origem} para ${rotaData.destino} foi criada.`,
      priority: "high",
    });
  }

  static async notifyNewFolga(folgaData: any): Promise<void> {
    await this.createNotification({
      type: "folga",
      title: "Nova Solicitação de Folga",
      message: `Solicitação de folga para ${folgaData.funcionarioNome} em ${folgaData.data}.`,
      priority: "medium",
    });
  }

  static async notifyVeiculoManutencao(veiculoData: any): Promise<void> {
    await this.createNotification({
      type: "veiculo",
      title: "Manutenção de Veículo",
      message: `Veículo ${veiculoData.placa} precisa de manutenção.`,
      priority: "high",
    });
  }

  // Buscar notificações do usuário
  static async getUserNotifications(
    userId: string
  ): Promise<NotificationData[]> {
    try {
      // ========================================
      // DEBUG: Informações de Autenticação
      // ========================================
      console.log("🔍 DEBUG: Iniciando busca de notificações");
      console.log("👤 User ID recebido:", userId);
      console.log("🔐 Auth State:", auth.currentUser);
      console.log("🆔 Current User UID:", auth.currentUser?.uid);
      console.log("✅ Usuário autenticado:", !!auth.currentUser);

      // Verificar se o userId recebido é válido
      if (!userId || userId.trim() === "") {
        console.error("❌ ERROR: User ID inválido ou vazio");
        return [];
      }

      // Verificar se o usuário está autenticado
      if (!auth.currentUser) {
        console.error("❌ ERROR: Usuário não está autenticado");
        return [];
      }

      // Verificar se o userId recebido é igual ao UID autenticado
      if (userId !== auth.currentUser.uid) {
        console.warn("⚠️ WARNING: User ID diferente do UID autenticado");
        console.log("📝 User ID recebido:", userId);
        console.log("🔑 UID autenticado:", auth.currentUser.uid);
      }

      // ========================================
      // DEBUG: Configuração da Query
      // ========================================
      console.log("📚 DEBUG: Configurando query do Firestore");
      console.log("🏷️ Coleção:", "notificacoes");
      console.log("🔍 Campo de busca:", "targetUsers");
      console.log("🎯 Valor buscado:", userId);

      const notificationsRef = collection(db, "notificacoes");
      const notificationsQuery = query(
        notificationsRef,
        where("targetUsers", "array-contains", userId)
      );

      console.log("📋 Query configurada:", notificationsQuery);

      // ========================================
      // DEBUG: Executando Query
      // ========================================
      console.log("🚀 DEBUG: Executando query no Firestore...");

      const snapshot = await getDocs(notificationsQuery);

      console.log("📊 DEBUG: Query executada com sucesso!");
      console.log("📈 Número de documentos encontrados:", snapshot.size);
      console.log(
        "📄 Documentos:",
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );

      const notifications: NotificationData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Converter o timestamp do Firestore para Date
        const createdAt = data.createdAt?.toDate
          ? data.createdAt.toDate()
          : new Date(data.createdAt);

        notifications.push({
          id: doc.id,
          ...data,
          createdAt,
        } as NotificationData);
      });

      console.log("✅ DEBUG: Notificações processadas com sucesso");
      console.log("🎉 Total de notificações retornadas:", notifications.length);

      return notifications.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    } catch (error) {
      // ========================================
      // DEBUG: Tratamento de Erro Detalhado
      // ========================================
      console.error("❌ ERROR: Erro ao buscar notificações");
      console.error("📝 Tipo do erro:", error.constructor.name);
      console.error("🔍 Mensagem do erro:", error.message);
      console.error("📊 Código do erro:", error.code);
      console.error("🏷️ Coleção tentada:", "notificacoes");
      console.error("👤 User ID usado:", userId);
      console.error("🔐 Auth State no erro:", auth.currentUser);
      console.error("🆔 UID autenticado no erro:", auth.currentUser?.uid);

      // Log adicional para erros do Firebase
      if (error.code) {
        console.error("🔥 Firebase Error Code:", error.code);
        console.error("🔥 Firebase Error Details:", error);
      }

      return [];
    }
  }

  // Marcar notificação como lida
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, "notificacoes", notificationId);
      await setDoc(notificationRef, { read: true }, { merge: true });
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  }
}

export default NotificationService;
