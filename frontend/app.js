/**
 * ============================================================================
 * REINO ENCANTADO DAS PRINCESAS DISNEY • CRUD FRONTEND
 * ============================================================================
 * Consome os endpoints do Spring Boot:
 *  - POST   /princesa          -> Cadastra nova princesa (body JSON)
 *  - GET    /princesa?nome=... -> Busca princesa por nome
 *  - PUT    /princesa?id=...   -> Atualiza princesa pelo ID (body JSON)
 *  - DELETE /princesa?nome=... -> Deleta princesa pelo nome
 *  - GET    /princesa/todas    -> Lista todas as princesas cadastradas
 * ============================================================================
 */

// Estado da Aplicação
const state = {
  apiUrl: localStorage.getItem('disney_api_url') || 'http://localhost:8080/princesa',
  princesas: [], // Lista das princesas exibidas na galeria
  editingId: null, // ID da princesa atualmente em edição (se houver)
  isOnline: false
};

// Dicionário de Princesas Clássicas para Exemplos Rápidos
const EXEMPLOS_PRINCESAS = [
  { nome: 'Cinderela', nome_filme: 'Cinderela', cor_vestido: 'Azul Celeste', ano_filme: 1950, corHex: '#5dade2' },
  { nome: 'Bela', nome_filme: 'A Bela e a Fera', cor_vestido: 'Dourado Real', ano_filme: 1991, corHex: '#f5b041' },
  { nome: 'Ariel', nome_filme: 'A Pequena Sereia', cor_vestido: 'Verde Mar', ano_filme: 1989, corHex: '#48c9b0' },
  { nome: 'Aurora', nome_filme: 'A Bela Adormecida', cor_vestido: 'Rosa Encantado', ano_filme: 1959, corHex: '#ec407a' },
  { nome: 'Rapunzel', nome_filme: 'Enrolados', cor_vestido: 'Lilás Solar', ano_filme: 2010, corHex: '#ab47bc' },
  { nome: 'Jasmine', nome_filme: 'Aladdin', cor_vestido: 'Azul Turquesa', ano_filme: 1992, corHex: '#00bcd4' },
  { nome: 'Tiana', nome_filme: 'A Princesa e o Sapo', cor_vestido: 'Verde Ninfeia', ano_filme: 2009, corHex: '#52be80' },
  { nome: 'Branca de Neve', nome_filme: 'Branca de Neve e os Sete Anões', cor_vestido: 'Azul e Amarelo', ano_filme: 1937, corHex: '#f4d03f' }
];

// Elementos do DOM
const dom = {
  // Inputs
  form: document.getElementById('princessForm'),
  inputNome: document.getElementById('princessNome'),
  inputFilme: document.getElementById('princessFilme'),
  inputCorVestido: document.getElementById('princessCorVestido'),
  inputAnoFilme: document.getElementById('princessAnoFilme'),
  inputId: document.getElementById('princessId'),
  idFieldContainer: document.getElementById('idFieldContainer'),
  colorPreview: document.getElementById('colorPreview'),
  formModeBadge: document.getElementById('formModeBadge'),
  badgeText: document.getElementById('badgeText'),

  // Botões do Formulário
  btnCadastrar: document.getElementById('btnCadastrar'),
  btnAtualizar: document.getElementById('btnAtualizar'),
  btnDeletar: document.getElementById('btnDeletar'),
  btnLimpar: document.getElementById('btnLimpar'),
  quickSearchBtn: document.getElementById('quickSearchBtn'),

  // Galeria e Pesquisa
  cardsGrid: document.getElementById('princessCardsGrid'),
  emptyState: document.getElementById('emptyState'),
  princessCount: document.getElementById('princessCount'),
  searchNomeInput: document.getElementById('searchNomeInput'),
  btnBuscar: document.getElementById('btnBuscar'),
  btnSincronizar: document.getElementById('btnSincronizar'),
  btnCarregarExemplos: document.getElementById('btnCarregarExemplos'),
  btnCriarPrimeira: document.getElementById('btnCriarPrimeira'),

  // Meta & Configuração
  connectionStatus: document.getElementById('connectionStatus'),
  apiConfigBtn: document.getElementById('apiConfigBtn'),
  currentApiDisplay: document.getElementById('currentApiDisplay'),
  configModal: document.getElementById('configModal'),
  closeConfigModal: document.getElementById('closeConfigModal'),
  apiUrlInput: document.getElementById('apiUrlInput'),
  btnSalvarApiUrl: document.getElementById('btnSalvarApiUrl'),
  btnResetApiUrl: document.getElementById('btnResetApiUrl'),
  toastContainer: document.getElementById('toastContainer'),
  sparklesContainer: document.getElementById('sparklesContainer')
};

