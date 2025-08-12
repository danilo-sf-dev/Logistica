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
import type { Folga, FolgaInput } from "../types";

const COLLECTION = "folgas";

async function listar(): Promise<Folga[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();

    // Migração: se ainda tem o campo 'motorista' antigo, converter para o novo formato
    if (data.motorista && !data.funcionarioId) {
      return {
        id: d.id,
        ...data,
        funcionarioId: "", // Campo vazio para dados antigos
        funcionarioNome: data.motorista, // Usar o nome do motorista como funcionarioNome
      } as Folga;
    }

    return {
      id: d.id,
      ...(data as Omit<Folga, "id">),
    };
  });
}

async function criar(input: FolgaInput): Promise<string> {
  const payload = {
    ...input,
    dataCriacao: serverTimestamp(),
    dataAtualizacao: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

async function atualizar(id: string, input: FolgaInput): Promise<void> {
  const payload = {
    ...input,
    dataAtualizacao: serverTimestamp(),
  };
  await updateDoc(doc(db, COLLECTION, id), payload);
}

async function excluir(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

async function aprovar(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status: "aprovada",
    dataAtualizacao: serverTimestamp(),
  });
}

async function rejeitar(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    status: "rejeitada",
    dataAtualizacao: serverTimestamp(),
  });
}

export const folgasService = {
  listar,
  criar,
  atualizar,
  excluir,
  aprovar,
  rejeitar,
};
