import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import type { Cidade, CidadeInput } from "../types";
import { rotasService } from "../../rotas/data/rotasService";

const COLLECTION = "cidades";

async function listar(): Promise<Cidade[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Cidade, "id">),
  }));
}

async function getById(id: string): Promise<Cidade | null> {
  try {
    const cidadeSnap = await getDocs(collection(db, COLLECTION));
    const cidade = cidadeSnap.docs.find((d) => d.id === id);

    if (!cidade) return null;

    return {
      id: cidade.id,
      ...(cidade.data() as Omit<Cidade, "id">),
    };
  } catch (error) {
    console.error("Erro ao buscar cidade por ID:", error);
    return null;
  }
}

async function criar(input: CidadeInput): Promise<string> {
  const payload = {
    ...input,
    distancia: input.distancia ? Number(input.distancia) : null,
    pesoMinimo: input.pesoMinimo ? Number(input.pesoMinimo) : null,
    rotaId: input.rotaId || null,
    dataCriacao: serverTimestamp(),
    dataAtualizacao: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);

  // Se uma rota foi vinculada, atualizar a lista de cidades da rota
  if (input.rotaId) {
    try {
      await rotasService.updateCidadesVinculadas(input.rotaId, ref.id, true);
    } catch (error) {
      console.error("Erro ao vincular cidade à rota:", error);
      // Não falhar a criação da cidade se o vínculo falhar
    }
  }

  return ref.id;
}

async function atualizar(id: string, input: CidadeInput): Promise<void> {
  // Buscar a cidade atual para comparar o rotaId
  const cidadeRef = doc(db, COLLECTION, id);
  const cidadeSnap = await getDocs(collection(db, COLLECTION));
  const cidadeAtual = cidadeSnap.docs.find((d) => d.id === id);
  const rotaIdAnterior = cidadeAtual?.data()?.rotaId;

  const payload = {
    ...input,
    distancia: input.distancia ? Number(input.distancia) : null,
    pesoMinimo: input.pesoMinimo ? Number(input.pesoMinimo) : null,
    rotaId: input.rotaId || null,
    dataAtualizacao: serverTimestamp(),
  };

  await updateDoc(cidadeRef, payload);

  // Gerenciar vínculos com rotas
  try {
    // Se havia uma rota vinculada anteriormente e agora não há, remover da rota
    if (rotaIdAnterior && !input.rotaId) {
      await rotasService.updateCidadesVinculadas(rotaIdAnterior, id, false);
    }
    // Se havia uma rota vinculada anteriormente e agora há uma diferente, trocar
    else if (
      rotaIdAnterior &&
      input.rotaId &&
      rotaIdAnterior !== input.rotaId
    ) {
      await rotasService.updateCidadesVinculadas(rotaIdAnterior, id, false);
      await rotasService.updateCidadesVinculadas(input.rotaId, id, true);
    }
    // Se não havia rota vinculada e agora há, adicionar à nova rota
    else if (!rotaIdAnterior && input.rotaId) {
      await rotasService.updateCidadesVinculadas(input.rotaId, id, true);
    }
  } catch (error) {
    console.error("Erro ao gerenciar vínculos com rotas:", error);
    // Não falhar a atualização da cidade se o vínculo falhar
  }
}

async function excluir(id: string): Promise<void> {
  // Buscar a cidade antes de excluir para verificar se tem rota vinculada
  const cidadeRef = doc(db, COLLECTION, id);
  const cidadeSnap = await getDocs(collection(db, COLLECTION));
  const cidadeAtual = cidadeSnap.docs.find((d) => d.id === id);
  const rotaIdVinculada = cidadeAtual?.data()?.rotaId;

  // Excluir a cidade
  await deleteDoc(cidadeRef);

  // Se havia uma rota vinculada, remover da lista de cidades da rota
  if (rotaIdVinculada) {
    try {
      await rotasService.updateCidadesVinculadas(rotaIdVinculada, id, false);
    } catch (error) {
      console.error("Erro ao remover vínculo com rota:", error);
      // Não falhar a exclusão da cidade se o vínculo falhar
    }
  }
}

export const cidadesService = { listar, getById, criar, atualizar, excluir };