// ============================================================================
// INICIALIZAÇÃO
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  inicializarBrilhos();
  atualizarDisplayApi();
  configurarEventos();
  restaurarCacheLocal();
  verificarConexaoESincronizar();
});

// Gera partículas de brilho no fundo
function inicializarBrilhos() {
  const simbolos = ['✨', '⭐', '🌸', '💖', '👑', '🌟'];
  const quantidade = 18;

  for (let i = 0; i < quantidade; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.animationDuration = `${6 + Math.random() * 8}s`;
    sparkle.style.animationDelay = `${Math.random() * 6}s`;
    sparkle.style.fontSize = `${10 + Math.random() * 14}px`;
    dom.sparklesContainer.appendChild(sparkle);
  }
}

// ============================================================================
// CONFIGURAÇÃO DOS EVENTOS DO DOM
// ============================================================================
function configurarEventos() {
  // Ações Principais do Formulário
  dom.btnCadastrar.addEventListener('click', handleCadastrar);
  dom.btnAtualizar.addEventListener('click', handleAtualizar);
  dom.btnDeletar.addEventListener('click', handleDeletarDoFormulario);
  dom.btnLimpar.addEventListener('click', limparCampos);
  
  // Busca Rápida no Input e na Barra de Busca
  dom.quickSearchBtn.addEventListener('click', () => {
    const nome = dom.inputNome.value.trim();
    if (nome) {
      buscarPrincesaPorNome(nome);
    } else {
      mostrarToast('⚠️ Digite o nome da princesa no campo para buscar.', 'warning');
      dom.inputNome.focus();
    }
  });

  dom.btnBuscar.addEventListener('click', () => {
    const nome = dom.searchNomeInput.value.trim();
    if (nome) {
      buscarPrincesaPorNome(nome);
    } else {
      mostrarToast('⚠️ Digite o nome para pesquisar na galeria.', 'warning');
      dom.searchNomeInput.focus();
    }
  });

  dom.searchNomeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      dom.btnBuscar.click();
    }
  });

  dom.btnSincronizar.addEventListener('click', () => {
    verificarConexaoESincronizar(true);
  });

  dom.btnCarregarExemplos.addEventListener('click', preencherExemploAleatorio);
  dom.btnCriarPrimeira.addEventListener('click', preencherExemploAleatorio);

  // Monitorar cor do vestido para atualizar amostra visual
  dom.inputCorVestido.addEventListener('input', () => {
    atualizarAmostraDeCor(dom.inputCorVestido.value);
  });

  // Botões de Paleta Rápida de Cores
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const nomeCor = btn.dataset.name;
      const hexCor = btn.dataset.color;
      dom.inputCorVestido.value = nomeCor;
      dom.colorPreview.style.backgroundColor = hexCor;
      dom.inputCorVestido.focus();
    });
  });

  // Modal de Configuração de API
  dom.apiConfigBtn.addEventListener('click', abrirModalConfig);
  dom.closeConfigModal.addEventListener('click', fecharModalConfig);
  dom.configModal.addEventListener('click', (e) => {
    if (e.target === dom.configModal) fecharModalConfig();
  });

  dom.btnSalvarApiUrl.addEventListener('click', () => {
    const novaUrl = dom.apiUrlInput.value.trim();
    if (novaUrl) {
      state.apiUrl = novaUrl.replace(/\/+$/, '');
      localStorage.setItem('disney_api_url', state.apiUrl);
      atualizarDisplayApi();
      fecharModalConfig();
      mostrarToast('⚙️ Endereço do Reino atualizado!', 'info');
      verificarConexaoESincronizar(true);
    }
  });

  dom.btnResetApiUrl.addEventListener('click', () => {
    dom.apiUrlInput.value = 'http://localhost:8080/princesa';
  });
}

