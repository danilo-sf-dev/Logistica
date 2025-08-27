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
  where,
} from "firebase/firestore";
import { db } from "../../../firebase/config";
import type { Funcionario, FuncionarioInput } from "../types";
import NotificationService from "../../../services/notificationService";

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

  // Remove todos os caracteres não numéricos, exceto ponto e vírgula
  let cleaned = String(valor).replace(/[^\d.,]/g, "");

  // Se não há números, retorna null
  if (!cleaned) return null;

  // Se contém vírgula, substituir por ponto
  if (cleaned.includes(",")) {
    cleaned = cleaned.replace(",", ".");
  }

  // Converter para número
  const num = Number(cleaned);

  if (Number.isNaN(num)) return null;

  // Retorna como string com 2 casas decimais
  return num.toFixed(2);
}

const limpar = (s: string) => s.replace(/\D/g, "");

async function verificarCPFExistente(
  cpf: string,
  idExcluir?: string,
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

async function verificarCNHExistente(
  cnh: string,
  idExcluir?: string,
): Promise<boolean> {
  const cnhLimpo = limpar(cnh);
  const q = query(collection(db, COLLECTION), where("cnh", "==", cnhLimpo));
  const snapshot = await getDocs(q);

  // Se estamos editando, excluir o próprio registro da verificação
  if (idExcluir) {
    return snapshot.docs.some((doc) => doc.id !== idExcluir);
  }

  return !snapshot.empty;
}

async function criar(input: FuncionarioInput): Promise<string> {
  // Verificar se CPF já existe
  const cpfExiste = await verificarCPFExistente(input.cpf);
  if (cpfExiste) {
    throw new Error("CPF já cadastrado no sistema");
  }

  // Verificar se CNH já existe
  const cnhExiste = await verificarCNHExistente(input.cnh);
  if (cnhExiste) {
    throw new Error("CNH já cadastrada no sistema");
  }

  const payload = {
    ...input,
    cpf: limpar(input.cpf),
    celular: limpar(input.celular),
    cep: input.cep ? limpar(input.cep) : undefined,
    salario: normalizeMoneyString(input.salario),
    ativo: input.ativo !== undefined ? input.ativo : true,
    dataCriacao: serverTimestamp(),
    dataAtualizacao: serverTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);

  // Enviar notificação sobre novo funcionário
  try {
    await NotificationService.notifyNewFuncionario({
      nome: input.nome,
      id: ref.id,
    });
  } catch (error) {
    console.error("Erro ao enviar notificação:", error);
  }

  return ref.id;
}

async function atualizar(id: string, input: FuncionarioInput): Promise<void> {
  // Verificar se CPF já existe (excluindo o próprio registro)
  const cpfExiste = await verificarCPFExistente(input.cpf, id);
  if (cpfExiste) {
    throw new Error("CPF já cadastrado no sistema");
  }

  // Verificar se CNH já existe (excluindo o próprio registro)
  const cnhExiste = await verificarCNHExistente(input.cnh, id);
  if (cnhExiste) {
    throw new Error("CNH já cadastrada no sistema");
  }

  const payload = {
    ...input,
    cpf: limpar(input.cpf),
    celular: limpar(input.celular),
    cep: input.cep ? limpar(input.cep) : undefined,
    salario: normalizeMoneyString(input.salario),
    ativo: input.ativo !== undefined ? input.ativo : true,
    dataAtualizacao: serverTimestamp(),
  };
  await updateDoc(doc(db, COLLECTION, id), payload);
}

async function excluir(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
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

export const funcionariosService = {
  listar,
  criar,
  atualizar,
  excluir,
  inativar,
  ativar,
};
