// Máscaras para campos
export const maskCPF = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    .slice(0, 14);
};

export const maskCelular = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(\d{4})(\d{1,2})$/, "$1-$2")
    .slice(0, 15);
};

export const maskMoeda = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d)(\d{2})$/, "$1,$2")
    .replace(/(?=(\d{3})+(\D))\B/g, ".")
    .replace(/^/, "R$ ");
};

export const maskCEP = (value) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
};

// Validações
export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, "");

  if (cpf.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateCelular = (celular) => {
  const celularLimpo = celular.replace(/\D/g, "");

  // Deve ter 11 dígitos (DDD + 9 + número)
  if (celularLimpo.length !== 11) return false;

  // Deve começar com 9 após o DDD
  if (celularLimpo.charAt(2) !== "9") return false;

  return true;
};

// Função para formatar CPF para exibição
export const formatCPF = (cpf) => {
  if (!cpf) return "";
  const cpfLimpo = cpf.replace(/\D/g, "");
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
};

// Função para formatar celular para exibição
export const formatCelular = (celular) => {
  if (!celular) return "";
  const celularLimpo = celular.replace(/\D/g, "");
  return celularLimpo.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

// Função para formatar moeda para exibição
export const formatMoeda = (valor) => {
  if (!valor) return "R$ 0,00";
  const numero = parseFloat(valor);
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

// Máscaras para veículos
export const maskPlaca = (value) => {
  return value
    .replace(/[^A-Za-z0-9]/g, "")
    .toUpperCase()
    .slice(0, 7);
};

// Validações para veículos
export const validatePlaca = (placa) => {
  const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, "");

  // Deve ter exatamente 7 caracteres
  if (placaLimpa.length !== 7) return false;

  // Padrão Mercosul: 3 letras + 1 número + 1 letra + 2 números (LWB9R90)
  const padraoMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

  // Padrão Brasil: 3 letras + 4 números (LWB9390)
  const padraoBrasil = /^[A-Z]{3}[0-9]{4}$/;

  return padraoMercosul.test(placaLimpa) || padraoBrasil.test(placaLimpa);
};

export const validateCapacidade = (capacidade) => {
  const numero = parseFloat(capacidade);
  return !isNaN(numero) && numero > 0;
};

// Função para formatar placa para exibição
export const formatPlaca = (placa) => {
  if (!placa) return "";
  const placaLimpa = placa.replace(/[^A-Za-z0-9]/g, "").toUpperCase();

  if (placaLimpa.length === 7) {
    // Padrão Mercosul: LWB9R90 -> LWB-9R90
    if (/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/.test(placaLimpa)) {
      return placaLimpa.replace(
        /([A-Z]{3})([0-9])([A-Z])([0-9]{2})/,
        "$1-$2$3-$4",
      );
    }
    // Padrão Brasil: LWB9390 -> LWB-9390
    if (/^[A-Z]{3}[0-9]{4}$/.test(placaLimpa)) {
      return placaLimpa.replace(/([A-Z]{3})([0-9]{4})/, "$1-$2");
    }
  }

  return placaLimpa;
};