// Atualiza o display da URL da API no cabeçalho
function atualizarDisplayApi() {
  try {
    const url = new URL(state.apiUrl);
    dom.currentApiDisplay.textContent = `${url.hostname}:${url.port || (url.protocol === 'https:' ? '443' : '80')}`;
  } catch (e) {
    dom.currentApiDisplay.textContent = state.apiUrl;
  }
}

function abrirModalConfig() {
  dom.apiUrlInput.value = state.apiUrl;
  dom.configModal.style.display = 'flex';
}

function fecharModalConfig() {
  dom.configModal.style.display = 'none';
}

// ============================================================================
// COMUNICAÇÃO HTTP COM O BACKEND (GET, POST, PUT, DELETE)
// ============================================================================

/**
 * 1. POST /princesa
 * Envia os dados no corpo JSON para cadastrar nova princesa.
 */
async function salvarPrincesaApi(dadosPrincesa) {
  const resposta = await fetch(state.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(dadosPrincesa)
  });

  if (!resposta.ok) {
    const erroTexto = await resposta.text();
    throw new Error(erroTexto || `Erro ao cadastrar princesa (Status: ${resposta.status})`);
  }

  return true;
}

/**
 * 2. GET /princesa?nome={nome}
 * Consulta a princesa pelo nome exato no banco de dados.
 */
async function buscarPrincesaPorNomeApi(nome) {
  const url = `${state.apiUrl}?nome=${encodeURIComponent(nome)}`;
  const resposta = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!resposta.ok) {
    if (resposta.status === 404 || resposta.status === 500) {
      throw new Error(`Princesa "${nome}" não foi encontrada no Reino.`);
    }
    throw new Error(`Erro ao buscar princesa (Status: ${resposta.status})`);
  }

  return await resposta.json();
}

/**
 * 3. PUT /princesa?id={id}
 * Atualiza os dados de uma princesa pelo seu ID.
 */
async function atualizarPrincesaApi(id, dadosPrincesa) {
  const url = `${state.apiUrl}?id=${encodeURIComponent(id)}`;
  const resposta = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(dadosPrincesa)
  });

  if (!resposta.ok) {
    const erroTexto = await resposta.text();
    throw new Error(erroTexto || `Erro ao atualizar princesa (Status: ${resposta.status})`);
  }

  return true;
}

/**
 * 4. DELETE /princesa?nome={nome}
 * Deleta a princesa informada pelo nome.
 */
async function deletarPrincesaApi(nome) {
  const url = `${state.apiUrl}?nome=${encodeURIComponent(nome)}`;
  const resposta = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!resposta.ok) {
    const erroTexto = await resposta.text();
    throw new Error(erroTexto || `Erro ao deletar princesa (Status: ${resposta.status})`);
  }

  return true;
}

/**
 * Endpoint Auxiliar: GET /princesa/todas
 * Tenta sincronizar todas as princesas diretamente do banco de dados.
 */
async function listarTodasPrincesasApi() {
  const url = `${state.apiUrl}/todas`;
  const resposta = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!resposta.ok) {
    throw new Error(`Endpoint /todas não respondeu (Status: ${resposta.status})`);
  }

  return await resposta.json();
}

// ============================================================================
// CONTROLADORES DE AÇÃO DO FORMULÁRIO (HANDLERS)
// ============================================================================

/**
 * Handler do Botão Cadastrar (POST)
 */
