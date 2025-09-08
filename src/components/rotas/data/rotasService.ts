import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Rota, RotaFormData } from "../types";
import { DateService } from "../../../services/DateService";
import { NotificationService } from "../../../services/notificationService";

const COLLECTION_NAME = "rotas";

export const rotasService = {
  async getAll(): Promise<Rota[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("dataCriacao", "desc"),
      );
      const snapshot = await getDocs(q);
      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dataCriacao: doc.data().dataCriacao?.toDate() || new Date(),
        dataAtualizacao: doc.data().dataAtualizacao?.toDate() || new Date(),
      })) as Rota[];
      return result;
    } catch (error) {
      console.error("Erro ao buscar rotas:", error);
      throw new Error("Erro ao carregar rotas");
    }
  },

  async getById(id: string): Promise<Rota | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          dataCriacao: data.dataCriacao?.toDate() || new Date(),
          dataAtualizacao: data.dataAtualizacao?.toDate() || new Date(),
        } as Rota;
      }
      return null;
    } catch (error) {
      console.error("Erro ao buscar rota:", error);
      throw new Error("Erro ao carregar rota");
    }
  },

  async create(rotaData: RotaFormData): Promise<string> {
    try {
      const normalizedData = {
        ...rotaData,
        dataCriacao: DateService.getServerTimestamp(),
        dataAtualizacao: DateService.getServerTimestamp(),
      };

      const docRef = await addDoc(
        collection(db, COLLECTION_NAME),
        normalizedData,
      );

      // Enviar notificação sobre nova rota
      try {
        await NotificationService.notifyNewRota({
          origem: rotaData.nome || "Não informado",
          destino: "Rota criada",
          id: docRef.id,
        });
      } catch (notificationError) {
        console.error("Erro ao enviar notificação:", notificationError);
        // Não falha a criação da rota se a notificação falhar
      }

      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar rota:", error);
      throw new Error("Erro ao criar rota");
    }
  },

  async update(id: string, rotaData: Partial<RotaFormData>): Promise<void> {
    try {
      const normalizedData: any = {
        ...rotaData,
        dataAtualizacao: DateService.getServerTimestamp(),
      };

      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, normalizedData);
    } catch (error) {
      console.error("Erro ao atualizar rota:", error);
      throw new Error("Erro ao atualizar rota");
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Erro ao excluir rota:", error);
      throw new Error("Erro ao excluir rota");
    }
  },

  async updateCidadesVinculadas(
    rotaId: string,
    cidadeId: string,
    adicionar: boolean,
  ): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, rotaId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.warn(
          `Rota ${rotaId} não encontrada. Pulando atualização de cidades.`,
        );
        return; // Rota não existe mais, não é um erro crítico
      }

      const rotaData = docSnap.data();
      const cidadesAtuais = rotaData.cidades || [];

      let novasCidades;
      if (adicionar) {
        // Adicionar cidade se não estiver já na lista
        if (!cidadesAtuais.includes(cidadeId)) {
          novasCidades = [...cidadesAtuais, cidadeId];
        } else {
          return; // Cidade já está vinculada
        }
      } else {
        // Remover cidade da lista
        novasCidades = cidadesAtuais.filter((id) => id !== cidadeId);
      }

      await updateDoc(docRef, {
        cidades: novasCidades,
        dataAtualizacao: DateService.getServerTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao atualizar cidades vinculadas:", error);
      // Não relançar o erro para não quebrar a exclusão da cidade
      console.warn(
        "Continuando com a exclusão da cidade mesmo com erro na rota",
      );
    }
  },

  async getByDiaSemana(diaSemana: string): Promise<Rota[]> {
    try {
      // Busca rotas que contenham o dia da semana especificado no array
      const q = query(
        collection(db, COLLECTION_NAME),
        where("diaSemana", "array-contains", diaSemana),
        orderBy("dataCriacao", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        dataCriacao: doc.data().dataCriacao?.toDate() || new Date(),
        dataAtualizacao: doc.data().dataAtualizacao?.toDate() || new Date(),
      })) as Rota[];
    } catch (error) {
      console.error("Erro ao buscar rotas por dia da semana:", error);
      throw new Error("Erro ao carregar rotas por dia da semana");
    }
  },
};
