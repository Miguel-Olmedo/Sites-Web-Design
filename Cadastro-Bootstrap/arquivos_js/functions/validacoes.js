/* ============================================================
   FaTech Manager - Funções de validação customizada (pure JS ES6)
   Arquivo: arquivos_js/functions/validacoes.js
   ============================================================ */

/**
 * Valida se o nome completo possui no mínimo 3 caracteres e pelo menos duas palavras.
 * @param {string} valor
 * @returns {boolean}
 */
export function validarNome(valor) {
  if (!valor || valor.trim().length < 3) return false;
  const palavras = valor.trim().split(/\s+/);
  return palavras.length >= 2;
}

/**
 * Valida formato de e-mail (usuario@dominio.com).
 * @param {string} valor
 * @returns {boolean}
 */
export function validarEmail(valor) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(valor);
}

/**
 * Valida CPF com algoritmo dos dígitos verificadores.
 * Rejeita sequências repetidas (ex.: 111.111.111-11).
 * @param {string} valor
 * @returns {boolean}
 */
export function validarCPF(valor) {
  // Remove máscara
  const cpf = valor.replace(/\D/g, '');

  if (cpf.length !== 11) return false;

  // Rejeita sequências repetidas
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  // Primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (10 - i);
  }
  let digito1 = (soma * 10) % 11;
  if (digito1 === 10) digito1 = 0;
  if (digito1 !== parseInt(cpf.charAt(9), 10)) return false;

  // Segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i), 10) * (11 - i);
  }
  let digito2 = (soma * 10) % 11;
  if (digito2 === 10) digito2 = 0;
  if (digito2 !== parseInt(cpf.charAt(10), 10)) return false;

  return true;
}

/**
 * Valida telefone com DDD + número (mínimo 10 dígitos).
 * @param {string} valor
 * @returns {boolean}
 */
export function validarTelefone(valor) {
  const numeros = valor.replace(/\D/g, '');
  return numeros.length >= 10 && numeros.length <= 11;
}

/**
 * Valida se um <select> possui uma opção selecionada (valor não vazio).
 * @param {string} valor
 * @returns {boolean}
 */
export function validarSelect(valor) {
  return valor !== null && valor !== undefined && valor.trim() !== '';
}

/**
 * Aplica máscara dinâmica de telefone no campo enquanto o usuário digita.
 * Formato: (00) 9999-9999  ou  (00) 99999-9999
 * @param {HTMLInputElement} input
 */
export function aplicarMascaraTelefone(input) {
  let valor = input.value.replace(/\D/g, '');

  if (valor.length <= 2) {
    input.value = valor;
  } else if (valor.length <= 6) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length <= 10) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 6)}-${valor.slice(6)}`;
  } else {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7, 11)}`;
  }
}

/**
 * Retorna a mensagem descritiva de erro para cada campo.
 * @param {string} id
 * @returns {string}
 */
export function mensagemErro(id) {
  const mensagens = {
    nome: 'Informe o nome completo com pelo menos 3 caracteres e dois nomes.',
    cpf: 'Por favor, informe um CPF válido.',
    email: 'E-mail inválido. Exemplo: usuario@dominio.com.',
    telefone: 'Informe um telefone válido com DDD (mínimo 10 dígitos).',
    senha: 'A senha deve ter no mínimo 6 caracteres.',
    confirmaSenha: 'As senhas não coincidem.',
    termos: 'Você deve concordar com os termos.',
    select: 'Selecione uma opção válida.'
  };
  return mensagens[id] || 'Preencha este campo corretamente.';
}
