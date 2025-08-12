import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import type { Vendedor, VendedorInput } from "../types";

const COLLECTION = "vendedores";

async function listar(): Promise<Vendedor[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<Vendedor, "id">),
  }));
}

const limpar = (s: string) => s.replace(/\D/g, "");

async function verificarCPFExistente(
  cpf: string,
  idExcluir?: string
): Promise<boolean> {
  const cpfLimpo = limpar(cpf);
  const q = query(collection(db, COLLECTION), where("cpf", "==", cpfLimpo));
  const snapshot = await getDocs(q);

  // Se estamos editando, excluir o próprio registro da verificação
  if (idExcluir) {
    return snapshot.docs.some((doc) => doc.id !== idExcluir);
  }

  return !snapshot.empty;
}

async function criar(input: VendedorInput): Promise<string> {
  // Verificar se CPF já existe
  const cpfExiste = await verificarCPFExistente(input.cpf);
  if (cpfExiste) {
    throw new Error("CPF já cadastrado no sistema");
  }

  const payload = {
    ...input,
    nome: input.nome.toUpperCase(),
    cpf: limpar(input.cpf),
    regiao: input.regiao,
    celular: limpar(input.celular),
    ativo: input.ativo !== undefined ? input.ativo : true,
    cidadesAtendidas: input.cidadesAtendidas || [],
    dataCriacao: serverTimestamp(),
    dataAtualizacao: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return ref.id;
}

async function atualizar(id: string, input: VendedorInput): Promise<void> {
  // Verificar se CPF já existe (excluindo o próprio registro)
  const cpfExiste = await verificarCPFExistente(input.cpf, id);
  if (cpfExiste) {
    throw new Error("CPF já cadastrado no sistema");
  }

  const payload = {
    ...input,
    nome: input.nome.toUpperCase(),
    cpf: limpar(input.cpf),
    regiao: input.regiao,
    celular: limpar(input.celular),
    ativo: input.ativo !== undefined ? input.ativo : true,
    cidadesAtendidas: input.cidadesAtendidas || [],
    dataAtualizacao: serverTimestamp(),
  };
  await updateDoc(doc(db, COLLECTION, id), payload);
}

async function inativar(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ativo: false,
    dataAtualizacao: serverTimestamp(),
  });
}

async function ativar(id: string): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ativo: true,
    dataAtualizacao: serverTimestamp(),
  });
}

export const vendedoresService = {
  listar,
  criar,
  atualizar,
  inativar,
  ativar,
};
