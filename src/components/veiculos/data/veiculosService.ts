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
      const docRef = await addDoc(collection(db, this.collectionName), {
        ...veiculoData,
        placa: veiculoData.placa.toUpperCase(),
        modelo: veiculoData.modelo?.toUpperCase() || "",
        marca: veiculoData.marca.toUpperCase(),
        dataCriacao: new Date(),
        dataAtualizacao: new Date(),
      });
      return docRef.id;
    } catch (error) {
      console.error("Erro ao criar veículo:", error);
      throw new Error("Erro ao criar veículo");
    }
  }

  static async updateVeiculo(
    id: string,
    veiculoData: Partial<VeiculoFormData>,
  ): Promise<void> {
    try {
      const updateData = {
        ...veiculoData,
        dataAtualizacao: new Date(),
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
        dataAtualizacao: new Date(),
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
