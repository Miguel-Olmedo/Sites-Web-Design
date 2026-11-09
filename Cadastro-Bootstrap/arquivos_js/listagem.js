/* ============================================================
   FaTech Manager - Lógica da Listagem de Clientes
   Arquivo: arquivos_js/listagem.js
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

/* ------------------------------------------------------------------
   Constantes e estado
   ------------------------------------------------------------------ */
const CHAVE_LOCALSTORAGE = 'fatech_clientes';

let clientes = []; // Array de clientes carregado do localStorage
let idClienteRemover = null; // ID do cliente a ser removido (modal)
let idClienteEditar = null; // ID do cliente sendo editado (modal)

/* ------------------------------------------------------------------
   Seletores de elementos DOM
   ------------------------------------------------------------------ */
const tbody = document.getElementById('corpo-tabela');
const contador = document.getElementById('total-clientes');
const alertaVazio = document.getElementById('alerta-vazio');
const modalRemoverEl = document.getElementById('modalRemover');
const modalEditarEl = document.getElementById('modalEditar');
const formEditar = document.getElementById('form-editar-cliente');
const btnConfirmarRemover = document.getElementById('btn-confirmar-remover');
const nomeClienteRemover = document.getElementById('nome-cliente-remover');

/* ------------------------------------------------------------------
   Inicialização
   ------------------------------------------------------------------ */
document.addEventListener('DOMContentLoaded', () => {
  carregarClientes();
  renderizarTabela();

  // Modal Remover - confirmação
  btnConfirmarRemover.addEventListener('click', () => {
    if (idClienteRemover !== null) {
      removerCliente(idClienteRemover);
      fecharModal('modalRemover');
      idClienteRemover = null;
    }
  });

  // Modal Editar - submit do formulário
  formEditar.addEventListener('submit', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (validarFormularioEditar()) {
      salvarEdicao();
      fecharModal('modalEditar');
    }
  });

  // Limpar estados de validação ao fechar o modal de edição
  modalEditarEl.addEventListener('hidden.bs.modal', () => {
    limparValidacaoEditar();
  });
});

/* ------------------------------------------------------------------
   localStorage
   ------------------------------------------------------------------ */
function carregarClientes() {
  const dados = localStorage.getItem(CHAVE_LOCALSTORAGE);
  clientes = dados ? JSON.parse(dados) : [];
}

function salvarClientes() {
  localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(clientes));
}

function gerarId() {
  // ID sequencial baseado no maior ID existente + 1
  if (clientes.length === 0) return 1;
  const maxId = Math.max(...clientes.map((c) => c.id));
  return maxId + 1;
}

/* ------------------------------------------------------------------
   Renderização da tabela
   ------------------------------------------------------------------ */
function renderizarTabela() {
  tbody.innerHTML = '';

  if (clientes.length === 0) {
    alertaVazio.classList.remove('d-none');
    contador.textContent = 'Total: 0 clientes';
    return;
  }

  alertaVazio.classList.add('d-none');
  contador.textContent = `Total: ${clientes.length} clientes`;

  clientes.forEach((cliente) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${String(cliente.id).padStart(3, '0')}</td>
      <td>${escapeHtml(cliente.nome)}</td>
      <td>${escapeHtml(cliente.telefone)}</td>
      <td>${escapeHtml(cliente.setor)}</td>
      <td class="acoes-tabela">
        <button type="button" class="btn btn-outline-primary btn-acao btn-editar" title="Editar" data-id="${cliente.id}">
          <i class="bi bi-pencil text-primary"></i>
        </button>
        <button type="button" class="btn btn-outline-danger btn-acao btn-remover" title="Remover" data-id="${cliente.id}">
          <i class="bi bi-trash text-danger"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Vincular eventos dos botões de ação após renderizar
  vincularBotoesAcao();
}

function vincularBotoesAcao() {
  // Botões Editar
  document.querySelectorAll('.btn-editar').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      abrirModalEditar(id);
    });
  });

  // Botões Remover
  document.querySelectorAll('.btn-remover').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.getAttribute('data-id'), 10);
      abrirModalRemover(id);
    });
  });
}

/* ------------------------------------------------------------------
   Remover cliente
   ------------------------------------------------------------------ */
function abrirModalRemover(id) {
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return;

  idClienteRemover = id;
  nomeClienteRemover.textContent = escapeHtml(cliente.nome);

  const modal = new bootstrap.Modal(modalRemoverEl);
  modal.show();
}

function removerCliente(id) {
  clientes = clientes.filter((c) => c.id !== id);
  salvarClientes();
  renderizarTabela();
  mostrarToast('Cliente removido com sucesso.');
}

/* ------------------------------------------------------------------
   Editar cliente
   ------------------------------------------------------------------ */