async function handleCadastrar() {
  const dados = obterDadosDoFormulario();
  if (!dados) return;

  setCarregandoBotao(dom.btnCadastrar, true, 'Cadastrando...');

  try {
    // 1. Executa o POST na API
    await salvarPrincesaApi(dados);
    
    // 2. Busca a princesa recém-criada via GET para obter o ID gerado pelo banco
    let princesaSalva = null;
    try {
      princesaSalva = await buscarPrincesaPorNomeApi(dados.nome);
    } catch (e) {
      console.warn('Não foi possível obter o ID gerado imediatamente:', e);
      // Fallback: monta objeto com id simulado/temporário se o GET falhar
      princesaSalva = { ...dados, id: Date.now() % 10000 };
    }

    // 3. Mostra na galeria conforme enviado ("mostrar conforme a pessoa envia os dados")
    adicionarOuAtualizarNaGaleria(princesaSalva);

    mostrarToast(`✨ A Princesa ${dados.nome} foi coroada e cadastrada no Reino!`, 'success');
    limparCampos();

  } catch (error) {
    console.error('Erro ao cadastrar princesa:', error);
    mostrarToast(`❌ Erro ao cadastrar: ${error.message}`, 'error');
  } finally {
    setCarregandoBotao(dom.btnCadastrar, false, '💖 Cadastrar Princesa');
  }
}

/**
 * Handler do Botão Atualizar (PUT)
 */
async function handleAtualizar() {
  const dados = obterDadosDoFormulario();
  if (!dados) return;

  let id = dom.inputId.value ? parseInt(dom.inputId.value, 10) : state.editingId;

  // Se não houver ID selecionado, tenta buscar pelo nome primeiro para descobrir o ID
  if (!id) {
    try {
      const encontrada = await buscarPrincesaPorNomeApi(dados.nome);
      if (encontrada && encontrada.id) {
        id = encontrada.id;
        dom.inputId.value = id;
      }
    } catch (e) {
      mostrarToast('⚠️ Para atualizar, selecione uma princesa na galeria (botão Editar) ou informe o nome cadastrado.', 'warning');
      return;
    }
  }

  if (!id) {
    mostrarToast('⚠️ ID da princesa não identificado para atualização.', 'warning');
    return;
  }

  setCarregandoBotao(dom.btnAtualizar, true, 'Atualizando...');

  try {
    // 1. Executa o PUT na API passando ?id=...
    await atualizarPrincesaApi(id, dados);

    // 2. Busca os dados atualizados via GET
    let princesaAtualizada = null;
    try {
      princesaAtualizada = await buscarPrincesaPorNomeApi(dados.nome);
    } catch (e) {
      princesaAtualizada = { ...dados, id };
    }

    // 3. Atualiza na galeria
    adicionarOuAtualizarNaGaleria(princesaAtualizada);

    mostrarToast(`👑 Dados da Princesa ${dados.nome} atualizados com sucesso!`, 'success');
    limparCampos();

  } catch (error) {
    console.error('Erro ao atualizar princesa:', error);
    mostrarToast(`❌ Erro ao atualizar: ${error.message}`, 'error');
  } finally {
    setCarregandoBotao(dom.btnAtualizar, false, '👑 Atualizar Princesa');
  }
}

/**
 * Handler do Botão Deletar do Formulário (DELETE)
 */
async function handleDeletarDoFormulario() {
  const nome = dom.inputNome.value.trim();

  if (!nome) {
    mostrarToast('⚠️ Digite o nome da princesa que deseja deletar do Reino.', 'warning');
    dom.inputNome.focus();
    return;
  }

  const confirmou = confirm(`Deseja realmente remover a princesa "${nome}" do Reino e do banco de dados?`);
  if (!confirmou) return;

  setCarregandoBotao(dom.btnDeletar, true, 'Deletando...');

  try {
    // Executa DELETE /princesa?nome=...
    await deletarPrincesaApi(nome);

    // Remove da galeria local
    removerDaGaleria(nome);

    mostrarToast(`🗑️ Princesa "${nome}" removida com honras reais.`, 'info');
    limparCampos();

  } catch (error) {
    console.error('Erro ao deletar princesa:', error);
    mostrarToast(`❌ Erro ao deletar: ${error.message}`, 'error');
  } finally {
    setCarregandoBotao(dom.btnDeletar, false, '🗑️ Deletar Princesa');
  }
}

