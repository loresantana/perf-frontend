/**
 * L'Essence - Controlador Principal da Aplicação Frontend (Vanilla JS)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Elementos do DOM
  // ==========================================
  const perfumesContainer = document.getElementById('perfumes-container');
  const loadingState = document.getElementById('loading-state');
  const emptyState = document.getElementById('empty-state');
  const resultsCount = document.getElementById('results-count');

  // Filtros e Busca
  const inputSearch = document.getElementById('input-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const selectBrand = document.getElementById('select-brand');
  const selectCategory = document.getElementById('select-category');
  const selectSort = document.getElementById('select-sort');

  // Métricas
  const statTotal = document.getElementById('stat-total');
  const statMarcas = document.getElementById('stat-marcas');
  const statPrecoMedio = document.getElementById('stat-preco-medio');
  const statDbStatus = document.getElementById('stat-db-status');

  // Modais
  const modalCreate = document.getElementById('modal-create');
  const modalEdit = document.getElementById('modal-edit');
  const modalDelete = document.getElementById('modal-delete');

  // Botões de Abertura / Ação
  const btnOpenCreateModal = document.getElementById('btn-open-create-modal');
  const btnCloseCreateModal = document.getElementById('btn-close-create-modal');
  const btnCancelCreate = document.getElementById('btn-cancel-create');
  const btnEmptyAction = document.getElementById('btn-empty-action');
  const btnSeed = document.getElementById('btn-seed');
  const btnQuickSampleImg = document.getElementById('btn-quick-sample-img');

  // Formulário de Criação
  const formCreate = document.getElementById('form-create-perfume');
  const createMarca = document.getElementById('create-marca');
  const createModelo = document.getElementById('create-modelo');
  const createPreco = document.getElementById('create-preco');
  const createCategoria = document.getElementById('create-categoria');
  const createFoto = document.getElementById('create-foto');
  const createDescricao = document.getElementById('create-descricao');
  const createImgPreview = document.getElementById('create-img-preview');
  const createImgPlaceholder = document.getElementById('create-img-placeholder');

  // Formulário de Edição
  const formEdit = document.getElementById('form-edit-perfume');
  const editId = document.getElementById('edit-id');
  const editMarca = document.getElementById('edit-marca');
  const editModelo = document.getElementById('edit-modelo');
  const editPreco = document.getElementById('edit-preco');
  const editCategoria = document.getElementById('edit-categoria');
  const editFoto = document.getElementById('edit-foto');
  const editDescricao = document.getElementById('edit-descricao');
  const editImgPreview = document.getElementById('edit-img-preview');
  const editImgPlaceholder = document.getElementById('edit-img-placeholder');
  const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');

  // Modal de Exclusão
  const btnCloseDeleteModal = document.getElementById('btn-close-delete-modal');
  const btnCancelDelete = document.getElementById('btn-cancel-delete');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const deletePerfumeName = document.getElementById('delete-perfume-name');

  // Toasts
  const toastContainer = document.getElementById('toast-container');

  // ==========================================
  // 2. Estado da Aplicação
  // ==========================================
  let currentPerfumes = [];
  let pendingDeleteId = null;
  let searchTimeout = null;

  // Imagens de exemplo para facilitar o cadastro do usuário
  const SAMPLE_IMAGES = [
    'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=600&q=80'
  ];

  // Imagem genérica para quando uma foto falhar ao carregar
  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80';

  // ==========================================
  // 3. Utilitários de Formatação
  // ==========================================
  function formatBRL(value) {
    const num = Number(value) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  function parseBRL(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    const cleanStr = String(value)
      .replace(/[^\d,.-]/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  }

  function applyCurrencyMask(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (!value) {
        e.target.value = '';
        return;
      }
      const floatVal = (parseInt(value, 10) / 100).toFixed(2);
      e.target.value = formatBRL(floatVal);
    });
  }

  applyCurrencyMask(createPreco);
  applyCurrencyMask(editPreco);

  function showToast(message, type = 'info') {
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '•'}</span>
      <span class="toast-message">${message}</span>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(40px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function setButtonLoading(button, isLoading, originalText = 'Salvar') {
    const textSpan = button.querySelector('.btn-text');
    const loader = button.querySelector('.btn-loader');
    if (isLoading) {
      button.disabled = true;
      if (textSpan) textSpan.style.display = 'none';
      if (loader) loader.style.display = 'inline-block';
    } else {
      button.disabled = false;
      if (textSpan) textSpan.style.display = 'inline-block';
      if (loader) loader.style.display = 'none';
    }
  }

  // ==========================================
  // 4. Pré-visualização de Fotos
  // ==========================================
  function setupImagePreview(inputEl, imgEl, placeholderEl) {
    const updatePreview = () => {
      const url = inputEl.value.trim();
      if (!url) {
        imgEl.style.display = 'none';
        placeholderEl.style.display = 'block';
        placeholderEl.textContent = 'Pré-visualização da imagem aparecerá aqui';
        return;
      }

      imgEl.src = url;
      imgEl.onload = () => {
        imgEl.style.display = 'block';
        placeholderEl.style.display = 'none';
      };
      imgEl.onerror = () => {
        imgEl.style.display = 'none';
        placeholderEl.style.display = 'block';
        placeholderEl.textContent = 'Não foi possível carregar a imagem desta URL';
      };
    };

    inputEl.addEventListener('input', updatePreview);
    inputEl.addEventListener('blur', updatePreview);
  }

  setupImagePreview(createFoto, createImgPreview, createImgPlaceholder);
  setupImagePreview(editFoto, editImgPreview, editImgPlaceholder);

  // Botão de sugestão rápida de imagem no formulário de criação
  btnQuickSampleImg.addEventListener('click', () => {
    const randomUrl = SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
    createFoto.value = randomUrl;
    createFoto.dispatchEvent(new Event('input'));
  });

  // ==========================================
  // 5. Renderização do Catálogo
  // ==========================================
  function renderPerfumes(perfumes) {
    perfumesContainer.innerHTML = '';

    if (!perfumes || perfumes.length === 0) {
      emptyState.style.display = 'block';
      resultsCount.textContent = '0 perfumes encontrados';
      return;
    }

    emptyState.style.display = 'none';
    resultsCount.textContent = `Exibindo ${perfumes.length} perfume${perfumes.length !== 1 ? 's' : ''}`;

    perfumes.forEach((perfume) => {
      const id = perfume.id || perfume._id;
      const card = document.createElement('article');
      card.className = 'perfume-card';
      card.setAttribute('data-id', id);

      const categoryLabel = perfume.categoria || 'Fragrância';

      card.innerHTML = `
        <div class="card-image-wrapper">
          <img 
            src="${perfume.foto}" 
            alt="${perfume.modelo} - ${perfume.marca}" 
            loading="lazy"
            onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';"
          >
          <span class="card-badge-category">${categoryLabel}</span>
        </div>
        <div class="card-body">
          <span class="card-brand">${perfume.marca}</span>
          <h3 class="card-title">${perfume.modelo}</h3>
          <p class="card-description">${perfume.descricao || 'Fragrância refinada com notas olfativas harmoniosas e alta fixação.'}</p>
          <div class="card-footer">
            <div class="card-price-group">
              <span class="price-label">Preço</span>
              <span class="price-value">${formatBRL(perfume.preco)}</span>
            </div>
            <div class="card-actions">
              <button class="btn-icon edit-btn" title="Editar perfume" data-id="${id}">
                ✏️
              </button>
              <button class="btn-icon delete delete-btn" title="Excluir perfume" data-id="${id}">
                🗑️
              </button>
            </div>
          </div>
        </div>
      `;

      // Event listeners para botões do card
      card.querySelector('.edit-btn').addEventListener('click', () => openEditModal(perfume));
      card.querySelector('.delete-btn').addEventListener('click', () => openDeleteModal(perfume));

      perfumesContainer.appendChild(card);
    });
  }

  // ==========================================
  // 6. Atualização de Marcas no Filtro
  // ==========================================
  function updateBrandFilter(perfumes) {
    const selectedBrand = selectBrand.value;
    const brands = Array.from(new Set(perfumes.map((p) => p.marca.trim()))).sort();

    selectBrand.innerHTML = '<option value="todas">Todas as Marcas</option>';
    brands.forEach((brand) => {
      const opt = document.createElement('option');
      opt.value = brand;
      opt.textContent = brand;
      if (brand === selectedBrand) {
        opt.selected = true;
      }
      selectBrand.appendChild(opt);
    });
  }

  // ==========================================
  // 7. Atualização das Estatísticas e Conexão
  // ==========================================
  async function refreshStats() {
    try {
      const [statsRes, healthRes] = await Promise.all([
        PerfumeAPI.getStats(),
        PerfumeAPI.checkHealth()
      ]);

      if (statsRes && statsRes.stats) {
        statTotal.textContent = statsRes.stats.total;
        statMarcas.textContent = statsRes.stats.totalMarcas;
        statPrecoMedio.textContent = formatBRL(statsRes.stats.precoMedio);
      }

      if (healthRes && healthRes.database) {
        const isConnected = healthRes.database === 'Conectado';
        statDbStatus.textContent = isConnected ? 'MongoDB Conectado' : 'Armazenamento Ativo';
        statDbStatus.className = `stat-value badge-status ${isConnected ? 'connected' : 'disconnected'}`;
      }
    } catch (err) {
      console.warn('Erro ao atualizar estatísticas:', err);
    }
  }

  // ==========================================
  // 8. Carga dos Perfumes
  // ==========================================
  async function loadPerfumes() {
    loadingState.style.display = 'block';
    perfumesContainer.style.display = 'none';
    emptyState.style.display = 'none';

    const params = {
      search: inputSearch.value.trim(),
      marca: selectBrand.value,
      categoria: selectCategory.value,
      sortBy: selectSort.value
    };

    try {
      const res = await PerfumeAPI.getAll(params);
      currentPerfumes = res.data || [];
      renderPerfumes(currentPerfumes);

      // Atualiza marcas no dropdown se o filtro ainda for "todas"
      if (selectBrand.value === 'todas') {
        updateBrandFilter(currentPerfumes);
      }
      refreshStats();
    } catch (err) {
      showToast(`Erro ao carregar catálogo: ${err.message}`, 'error');
      renderPerfumes([]);
    } finally {
      loadingState.style.display = 'none';
      perfumesContainer.style.display = 'grid';
    }
  }

  // ==========================================
  // 9. Handlers de Busca e Filtros
  // ==========================================
  inputSearch.addEventListener('input', () => {
    btnClearSearch.style.display = inputSearch.value ? 'block' : 'none';
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      loadPerfumes();
    }, 300);
  });

  btnClearSearch.addEventListener('click', () => {
    inputSearch.value = '';
    btnClearSearch.style.display = 'none';
    loadPerfumes();
  });

  selectBrand.addEventListener('change', loadPerfumes);
  selectCategory.addEventListener('change', loadPerfumes);
  selectSort.addEventListener('change', loadPerfumes);

  // ==========================================
  // 10. Modais: Abertura e Fechamento
  // ==========================================
  function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Fechar ao pressionar ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(modalCreate);
      closeModal(modalEdit);
      closeModal(modalDelete);
    }
  });

  // Fechar ao clicar no backdrop (fora do diálogo)
  [modalCreate, modalEdit, modalDelete].forEach((m) => {
    m.addEventListener('click', (e) => {
      if (e.target === m) closeModal(m);
    });
  });

  // Modal de Criação
  btnOpenCreateModal.addEventListener('click', () => {
    formCreate.reset();
    createImgPreview.style.display = 'none';
    createImgPlaceholder.style.display = 'block';
    createImgPlaceholder.textContent = 'Pré-visualização da imagem aparecerá aqui';
    clearValidationErrors(formCreate);
    openModal(modalCreate);
    createMarca.focus();
  });

  btnEmptyAction.addEventListener('click', () => {
    btnOpenCreateModal.click();
  });

  btnCloseCreateModal.addEventListener('click', () => closeModal(modalCreate));
  btnCancelCreate.addEventListener('click', () => closeModal(modalCreate));

  // Modal de Edição
  function openEditModal(perfume) {
    const id = perfume.id || perfume._id;
    editId.value = id;
    editMarca.value = perfume.marca || '';
    editModelo.value = perfume.modelo || '';
    editPreco.value = formatBRL(perfume.preco || 0);
    editCategoria.value = perfume.categoria || 'Unissex';
    editFoto.value = perfume.foto || '';
    editDescricao.value = perfume.descricao || '';

    // Dispara preview da foto
    editFoto.dispatchEvent(new Event('input'));
    clearValidationErrors(formEdit);
    openModal(modalEdit);
    editMarca.focus();
  }

  btnCloseEditModal.addEventListener('click', () => closeModal(modalEdit));
  btnCancelEdit.addEventListener('click', () => closeModal(modalEdit));

  // Modal de Exclusão
  function openDeleteModal(perfume) {
    const id = perfume.id || perfume._id;
    pendingDeleteId = id;
    deletePerfumeName.textContent = `"${perfume.modelo}" (${perfume.marca})`;
    openModal(modalDelete);
  }

  btnCloseDeleteModal.addEventListener('click', () => closeModal(modalDelete));
  btnCancelDelete.addEventListener('click', () => closeModal(modalDelete));

  btnConfirmDelete.addEventListener('click', async () => {
    if (!pendingDeleteId) return;

    btnConfirmDelete.disabled = true;
    btnConfirmDelete.textContent = 'Excluindo...';

    try {
      await PerfumeAPI.delete(pendingDeleteId);
      showToast('Perfume removido da coleção com sucesso!', 'success');
      closeModal(modalDelete);
      loadPerfumes();
    } catch (err) {
      showToast(`Falha ao excluir perfume: ${err.message}`, 'error');
    } finally {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.textContent = 'Excluir Produto';
      pendingDeleteId = null;
    }
  });

  // ==========================================
  // 11. Validações e Submissão de Formulários
  // ==========================================
  function clearValidationErrors(form) {
    form.querySelectorAll('.field-error').forEach((el) => (el.textContent = ''));
  }

  function validatePerfumeForm({ marca, modelo, preco, foto }, prefix) {
    let isValid = true;

    if (!marca || marca.trim().length < 2) {
      document.getElementById(`err-${prefix}-marca`).textContent = 'A marca deve ter no mínimo 2 caracteres.';
      isValid = false;
    } else {
      document.getElementById(`err-${prefix}-marca`).textContent = '';
    }

    if (!modelo || modelo.trim().length < 2) {
      document.getElementById(`err-${prefix}-modelo`).textContent = 'O modelo deve ter no mínimo 2 caracteres.';
      isValid = false;
    } else {
      document.getElementById(`err-${prefix}-modelo`).textContent = '';
    }

    const numPreco = parseBRL(preco);
    if (!preco || isNaN(numPreco) || numPreco <= 0) {
      document.getElementById(`err-${prefix}-preco`).textContent = 'Informe um preço válido maior que zero.';
      isValid = false;
    } else {
      document.getElementById(`err-${prefix}-preco`).textContent = '';
    }

    if (!foto || foto.trim().length < 5) {
      document.getElementById(`err-${prefix}-foto`).textContent = 'Informe a URL da foto do perfume.';
      isValid = false;
    } else {
      document.getElementById(`err-${prefix}-foto`).textContent = '';
    }

    return isValid;
  }

  // Submissão do Cadastro (POST)
  formCreate.addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
      marca: createMarca.value.trim(),
      modelo: createModelo.value.trim(),
      preco: parseBRL(createPreco.value),
      categoria: createCategoria.value,
      foto: createFoto.value.trim(),
      descricao: createDescricao.value.trim()
    };

    if (!validatePerfumeForm(payload, 'create')) {
      return;
    }

    const btnSubmit = document.getElementById('btn-submit-create');
    setButtonLoading(btnSubmit, true);

    try {
      const res = await PerfumeAPI.create(payload);
      showToast(res.message || 'Perfume cadastrado com sucesso!', 'success');
      closeModal(modalCreate);
      loadPerfumes();
    } catch (err) {
      showToast(`Erro ao cadastrar: ${err.message}`, 'error');
    } finally {
      setButtonLoading(btnSubmit, false, 'Salvar Perfume');
    }
  });

  // Submissão da Edição (PUT)
  formEdit.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = editId.value;
    const payload = {
      marca: editMarca.value.trim(),
      modelo: editModelo.value.trim(),
      preco: parseBRL(editPreco.value),
      categoria: editCategoria.value,
      foto: editFoto.value.trim(),
      descricao: editDescricao.value.trim()
    };

    if (!validatePerfumeForm(payload, 'edit')) {
      return;
    }

    const btnSubmit = document.getElementById('btn-submit-edit');
    setButtonLoading(btnSubmit, true);

    try {
      const res = await PerfumeAPI.update(id, payload);
      showToast(res.message || 'Perfume atualizado com sucesso!', 'success');
      closeModal(modalEdit);
      loadPerfumes();
    } catch (err) {
      showToast(`Erro ao atualizar: ${err.message}`, 'error');
    } finally {
      setButtonLoading(btnSubmit, false, 'Atualizar Alterações');
    }
  });

  // ==========================================
  // 12. Botão de Amostras Demonstrativas (Seed)
  // ==========================================
  btnSeed.addEventListener('click', async () => {
    if (!confirm('Deseja recarregar a coleção com as fragrâncias de demonstração?')) {
      return;
    }

    btnSeed.disabled = true;
    btnSeed.textContent = 'Carregando...';

    try {
      const res = await PerfumeAPI.seed();
      showToast(res.message || 'Fragrâncias demonstrativas carregadas com sucesso!', 'success');
      loadPerfumes();
    } catch (err) {
      showToast(`Falha ao carregar amostras: ${err.message}`, 'error');
    } finally {
      btnSeed.disabled = false;
      btnSeed.innerHTML = '<span>🔄</span> Carregar Amostras';
    }
  });

  // ==========================================
  // 13. Inicialização
  // ==========================================
  loadPerfumes();
});
