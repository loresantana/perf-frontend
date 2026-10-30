/**
 * L'Essence - Camada de Comunicação com a API REST via Fetch API
 */
const PerfumeAPI = (() => {
  // Se estiver rodando em Live Server ou arquivo estático separado na porta 5500/8080,
  // aponta para o backend local na porta 3000; caso contrário, usa rota relativa /api
  const isDevStandaloneFrontend = window.location.port && !['3000'].includes(window.location.port);
const BASE_URL = 'https://perf-backend.vercel.app/api/perfumes';

const HEALTH_URL = 'https://perf-backend.vercel.app/api/health';
  /**
   * Trata a resposta HTTP do fetch e extrai o JSON ou lança erro amigável
   */
  async function handleResponse(response) {
    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error(`Erro de comunicação com o servidor (${response.status})`);
    }

    if (!response.ok) {
      const errorMsg = data.error || (data.details && data.details[0]) || `Erro na requisição (${response.status})`;
      const error = new Error(errorMsg);
      error.details = data.details || [];
      error.status = response.status;
      throw error;
    }

    return data;
  }

  return {
    /**
     * Busca lista de perfumes com parâmetros de busca e filtros
     */
    async getAll(params = {}) {
      const url = new URL(BASE_URL, window.location.origin);
      Object.keys(params).forEach((key) => {
        if (params[key] && params[key] !== 'todas') {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return handleResponse(response);
    },

    /**
     * Busca um perfume específico por ID
     */
    async getById(id) {
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return handleResponse(response);
    },

    /**
     * Cadastra um novo perfume
     */
    async create(perfumeData) {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(perfumeData)
      });
      return handleResponse(response);
    },

    /**
     * Atualiza um perfume existente
     */
    async update(id, perfumeData) {
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(perfumeData)
      });
      return handleResponse(response);
    },

    /**
     * Exclui um perfume pelo ID
     */
    async delete(id) {
      const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      return handleResponse(response);
    },

    /**
     * Carrega perfumes de amostra demonstrativa
     */
    async seed() {
      const response = await fetch(`${BASE_URL}/seed`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' }
      });
      return handleResponse(response);
    },

    /**
     * Retorna resumo estatístico dos perfumes
     */
    async getStats() {
      const response = await fetch(`${BASE_URL}/stats`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      return handleResponse(response);
    },

    /**
     * Checa a saúde da API e status do MongoDB
     */
    async checkHealth() {
      try {
        const response = await fetch(HEALTH_URL, {
          method: 'GET',
          headers: { 'Accept': 'application/json' }
        });
        return await handleResponse(response);
      } catch (err) {
        return { success: false, database: 'Offline' };
      }
    }
  };
})();