/**
 * Handler de Busca por Nome (GET)
 */
async function buscarPrincesaPorNome(nome) {
  mostrarToast(`🔍 Consultando os arquivos reais por "${nome}"...`, 'info');

  try {
    const princesa = await buscarPrincesaPorNomeApi(nome);

    if (princesa) {
      // 1. Mostra na galeria
      adicionarOuAtualizarNaGaleria(princesa);

      // 2. Preenche os campos do formulário para visualização / edição
      carregarPrincesaNoFormulario(princesa);

      // 3. Destaca visualmente o card da princesa
      destacarCardNaGaleria(princesa.id || princesa.nome);

      mostrarToast(`✨ Princesa ${princesa.nome} encontrada e carregada!`, 'success');
    }
  } catch (error) {
    console.error('Erro na busca da princesa:', error);
    mostrarToast(`⚠️ ${error.message}`, 'warning');
  }
}

// ============================================================================
// GERENCIAMENTO DA GALERIA E DO ESTADO LOCAL
// ============================================================================

/**
 * Adiciona ou atualiza uma princesa na lista e renderiza os cards
 */
function adicionarOuAtualizarNaGaleria(princesa) {
  if (!princesa || !princesa.nome) return;

  const index = state.princesas.findIndex(p => 
    (princesa.id && p.id === princesa.id) || 
    (p.nome && p.nome.toLowerCase() === princesa.nome.toLowerCase())
  );

  if (index >= 0) {
    state.princesas[index] = { ...state.princesas[index], ...princesa };
  } else {
    // Insere no início para mostrar imediatamente o que foi enviado
    state.princesas.unshift(princesa);
  }

  salvarCacheLocal();
  renderizarGaleria();
}

/**
 * Remove uma princesa da galeria pelo nome ou ID
 */
function removerDaGaleria(nomeOuId) {
  state.princesas = state.princesas.filter(p => {
    if (typeof nomeOuId === 'number') {
      return p.id !== nomeOuId;
    }
    return p.nome.toLowerCase() !== nomeOuId.toLowerCase();
  });

  salvarCacheLocal();
  renderizarGaleria();
}

/**
 * Renderiza todos os cards na galeria real
 */
function renderizarGaleria() {
  const container = dom.cardsGrid;
  container.innerHTML = '';

  const total = state.princesas.length;
  dom.princessCount.textContent = `${total} princesa${total === 1 ? '' : 's'}`;

  if (total === 0) {
    dom.emptyState.style.display = 'block';
    return;
  }

  dom.emptyState.style.display = 'none';

  state.princesas.forEach(princesa => {
    const card = criarElementoCard(princesa);
    container.appendChild(card);
  });
}

/**
 * Cria o elemento HTML de um Card Real de Princesa
 */
