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
import type { Folga, FolgaFormData } from "../types";
import { DateService } from "../../../services/DateService";
import { NotificationService } from "../../../services/notificationService";

const COLLECTION = "folgas";

// Função para atualizar status do funcionário baseado nas folgas
async function atualizarStatusFuncionario(
  funcionarioId: string,
): Promise<void> {
  try {
    // Buscar todas as folgas aprovadas do funcionário
    const folgasSnapshot = await getDocs(collection(db, COLLECTION));
    const folgasFuncionario = folgasSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter(
        (folga: any) =>
          folga.funcionarioId === funcionarioId && folga.status === "aprovada",
      );

    // Verificar se há folgas ativas (dentro do período)
    const hoje = new Date();
    // Normalizar data para comparar apenas dia/mês/ano
    const hojeNormalizado = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
    );

    const folgaAtiva = folgasFuncionario.find((folga: any) => {
      const dataInicio = new Date(folga.dataInicio);
      const dataFim = new Date(folga.dataFim);
      // Normalizar datas para comparar apenas dia/mês/ano
      const inicioNormalizado = new Date(
        dataInicio.getFullYear(),
        dataInicio.getMonth(),
        dataInicio.getDate(),
      );
      const fimNormalizado = new Date(
        dataFim.getFullYear(),
        dataFim.getMonth(),
        dataFim.getDate(),
      );

      return (
        hojeNormalizado >= inicioNormalizado &&
        hojeNormalizado <= fimNormalizado
      );
    }) as any;

    // Determinar o novo status
    let novoStatus = "disponivel";
    if (folgaAtiva) {
      // Mapear tipo de folga para status do funcionário
      switch (folgaAtiva.tipo) {
        case "ferias":
          novoStatus = "ferias";
          break;
        case "folga":
        case "atestado":
        case "licenca":
        case "outros":
          novoStatus = "folga";
          break;
        default:
          novoStatus = "folga";
      }
    }

    // Atualizar status do funcionário
    await updateDoc(doc(db, "funcionarios", funcionarioId), {
      status: novoStatus,
      dataAtualizacao: DateService.getServerTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao atualizar status do funcionário:", error);
    // Não vamos falhar a operação principal por causa deste erro
  }
}

// Função para sincronizar status de todos os funcionários baseado nas folgas
async function sincronizarStatusFuncionarios(): Promise<void> {
  try {
    // Buscar todos os funcionários
    const funcionariosSnapshot = await getDocs(collection(db, "funcionarios"));
    const funcionarios = funcionariosSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Buscar todas as folgas aprovadas
    const folgasSnapshot = await getDocs(collection(db, COLLECTION));
    const folgasAprovadas = folgasSnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((folga: any) => folga.status === "aprovada");

    // Verificar data atual
    const hoje = new Date();
    // Normalizar data para comparar apenas dia/mês/ano
    const hojeNormalizado = new Date(
      hoje.getFullYear(),
      hoje.getMonth(),
      hoje.getDate(),
    );

    // Para cada funcionário, verificar se tem folga ativa
    for (const funcionario of funcionarios) {
      const folgasFuncionario = folgasAprovadas.filter(
        (folga: any) => folga.funcionarioId === funcionario.id,
      );

      const folgaAtiva = folgasFuncionario.find((folga: any) => {
        const dataInicio = new Date(folga.dataInicio);
        const dataFim = new Date(folga.dataFim);
        // Normalizar datas para comparar apenas dia/mês/ano
        const inicioNormalizado = new Date(
          dataInicio.getFullYear(),
          dataInicio.getMonth(),
          dataInicio.getDate(),
        );
        const fimNormalizado = new Date(
          dataFim.getFullYear(),
          dataFim.getMonth(),
          dataFim.getDate(),
        );

        return (
          hojeNormalizado >= inicioNormalizado &&
          hojeNormalizado <= fimNormalizado
        );
      }) as any;

      // Determinar o novo status
      let novoStatus = "disponivel";
      if (folgaAtiva) {
        switch (folgaAtiva.tipo) {
          case "ferias":
            novoStatus = "ferias";
            break;
          case "folga":
          case "atestado":
          case "licenca":
          case "outros":
            novoStatus = "folga";
            break;
          default:
            novoStatus = "folga";
        }
      }

      // Atualizar se o status mudou
      if ((funcionario as any).status !== novoStatus) {
        await updateDoc(doc(db, "funcionarios", funcionario.id), {
          status: novoStatus,
          dataAtualizacao: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    console.error("Erro ao sincronizar status dos funcionários:", error);
  }
}

async function listar(): Promise<Folga[]> {
  const q = query(collection(db, COLLECTION), orderBy("dataCriacao", "desc"));
  const snapshot = await getDocs(q);
  const folgas = snapshot.docs.map((d) => {
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

  return folgas;
}

async function criar(input: FolgaFormData): Promise<string> {
  const normalizedData = {
    ...input,
    dataInicio: input.dataInicio
      ? DateService.normalizeForFirebase(input.dataInicio)
      : undefined,
    dataFim: input.dataFim
      ? DateService.normalizeForFirebase(input.dataFim)
      : undefined,
    dataCriacao: DateService.getServerTimestamp(),
    dataAtualizacao: DateService.getServerTimestamp(),
  };
  const ref = await addDoc(collection(db, COLLECTION), normalizedData);

  // Enviar notificação sobre nova folga
  try {
    await NotificationService.notifyNewFolga({
      funcionarioNome: input.funcionarioNome || "Funcionário não informado",
      data: input.dataInicio || "Data não informada",
      id: ref.id,
    });
  } catch (notificationError) {
    console.error("Erro ao enviar notificação:", notificationError);
    // Não falha a criação da folga se a notificação falhar
  }

  return ref.id;
}

async function atualizar(id: string, input: FolgaFormData): Promise<void> {
  const normalizedData: any = {
    ...input,
    dataAtualizacao: DateService.getServerTimestamp(),
  };

  if (input.dataInicio) {
    normalizedData.dataInicio = DateService.normalizeForFirebase(
      input.dataInicio,
    );
  }
  if (input.dataFim) {
    normalizedData.dataFim = DateService.normalizeForFirebase(input.dataFim);
  }

  await updateDoc(doc(db, COLLECTION, id), normalizedData);
}

async function excluir(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

async function aprovar(id: string): Promise<void> {
  // Buscar a folga para obter o funcionarioId
  const folgaDoc = await getDocs(collection(db, COLLECTION));
  const folga = folgaDoc.docs.find((doc) => doc.id === id);

  if (!folga) {
    throw new Error("Folga não encontrada");
  }

  const folgaData = folga.data();

  // Aprovar a folga
  await updateDoc(doc(db, COLLECTION, id), {
    status: "aprovada",
    dataAtualizacao: DateService.getServerTimestamp(),
  });

  // Atualizar status do funcionário
  await atualizarStatusFuncionario(folgaData.funcionarioId);
}

async function rejeitar(id: string): Promise<void> {
  // Buscar a folga para obter o funcionarioId
  const folgaDoc = await getDocs(collection(db, COLLECTION));
  const folga = folgaDoc.docs.find((doc) => doc.id === id);

  if (!folga) {
    throw new Error("Folga não encontrada");
  }

  const folgaData = folga.data();

  // Rejeitar a folga
  await updateDoc(doc(db, COLLECTION, id), {
    status: "rejeitada",
    dataAtualizacao: DateService.getServerTimestamp(),
  });

  // Atualizar status do funcionário (pode voltar para disponível se não houver outras folgas aprovadas)
  await atualizarStatusFuncionario(folgaData.funcionarioId);
}

async function cancelar(id: string): Promise<void> {
  // Buscar a folga para obter o funcionarioId
  const folgaDoc = await getDocs(collection(db, COLLECTION));
  const folga = folgaDoc.docs.find((doc) => doc.id === id);

  if (!folga) {
    throw new Error("Folga não encontrada");
  }

  const folgaData = folga.data();

  // Cancelar a folga
  await updateDoc(doc(db, COLLECTION, id), {
    status: "cancelada",
    dataAtualizacao: DateService.getServerTimestamp(),
  });

  // Atualizar status do funcionário
  await atualizarStatusFuncionario(folgaData.funcionarioId);
}

// Função para forçar sincronização do status de um funcionário específico
async function sincronizarStatusFuncionarioEspecifico(
  funcionarioId: string,
): Promise<void> {
  try {
    await atualizarStatusFuncionario(funcionarioId);
  } catch (error) {
    console.error(
      "Erro ao sincronizar status do funcionário específico:",
      error,
    );
  }
}

export const folgasService = {
  listar,
  criar,
  atualizar,
  excluir,
  aprovar,
  rejeitar,
  cancelar,
  sincronizarStatusFuncionarios,
  sincronizarStatusFuncionarioEspecifico,
};