function abrirModalEditar(id) {
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return;

  idClienteEditar = id;

  // Preencher campos do modal
  document.getElementById('id-cliente-editar').value = cliente.id;
  document.getElementById('edit-nome').value = cliente.nome || '';
  document.getElementById('edit-email').value = cliente.email || '';
  document.getElementById('edit-cpf').value = cliente.cpf || '';
  document.getElementById('edit-telefone').value = cliente.telefone || '';
  document.getElementById('edit-setor').value = cliente.setor || '';
  document.getElementById('edit-observacoes').value = cliente.observacoes || '';

  // Limpar estados de validação anteriores
  limparValidacaoEditar();

  const modal = new bootstrap.Modal(modalEditarEl);
  modal.show();
}

function limparValidacaoEditar() {
  const campos = ['nome', 'email', 'cpf', 'telefone', 'setor'];
  campos.forEach((campo) => {
    const input = document.getElementById(`edit-${campo}`);
    const feedback = document.getElementById(`erro-edit-${campo}`);
    if (input) {
      input.classList.remove('is-invalid', 'is-valid');
    }
    if (feedback) {
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  });
}

function validarFormularioEditar() {
  let valido = true;

  const campos = [
    {
      id: 'edit-nome',
      validar: (v) => validarNome(v),
      msgKey: 'nome'
    },
    {
      id: 'edit-email',
      validar: (v) => validarEmail(v),
      msgKey: 'email'
    },
    {
      id: 'edit-cpf',
      validar: (v) => validarCPF(v),
      msgKey: 'cpf'
    },
    {
      id: 'edit-telefone',
      validar: (v) => validarTelefone(v),
      msgKey: 'telefone'
    },
    {
      id: 'edit-setor',
      validar: (v) => validarSelect(v),
      msgKey: 'select'
    }
  ];

  campos.forEach((campo) => {
    const input = document.getElementById(campo.id);
    const feedback = document.getElementById(`erro-${campo.id}`);
    const campoValido = campo.validar(input.value);

    if (!campoValido) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      feedback.textContent = mensagemErro(campo.msgKey);
      feedback.style.display = 'block';
      valido = false;
    } else {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      feedback.textContent = '';
      feedback.style.display = 'none';
    }
  });

  return valido;
}

function salvarEdicao() {
  const nome = document.getElementById('edit-nome').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  const cpf = document.getElementById('edit-cpf').value.trim();
  const telefone = document.getElementById('edit-telefone').value.trim();
  const setor = document.getElementById('edit-setor').value.trim();
  const observacoes = document.getElementById('edit-observacoes').value.trim();

  const index = clientes.findIndex((c) => c.id === idClienteEditar);
  if (index === -1) return;

  clientes[index] = {
    ...clientes[index],
    nome,
    email,
    cpf,
    telefone,
    setor,
    observacoes
  };

  salvarClientes();
  renderizarTabela();
  mostrarToast('Cliente atualizado com sucesso.');
}

/* ------------------------------------------------------------------
   Validação em tempo real (input/blur) no modal de edição
   ------------------------------------------------------------------ */
function inicializarValidacaoTempoRealEditar() {
  const campos = [
    { id: 'edit-nome', validar: (v) => validarNome(v), msgKey: 'nome' },
    { id: 'edit-email', validar: (v) => validarEmail(v), msgKey: 'email' },
    { id: 'edit-cpf', validar: (v) => validarCPF(v), msgKey: 'cpf' },
    { id: 'edit-telefone', validar: (v) => validarTelefone(v), msgKey: 'telefone' },
    { id: 'edit-setor', validar: (v) => validarSelect(v), msgKey: 'select' }
  ];

  campos.forEach((campo) => {
    const input = document.getElementById(campo.id);
    const feedback = document.getElementById(`erro-${campo.id}`);
    if (!input || !feedback) return;

    // Máscara de telefone
    if (campo.id === 'edit-telefone') {
      input.addEventListener('input', () => {
        aplicarMascaraTelefone(input);
      });
    }

    // Blur - valida ao sair
    input.addEventListener('blur', () => {
      validarCampoEditar(campo);
    });

    // Input - remove erro enquanto digita
    input.addEventListener('input', () => {
      setTimeout(() => validarCampoEditar(campo), 0);
    });
  });
}

function validarCampoEditar(campo) {
  const input = document.getElementById(campo.id);
  const feedback = document.getElementById(`erro-${campo.id}`);
  const valido = campo.validar(input.value);

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

// Inicializar validação em tempo real após o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  inicializarValidacaoTempoRealEditar();
});

/* ------------------------------------------------------------------
   Utilitários
   ------------------------------------------------------------------ */
function fecharModal(idModal) {
  const modalEl = document.getElementById(idModal);
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
}

function mostrarToast(mensagem) {
  const toastBody = document.getElementById('mensagem-toast');
  if (toastBody) toastBody.textContent = mensagem;

  const toastEl = document.getElementById('toast-sucesso');
  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}

function escapeHtml(texto) {
  if (!texto) return '';
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}