function criarElementoCard(princesa) {
  const card = document.createElement('article');
  card.className = `princess-card ${state.editingId === princesa.id ? 'active-editing' : ''}`;
  card.id = `card-princess-${princesa.id || princesa.nome.replace(/\s+/g, '-')}`;

  // Cor e amostra do vestido
  const corHex = resolverCorCss(princesa.cor_vestido);

  card.innerHTML = `
    <div class="card-aura" style="background-color: ${corHex}"></div>
    
    <div class="card-top">
      <span class="card-id-pill">ID #${princesa.id || '—'}</span>
      <span class="card-crown-icon" title="Princesa Real">👑</span>
    </div>

    <h3 class="princess-card-nome">
      ${escapeHtml(princesa.nome)}
    </h3>

    <div class="card-details">
      <div class="detail-item">
        <span class="detail-label">🎬 Filme:</span>
        <span class="detail-value">${escapeHtml(princesa.nome_filme || 'Não informado')}</span>
      </div>
      
      <div class="detail-item">
        <span class="detail-label">👗 Vestido:</span>
        <span class="dress-color-pill">
          <span class="dress-color-sample" style="background-color: ${corHex}"></span>
          ${escapeHtml(princesa.cor_vestido || 'Não informada')}
        </span>
      </div>

      <div class="detail-item">
        <span class="detail-label">📅 Lançamento:</span>
        <span class="detail-value">${princesa.ano_filme || '—'}</span>
      </div>
    </div>

    <div class="card-actions">
      <button type="button" class="card-btn card-btn-edit" title="Carregar dados no formulário para editar">
        ✏️ Editar
      </button>
      <button type="button" class="card-btn card-btn-delete" title="Deletar princesa pelo nome (DELETE)">
        🗑️ Excluir
      </button>
    </div>
  `;

  // Evento do botão Editar no card
  const btnEditar = card.querySelector('.card-btn-edit');
  btnEditar.addEventListener('click', () => {
    carregarPrincesaNoFormulario(princesa);
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Evento do botão Deletar no card
  const btnDeletarCard = card.querySelector('.card-btn-delete');
  btnDeletarCard.addEventListener('click', async () => {
    const confirmou = confirm(`Deseja realmente deletar a princesa "${princesa.nome}" do banco de dados?`);
    if (!confirmou) return;

    btnDeletarCard.disabled = true;
    btnDeletarCard.textContent = 'Excluindo...';

    try {
      await deletarPrincesaApi(princesa.nome);
      removerDaGaleria(princesa.id || princesa.nome);
      mostrarToast(`🗑️ Princesa "${princesa.nome}" excluída com sucesso!`, 'info');
      
      // Se estava editando ela, limpa o formulário
      if (state.editingId === princesa.id) {
        limparCampos();
      }
    } catch (err) {
      mostrarToast(`❌ Erro ao excluir: ${err.message}`, 'error');
      btnDeletarCard.disabled = false;
      btnDeletarCard.textContent = '🗑️ Excluir';
    }
  });

  return card;
}

/**
 * Carrega os dados de uma princesa no formulário e ativa o modo de edição
 */
function carregarPrincesaNoFormulario(princesa) {
  dom.inputNome.value = princesa.nome || '';
  dom.inputFilme.value = princesa.nome_filme || '';
  dom.inputCorVestido.value = princesa.cor_vestido || '';
  dom.inputAnoFilme.value = princesa.ano_filme || '';
  
  if (princesa.id) {
    dom.inputId.value = princesa.id;
    dom.idFieldContainer.style.display = 'flex';
    state.editingId = princesa.id;

    // Atualiza o crachá de modo
    dom.formModeBadge.classList.add('edit-mode');
    dom.badgeText.textContent = `Editando: #${princesa.id} ${princesa.nome}`;
  }

  atualizarAmostraDeCor(princesa.cor_vestido);
  renderizarGaleria(); // Para atualizar o destaque do card selecionado
}

/**
 * Limpa todos os campos do formulário e reseta o modo de edição
 */
function limparCampos() {
  dom.form.reset();
  dom.inputId.value = '';
  dom.idFieldContainer.style.display = 'none';
  state.editingId = null;

  dom.formModeBadge.classList.remove('edit-mode');
  dom.badgeText.textContent = 'Novo Cadastro';

  dom.colorPreview.style.backgroundColor = '#ff758c';
  renderizarGaleria();
  dom.inputNome.focus();
}

/**
 * Destaca visualmente o card de uma princesa
 */
function destacarCardNaGaleria(idOuNome) {
  const card = document.getElementById(`card-princess-${idOuNome}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('active-editing');
    setTimeout(() => {
      if (state.editingId !== idOuNome) {
        card.classList.remove('active-editing');
      }
    }, 2500);
  }
}

// ============================================================================
// SINCRONIZAÇÃO E CACHE LOCAL
// ============================================================================

/**
 * Verifica se o backend Spring Boot está respondendo e tenta sincronizar
 */
async function verificarConexaoESincronizar(notificarUsuario = false) {
  definirStatusConexao('verificando', 'Conectando ao Reino...');

  try {
    // Tenta primeiro carregar todas as princesas via /princesa/todas
    const lista = await listarTodasPrincesasApi();
    
    definirStatusConexao('online', 'Reino Conectado (Online)');
    state.isOnline = true;

    if (Array.isArray(lista) && lista.length > 0) {
      // Mescla com a lista da galeria
      state.princesas = lista;
      salvarCacheLocal();
      renderizarGaleria();
      if (notificarUsuario) {
        mostrarToast(`👑 Reino sincronizado! ${lista.length} princesa(s) carregada(s).`, 'success');
      }
    } else if (notificarUsuario) {
      mostrarToast('👑 Servidor conectado com sucesso!', 'success');
    }
  } catch (erro) {
    console.info('Tentativa de listar todas:', erro.message);
    
    // Tenta uma verificação básica no endpoint /princesa
    try {
      // Faz um GET de teste para verificar se o servidor responde (mesmo com 400 ou 500 indica servidor ativo)
      const res = await fetch(`${state.apiUrl}?nome=ping_test`, { method: 'GET' });
      definirStatusConexao('online', 'Reino Conectado (Online)');
      state.isOnline = true;
      if (notificarUsuario) {
        mostrarToast('👑 Conectado ao servidor Spring Boot!', 'success');
      }
    } catch (e2) {
      definirStatusConexao('offline', 'Reino Offline (Inicie o Spring Boot)');
      state.isOnline = false;
      if (notificarUsuario) {
        mostrarToast('⚠️ Não foi possível conectar ao servidor em localhost:8080.', 'warning');
      }
    }
  }
}

function definirStatusConexao(tipo, texto) {
  const dot = dom.connectionStatus.querySelector('.status-dot');
  const text = dom.connectionStatus.querySelector('.status-text');

  dot.className = `status-dot ${tipo}`;
  text.textContent = texto;
}

function salvarCacheLocal() {
  try {
    localStorage.setItem('disney_princesas_cache', JSON.stringify(state.princesas));
  } catch (e) {
    console.warn('Erro ao salvar no cache local:', e);
  }
}

function restaurarCacheLocal() {
  try {
    const salvo = localStorage.getItem('disney_princesas_cache');
    if (salvo) {
      const parsed = JSON.parse(salvo);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.princesas = parsed;
        renderizarGaleria();
      }
    }
  } catch (e) {
    console.warn('Erro ao restaurar cache:', e);
  }
}

// ============================================================================
// FUNÇÕES AUXILIARES E UTILITÁRIOS
// ============================================================================

/**
 * Valida e extrai os dados digitados no formulário
 */
function obterDadosDoFormulario() {
  const nome = dom.inputNome.value.trim();
  const nome_filme = dom.inputFilme.value.trim();
  const cor_vestido = dom.inputCorVestido.value.trim();
  const anoStr = dom.inputAnoFilme.value.trim();

  if (!nome) {
    mostrarToast('👑 Por favor, digite o Nome da Princesa.', 'warning');
    dom.inputNome.focus();
    return null;
  }

  if (!nome_filme) {
    mostrarToast('🎬 Por favor, digite o Filme da Princesa.', 'warning');
    dom.inputFilme.focus();
    return null;
  }

  if (!cor_vestido) {
    mostrarToast('👗 Por favor, informe a Cor do Vestido.', 'warning');
    dom.inputCorVestido.focus();
    return null;
  }

  if (!anoStr) {
    mostrarToast('📅 Por favor, informe o Ano de Lançamento do Filme.', 'warning');
    dom.inputAnoFilme.focus();
    return null;
  }

  const ano_filme = parseInt(anoStr, 10);
  if (isNaN(ano_filme) || ano_filme < 1900 || ano_filme > 2100) {
    mostrarToast('📅 Digite um ano válido (entre 1900 e 2100).', 'warning');
    dom.inputAnoFilme.focus();
    return null;
  }

  return {
    nome,
    nome_filme,
    cor_vestido,
    ano_filme
  };
}

/**
 * Preenche o formulário com uma princesa Disney de exemplo
 */
function preencherExemploAleatorio() {
  const aleatorio = EXEMPLOS_PRINCESAS[Math.floor(Math.random() * EXEMPLOS_PRINCESAS.length)];
  
  dom.inputNome.value = aleatorio.nome;
  dom.inputFilme.value = aleatorio.nome_filme;
  dom.inputCorVestido.value = aleatorio.cor_vestido;
  dom.inputAnoFilme.value = aleatorio.ano_filme;
  dom.colorPreview.style.backgroundColor = aleatorio.corHex || '#ff758c';

  mostrarToast(`✨ Exemplo carregado: ${aleatorio.nome}! Clique em "Cadastrar Princesa".`, 'info');
  dom.inputNome.focus();
}

/**
 * Atualiza o indicador circular de cor com base no texto digitado
 */
function atualizarAmostraDeCor(nomeCor) {
  if (!nomeCor) {
    dom.colorPreview.style.backgroundColor = '#ff758c';
    return;
  }

  const hex = resolverCorCss(nomeCor);
  dom.colorPreview.style.backgroundColor = hex;
}

/**
 * Converte nomes de cores em português/Disney para cores CSS válidas
 */
function resolverCorCss(corTexto) {
  if (!corTexto) return '#ff758c';

  const t = corTexto.toLowerCase();

  if (t.includes('azul celeste') || t.includes('baile')) return '#5dade2';
  if (t.includes('azul turquesa') || t.includes('turquesa')) return '#00bcd4';
  if (t.includes('azul')) return '#3498db';
  if (t.includes('dourado') || t.includes('ouro') || t.includes('amarelo')) return '#f5b041';
  if (t.includes('rosa')) return '#ec407a';
  if (t.includes('verde') || t.includes('ninfeia') || t.includes('mar')) return '#48c9b0';
  if (t.includes('lilás') || t.includes('lilas') || t.includes('roxo')) return '#ab47bc';
  if (t.includes('vermelho') || t.includes('rubi')) return '#e74c3c';
  if (t.includes('branco') || t.includes('pérola')) return '#f2f4f4';
  if (t.includes('preto')) return '#34495e';
  if (t.includes('laranja')) return '#e67e22';

  // Se já for um código hexadecimal válido
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(corTexto.trim())) {
    return corTexto.trim();
  }

  return '#ff758c';
}

/**
 * Controla o estado de carregamento de um botão
 */
function setCarregandoBotao(btn, carregando, texto) {
  if (carregando) {
    btn.disabled = true;
    btn.dataset.originalHtml = btn.innerHTML;
    btn.innerHTML = `⏳ ${texto}`;
  } else {
    btn.disabled = false;
    btn.innerHTML = texto || btn.dataset.originalHtml;
  }
}

/**
 * Notificações Mágicas em Toasts
 */
function mostrarToast(mensagem, tipo = 'info', duracao = 4000) {
  const toast = document.createElement('div');
  toast.className = `royal-toast toast-${tipo}`;

  let icone = '✨';
  let titulo = 'Mensagem Real';

  switch (tipo) {
    case 'success':
      icone = '💖';
      titulo = 'Sucesso no Reino';
      break;
    case 'error':
      icone = '❌';
      titulo = 'Aviso Real';
      break;
    case 'warning':
      icone = '⚠️';
      titulo = 'Atenção';
      break;
    case 'info':
    default:
      icone = '👑';
      titulo = 'Edito Real';
      break;
  }

  toast.innerHTML = `
    <span class="toast-icon">${icone}</span>
    <div class="toast-content">
      <div class="toast-title">${titulo}</div>
      <div class="toast-msg">${escapeHtml(mensagem)}</div>
    </div>
  `;

  dom.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }, duracao);
}

/**
 * Sanitiza texto para evitar injeção HTML
 */
function escapeHtml(texto) {
  if (!texto) return '';
  return String(texto)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
