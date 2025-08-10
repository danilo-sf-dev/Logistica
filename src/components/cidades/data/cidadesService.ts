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

const COLLECTION = "cidades";

async function listar(): Promise<Cidade[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Cidade, "id">),
  }));
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
  return ref.id;
}

async function atualizar(id: string, input: CidadeInput): Promise<void> {
  const payload = {
    ...input,
    distancia: input.distancia ? Number(input.distancia) : null,
    pesoMinimo: input.pesoMinimo ? Number(input.pesoMinimo) : null,
    rotaId: input.rotaId || null,
    dataAtualizacao: serverTimestamp(),
  };
  await updateDoc(doc(db, COLLECTION, id), payload);
}

async function excluir(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export const cidadesService = { listar, criar, atualizar, excluir };
