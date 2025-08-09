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
import type { Funcionario, FuncionarioInput } from "../types";

const COLLECTION = "funcionarios";

async function listar(): Promise<Funcionario[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Funcionario, "id">),
  }));
}

function normalizeMoneyString(valor?: string | null): string | null {
  if (!valor) return null;
  const cleaned = String(valor)
    .replace(/[^0-9,.-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = Number(cleaned);
  if (Number.isNaN(num)) return null;
  return num.toFixed(2);
}

const limpar = (s: string) => s.replace(/\D/g, "");

async function criar(input: FuncionarioInput): Promise<string> {
  const payload = {
    ...input,
    cpf: limpar(input.cpf),
    celular: limpar(input.celular),
    cep: input.cep ? limpar(input.cep) : undefined,
    salario: normalizeMoneyString(input.salario),
    dataCriacao: serverTimestamp(),
    dataAtualizacao: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

async function atualizar(id: string, input: FuncionarioInput): Promise<void> {
  const payload = {
    ...input,
    cpf: limpar(input.cpf),
    celular: limpar(input.celular),
    cep: input.cep ? limpar(input.cep) : undefined,
    salario: normalizeMoneyString(input.salario),
    dataAtualizacao: serverTimestamp(),
  };
  await updateDoc(doc(db, COLLECTION, id), payload);
}

async function excluir(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

export const funcionariosService = { listar, criar, atualizar, excluir };
