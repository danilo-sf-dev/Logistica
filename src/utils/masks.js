// Máscaras para campos
export const maskCPF = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14);
};

export const maskCelular = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 15);
};

export const maskMoeda = (value) => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d)(\d{2})$/, '$1,$2')
    .replace(/(?=(\d{3})+(\D))\B/g, '.')
    .replace(/^/, 'R$ ');
};

// Validações
export const validateCPF = (cpf) => {
  cpf = cpf.replace(/[^\d]/g, '');
  
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
  const celularLimpo = celular.replace(/\D/g, '');
  
  // Deve ter 11 dígitos (DDD + 9 + número)
  if (celularLimpo.length !== 11) return false;
  
  // Deve começar com 9 após o DDD
  if (celularLimpo.charAt(2) !== '9') return false;
  
  return true;
};

// Função para formatar CPF para exibição
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  const cpfLimpo = cpf.replace(/\D/g, '');
  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Função para formatar celular para exibição
export const formatCelular = (celular) => {
  if (!celular) return '';
  const celularLimpo = celular.replace(/\D/g, '');
  return celularLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
};

// Função para formatar moeda para exibição
export const formatMoeda = (valor) => {
  if (!valor) return 'R$ 0,00';
  const numero = parseFloat(valor);
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}; 