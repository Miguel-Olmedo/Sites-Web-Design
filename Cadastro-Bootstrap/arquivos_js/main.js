/* ============================================================
   FaTech Manager - Script principal de validação do formulário
   Arquivo: arquivos_js/main.js
   ============================================================ */

import {
  validarNome,
  validarEmail,
  validarCPF,
  validarTelefone,
  validarSelect,
  aplicarMascaraTelefone,
  mensagemErro
} from './functions/validacoes.js';

/**
 * Mapeia cada campo do formulário com sua função de validação e
 * o elemento de feedback correspondente.
 */
const CAMPOS = [
  {
    id: 'nome',
    validar: (valor) => validarNome(valor),
    feedbackId: 'erro-nome',
    msgKey: 'nome'
  },
  {
    id: 'cpf',
    validar: (valor) => validarCPF(valor),
    feedbackId: 'erro-cpf',
    msgKey: 'cpf'
  },
  {
    id: 'email',
    validar: (valor) => validarEmail(valor),
    feedbackId: 'erro-email',
    msgKey: 'email'
  },
  {
    id: 'telefone',
    validar: (valor) => validarTelefone(valor),
    feedbackId: 'erro-telefone',
    msgKey: 'telefone'
  },
  {
    id: 'senha',
    validar: (valor) => valor && valor.length >= 6,
    feedbackId: 'erro-senha',
    msgKey: 'senha'
  },
  {
    id: 'confirmaSenha',
    validar: (valor) => {
      const senha = document.getElementById('senha').value;
      return valor && valor === senha;
    },
    feedbackId: 'erro-confirmaSenha',
    msgKey: 'confirmaSenha'
  },
  {
    id: 'sexo',
    validar: (valor) => validarSelect(valor),
    feedbackId: 'erro-sexo',
    msgKey: 'select'
  },
  {
    id: 'perfil',
    validar: (valor) => validarSelect(valor),
    feedbackId: 'erro-perfil',
    msgKey: 'select'
  },
  {
    id: 'termos',
    validar: () => document.getElementById('termos').checked,
    feedbackId: 'erro-termos',
    msgKey: 'termos',
    tipo: 'checkbox'
  }
];

/**
 * Mostra ou esconde o estado de erro de um campo.
 * @param {Object} campo - configuração do campo
 * @param {boolean} valido
 */
function exibirEstado(campo, valido) {
  const input = document.getElementById(campo.id);
  const feedback = document.getElementById(campo.feedbackId);

  if (!input || !feedback) return;

  if (valido) {
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    feedback.textContent = '';
    feedback.style.display = 'none';
  } else {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    feedback.textContent = mensagemErro(campo.msgKey);
    feedback.style.display = 'block';
  }
}

/**
 * Retorna o valor bruto de um campo (considerando checkboxes).
 * @param {HTMLInputElement|HTMLSelectElement} input
 * @returns {string}
 */
function obterValor(input) {
  if (input.type === 'checkbox') return input.checked ? '1' : '';
  return input.value;
}

/**
 * Valida um único campo e retorna se é válido.
 * @param {Object} campo
 * @returns {boolean}
 */
function validarCampo(campo) {
  const input = document.getElementById(campo.id);
  if (!input) return true;
  const valido = campo.validar(obterValor(input));
  exibirEstado(campo, valido);
  return valido;
}

/**
 * Inicializa os event listeners de input/blur de todos os campos.
 */
function inicializarListeners() {
  CAMPOS.forEach((campo) => {
    const input = document.getElementById(campo.id);
    if (!input) return;

    // Máscara dinâmica no telefone
    if (campo.id === 'telefone') {
      input.addEventListener('input', () => {
        aplicarMascaraTelefone(input);
      });
    }

    // Ao sair do campo (blur), valida e mostra/esconde erro
    input.addEventListener('blur', () => {
      validarCampo(campo);
    });

    // Enquanto digita (input), remove o erro assim que fica válido
    input.addEventListener('input', () => {
      // Para telefone, valida após aplicar máscara
      setTimeout(() => validarCampo(campo), 0);
    });
  });
}

/**
 * Valida todos os campos ao submeter o formulário.
 * Bloqueia o envio se houver qualquer campo inválido.
 * @param {Event} event
 */
function validarFormulario(event) {
  let formValido = true;

  CAMPOS.forEach((campo) => {
    const valido = validarCampo(campo);
    if (!valido) formValido = false;
  });

  if (!formValido) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Marca o formulário como tentado (para estilos do Bootstrap)
  const form = event.target;
  form.classList.add('was-validated');

  return formValido;
}

/**
 * Limpa estados de validação ao clicar em "Limpar" (reset).
 */
function inicializarReset() {
  const btnLimpar = document.querySelector('button[type="reset"]');
  const form = document.querySelector('form.needs-validation');

  if (!btnLimpar || !form) return;

  btnLimpar.addEventListener('click', () => {
    // Pequeno atraso para o reset do navegador acontecer antes de limpar classes
    setTimeout(() => {
      CAMPOS.forEach((campo) => {
        const input = document.getElementById(campo.id);
        const feedback = document.getElementById(campo.feedbackId);
        if (input) {
          input.classList.remove('is-invalid', 'is-valid');
        }
        if (feedback) {
          feedback.textContent = '';
          feedback.style.display = 'none';
        }
      });
      form.classList.remove('was-validated');
    }, 0);
  });
}

/**
 * Ponto de entrada: executa após o DOM estar carregado.
 */
document.addEventListener('DOMContentLoaded', () => {
  inicializarListeners();
  inicializarReset();

  const form = document.querySelector('form.needs-validation');
  if (form) {
    form.addEventListener('submit', validarFormulario);
  }
});
