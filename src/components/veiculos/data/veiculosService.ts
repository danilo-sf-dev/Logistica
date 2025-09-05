import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Veiculo, VeiculoFormData } from "../types";
import { DateService } from "../../../services/DateService";

export class VeiculosService {
  private static collectionName = "veiculos";

  static async getVeiculos(): Promise<Veiculo[]> {
    try {
      const q = query(
        collection(db, this.collectionName),
        orderBy("dataCriacao", "desc"),
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Veiculo[];
    } catch (error) {
      console.error("Erro ao buscar veículos:", error);
      throw new Error("Erro ao carregar veículos");
    }
  }

  static async getVeiculosByFilters(filters: {
    status?: string;
    tipoCarroceria?: string;
    tipoBau?: string;
    unidadeNegocio?: string;
  }): Promise<Veiculo[]> {
    try {
      let q = query(collection(db, this.collectionName));

      if (filters.status) {
        q = query(q, where("status", "==", filters.status));
      }
      if (filters.tipoCarroceria) {
        q = query(q, where("tipoCarroceria", "==", filters.tipoCarroceria));
      }
      if (filters.tipoBau) {
        q = query(q, where("tipoBau", "==", filters.tipoBau));
      }
      if (filters.unidadeNegocio) {
        q = query(q, where("unidadeNegocio", "==", filters.unidadeNegocio));
      }

      q = query(q, orderBy("dataCriacao", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Veiculo[];
    } catch (error) {
      console.error("Erro ao buscar veículos com filtros:", error);
      throw new Error("Erro ao carregar veículos");
    }
  }

  static async createVeiculo(veiculoData: VeiculoFormData): Promise<string> {
    try {
      // Verificar se a placa já existe
      const placaExists = await this.checkPlacaExists(veiculoData.placa);
      if (placaExists) {
        throw new Error(
          `Veículo com placa ${veiculoData.placa.toUpperCase()} já está cadastrado no sistema`,
        );
      }

      const payload: any = {
        ...veiculoData,
        placa: veiculoData.placa.toUpperCase(),
        modelo: veiculoData.modelo?.toUpperCase() || "",
        marca: veiculoData.marca.toUpperCase(),
        dataCriacao: DateService.getServerTimestamp(),
        dataAtualizacao: DateService.getServerTimestamp(),
      };

      // ✅ Adicionar campos de manutenção apenas se tiverem valor
      if (veiculoData.ultimaManutencao) {
        payload.ultimaManutencao = DateService.normalizeForFirebase(
          veiculoData.ultimaManutencao,
        );
      }

      if (veiculoData.proximaManutencao) {
        payload.proximaManutencao = DateService.normalizeForFirebase(
          veiculoData.proximaManutencao,
        );
      }

      const docRef = await addDoc(collection(db, this.collectionName), payload);
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
      throw error; // Re-throw para manter a mensagem original
    }
  }

  static async updateVeiculo(
    id: string,
    veiculoData: Partial<VeiculoFormData>,
  ): Promise<void> {
    try {
      const updateData: any = {
        ...veiculoData,
        dataAtualizacao: DateService.getServerTimestamp(),
      };

      if (veiculoData.placa) {
        updateData.placa = veiculoData.placa.toUpperCase();
      }
      if (veiculoData.modelo !== undefined) {
        updateData.modelo = veiculoData.modelo.toUpperCase();
      }
      if (veiculoData.marca) {
        updateData.marca = veiculoData.marca.toUpperCase();
      }

      // ✅ Adicionar campos de manutenção apenas se tiverem valor
      if (veiculoData.ultimaManutencao) {
        updateData.ultimaManutencao = DateService.normalizeForFirebase(
          veiculoData.ultimaManutencao,
        );
      }

      if (veiculoData.proximaManutencao) {
        updateData.proximaManutencao = DateService.normalizeForFirebase(
          veiculoData.proximaManutencao,
        );
      }

      await updateDoc(doc(db, this.collectionName, id), updateData);
    } catch (error) {
      console.error("Erro ao atualizar veículo:", error);
      throw new Error("Erro ao atualizar veículo");
    }
  }

  static async deleteVeiculo(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.collectionName, id));
    } catch (error) {
      console.error("Erro ao excluir veículo:", error);
      throw new Error("Erro ao excluir veículo");
    }
  }

  static async toggleVeiculoStatus(
    id: string,
    novoStatus: string,
  ): Promise<void> {
    try {
      await updateDoc(doc(db, this.collectionName, id), {
        status: novoStatus,
        dataAtualizacao: DateService.getServerTimestamp(),
      });
    } catch (error) {
      console.error("Erro ao alterar status do veículo:", error);
      throw new Error("Erro ao alterar status do veículo");
    }
  }

  static async checkPlacaExists(
    placa: string,
    excludeId?: string,
  ): Promise<boolean> {
    try {
      const q = query(
        collection(db, this.collectionName),
        where("placa", "==", placa.toUpperCase()),
      );
      const snapshot = await getDocs(q);

      if (excludeId) {
        return snapshot.docs.some((doc) => doc.id !== excludeId);
      }

      return !snapshot.empty;
    } catch (error) {
      console.error("Erro ao verificar placa:", error);
      return false;
    }
  }
}
