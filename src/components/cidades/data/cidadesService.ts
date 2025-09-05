import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { DateService } from "../../../services/DateService";
import { db } from "../../../firebase/config";
import type { Cidade, CidadeInput } from "../types";
import { rotasService } from "../../rotas/data/rotasService";
import { obterRegiaoPorEstado } from "utils/constants";

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
  // Função para normalizar nomes de cidades (remover acentos e caracteres especiais)
  const normalizeCityName = (name: string): string => {
    return name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^\w\s]/g, "") // Remover pontuação e caracteres especiais
      .replace(/\s+/g, " ") // Normalizar espaços
      .trim()
      .toUpperCase();
  };

  // Validar unicidade da cidade
  const cidadesExistentes = await listar();
  const nomeNormalizado = normalizeCityName(input.nome);
  const estado = input.estado.toUpperCase();

  const cidadeExistente = cidadesExistentes.find(
    (cidade) =>
      normalizeCityName(cidade.nome) === nomeNormalizado &&
      cidade.estado === estado,
  );

  if (cidadeExistente) {
    throw new Error(
      `Cidade "${input.nome}" já está cadastrada no estado ${estado}`,
    );
  }

  // Sanitizar dados para remover campos undefined
  const sanitizedInput = Object.fromEntries(
    Object.entries(input).filter(([_, value]) => value !== undefined),
  );

  // Definir região automaticamente se não for fornecida
  let regiao = input.regiao;
  if (!regiao && input.estado) {
    regiao = obterRegiaoPorEstado(input.estado);
  }

  const payload = {
    ...sanitizedInput,
    // Garantir que nome e estado estejam em maiúsculas
    nome: input.nome?.toString().toUpperCase() || "",
    estado: input.estado?.toString().toUpperCase() || "",
    // Garantir que região esteja em maiúsculas se existir
    ...(regiao && { regiao: regiao.toString().toUpperCase() }),
    // Garantir que observação esteja em maiúsculas se existir
    ...(input.observacao && {
      observacao: input.observacao.toString().toUpperCase(),
    }),
    distancia: input.distancia ? Number(input.distancia) : null,
    pesoMinimo: input.pesoMinimo ? Number(input.pesoMinimo) : null,
    rotaId: input.rotaId || null,
    dataCriacao: DateService.getServerTimestamp(),
    dataAtualizacao: DateService.getServerTimestamp(),
  };

  // Remover campos null/undefined do payload final
  const finalPayload = Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined && value !== null,
    ),
  );

  const ref = await addDoc(collection(db, COLLECTION), finalPayload);

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
  // Função para normalizar nomes de cidades (remover acentos e caracteres especiais)
  const normalizeCityName = (name: string): string => {
    return name
      .normalize("NFD") // Decompor caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remover diacríticos (acentos)
      .replace(/[^\w\s]/g, "") // Remover pontuação e caracteres especiais
      .replace(/\s+/g, " ") // Normalizar espaços
      .trim()
      .toUpperCase();
  };

  // Validar unicidade da cidade (excluindo a própria cidade sendo editada)
  const cidadesExistentes = await listar();
  const nomeNormalizado = normalizeCityName(input.nome);
  const estado = input.estado.toUpperCase();

  const cidadeExistente = cidadesExistentes.find(
    (cidade) =>
      cidade.id !== id && // Excluir a própria cidade sendo editada
      normalizeCityName(cidade.nome) === nomeNormalizado &&
      cidade.estado === estado,
  );

  if (cidadeExistente) {
    throw new Error(
      `Cidade "${input.nome}" já está cadastrada no estado ${estado}`,
    );
  }

  // Buscar a cidade atual para comparar o rotaId
  const cidadeRef = doc(db, COLLECTION, id);
  const cidadeSnap = await getDocs(collection(db, COLLECTION));
  const cidadeAtual = cidadeSnap.docs.find((d) => d.id === id);
  const rotaIdAnterior = cidadeAtual?.data()?.rotaId;

  // Definir região automaticamente se não for fornecida
  let regiao = input.regiao;
  if (!regiao && input.estado) {
    regiao = obterRegiaoPorEstado(input.estado);
  }

  const payload = {
    ...input,
    // Garantir que nome e estado estejam em maiúsculas
    nome: input.nome?.toString().toUpperCase() || "",
    estado: input.estado?.toString().toUpperCase() || "",
    // Garantir que região esteja em maiúsculas se existir
    ...(regiao && { regiao: regiao.toString().toUpperCase() }),
    // Garantir que observação esteja em maiúsculas se existir
    ...(input.observacao && {
      observacao: input.observacao.toString().toUpperCase(),
    }),
    distancia: input.distancia ? Number(input.distancia) : null,
    pesoMinimo: input.pesoMinimo ? Number(input.pesoMinimo) : null,
    rotaId: input.rotaId || null,
    dataAtualizacao: DateService.getServerTimestamp(),
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
