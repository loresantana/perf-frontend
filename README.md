# 🌸 L'Essence — Sistema de Gerenciamento de Perfumes

Mini sistema Full Stack completo para gerenciamento de catálogo de perfumes (cadastrar, listar, buscar, filtrar, editar e excluir), com backend em **Node.js + Express + MongoDB/Mongoose**, frontend moderno em **HTML5 + CSS3 + Vanilla JavaScript (Fetch API)** e pronto para deploy na **Vercel**.

---

## 📋 Índice
1. [Visão Geral e Funcionalidades](#-visão-geral-e-funcionalidades)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
4. [Campos do Perfume](#-campos-do-perfume)
5. [Instalação e Execução Local](#-instalação-e-execução-local)
6. [Configuração do Banco de Dados (MongoDB)](#-configuração-do-banco-de-dados-mongodb)
7. [Documentação da API REST](#-documentação-da-api-rest)
8. [Testes Automatizados](#-testes-automatizados)
9. [Guia de Deploy na Vercel](#-guia-de-deploy-na-vercel)
10. [Boas Práticas e Segurança](#-boas-práticas-e-segurança)

---

## ✨ Visão Geral e Funcionalidades

- **CRUD Completo de Perfumes:**
  - **Cadastrar:** Formulário com validações em tempo real, máscara de moeda (R$), pré-visualização instantânea da foto e preenchimento rápido com fotos de amostra.
  - **Visualizar / Listar:** Catálogo em grid responsivo com cartões elegantes, badges por marca e categoria, notas olfativas e preço formatado.
  - **Editar:** Modal intuitivo para atualização de qualquer campo com validações ativas.
  - **Excluir:** Diálogo de confirmação para prevenir exclusões acidentais.
- **Busca e Filtros Avançados:**
  - Busca instantânea por Marca, Modelo ou Notas Olfativas com debounce.
  - Filtro dinâmico por Marcas presentes no catálogo.
  - Filtro por Categoria (Masculino, Feminino, Unissex).
  - Ordenação por: Mais Recentes, Menor Preço, Maior Preço e Ordem Alfabética (A-Z).
- **Dashboard de Estatísticas:**
  - Total de perfumes cadastrados.
  - Quantidade de marcas distintas.
  - Média de preço da coleção em R$.
  - Indicador de status da conexão com o banco de dados.
- **Botão de Amostras Demonstrativas (Seed):** Carregamento rápido de fragrâncias de prestígio (Dior, Chanel, Tom Ford, Lancôme, Armani, Carolina Herrera) para demonstração imediata.
- **Feedback ao Usuário:** Sistema de notificações Toast (Sucesso, Erro, Alerta) e micro-animações.

---

## 📂 Estrutura do Projeto

Separação estrita e modular entre Frontend e Backend:

```text
gerenciador-perfumes/
├── backend/
│   ├── api/
│   │   └── index.js               # Handler Serverless para deploy na Vercel
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Conexão MongoDB com connection pooling para serverless
│   │   ├── controllers/
│   │   │   └── perfumeController.js # Lógica de negócio do CRUD, busca e estatísticas
│   │   ├── middlewares/
│   │   │   └── errorHandler.js    # Tratamento centralizado de erros e rotas 404
│   │   ├── models/
│   │   │   └── Perfume.js         # Model Mongoose com validações de campos
│   │   ├── routes/
│   │   │   └── perfumeRoutes.js   # Definição das rotas REST
│   │   ├── app.js                 # Configuração do Express, CORS e arquivos estáticos
│   │   └── server.js              # Inicialização do servidor HTTP local
│   ├── tests/
│   │   └── perfume.test.js        # Testes de integração (Jest + Supertest)
│   ├── .env.example               # Exemplo de variáveis de ambiente
│   ├── package.json               # Dependências e scripts do backend
│   └── vercel.json                # Configuração de rotas da API na Vercel
├── frontend/
│   ├── css/
│   │   └── styles.css             # Estilização com design system luxo minimalista
│   ├── js/
│   │   ├── api.js                 # Camada de comunicação REST via Fetch API
│   │   └── app.js                 # Lógica de interface, máscaras, modais e eventos (Vanilla JS)
│   ├── assets/                    # Recursos estáticos adicionais
│   └── index.html                 # Interface SPA sem frameworks
├── package.json                   # Scripts unificados da raiz
├── vercel.json                    # Configuração de deploy completo na Vercel
└── README.md                      # Documentação completa
```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** (v18+)
- **Express.js** (Framework web minimalista para APIs REST)
- **MongoDB** (Banco de dados NoSQL)
- **Mongoose** (Modelagem de dados, esquemas e validações rigorosas)
- **CORS** (Controle de acesso entre origens)
- **Dotenv** (Gerenciamento seguro de variáveis de ambiente)
- **Jest & Supertest** (Testes de integração automatizados)

### Frontend
- **HTML5** (Semântico e acessível)
- **CSS3** (Variáveis CSS, CSS Grid, Flexbox, backdrop-filter, animações suaves)
- **Vanilla JavaScript puro** (Sem React, Vue ou Angular, seguindo as diretrizes)
- **Fetch API** (Comunicação assíncrona com os endpoints REST)

---

## 🏷️ Campos do Perfume

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `marca` | String | **Sim** | Marca fabricante (ex: Dior, Chanel). Mínimo 2 caracteres. |
| `modelo` | String | **Sim** | Nome da fragrância (ex: Sauvage, Bleu). Mínimo 2 caracteres. |
| `preco` | Number | **Sim** | Valor do produto em reais (R$). Deve ser $\ge 0$. |
| `foto` | String | **Sim** | URL da imagem (http/https) ou imagem em base64. |
| `descricao` | String | Não | Notas olfativas ou detalhes adicionais (até 500 caracteres). |
| `volumeMl` | Number | Não | Frasco em ml (padrão: 100 ml). |
| `categoria` | String | Não | `Masculino`, `Feminino` ou `Unissex` (padrão: `Unissex`). |
| `createdAt` | Date | Auto | Data de criação gerada pelo Mongoose. |
| `updatedAt` | Date | Auto | Data de última atualização gerada pelo Mongoose. |

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- **Node.js** instalado (versão 18 ou superior).
- Gerenciador de pacotes **npm**.
- (Opcional) Instância do **MongoDB** local ou uma URI do **MongoDB Atlas**.

> 💡 **Nota de Resiliência:** Caso você não tenha o MongoDB instalado localmente no momento do teste, o sistema inicializa com um armazenamento demonstrativo em memória com 6 perfumes pré-configurados. Você pode testar todas as funcionalidades do frontend e backend imediatamente!

### 1. Clonar ou navegar até a pasta
```bash
cd gerenciador-perfumes
```

### 2. Instalar as dependências
```bash
npm run install:backend
# ou
cd backend && npm install
```

### 3. Configurar variáveis de ambiente
Copie o arquivo `.env.example` para `.env` dentro de `backend/`:
```bash
cp backend/.env.example backend/.env
```

Conteúdo padrão do `backend/.env`:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/perfumes_db
```

### 4. Iniciar o servidor
A partir da raiz do projeto:
```bash
npm start
```
Ou no modo de desenvolvimento com hot-reload:
```bash
npm run dev
```

### 5. Acessar a aplicação
- **Frontend & Aplicação Completa:** [http://localhost:3000](http://localhost:3000)
- **API Endpoint Perfumes:** [http://localhost:3000/api/perfumes](http://localhost:3000/api/perfumes)
- **Health Check da API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## 🗄️ Configuração do Banco de Dados (MongoDB)

### Opção A: MongoDB Atlas (Nuvem - Recomendado para Produção / Vercel)
1. Crie uma conta gratuita no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Crie um Cluster gratuito (M0).
3. Em **Database Access**, crie um usuário e senha.
4. Em **Network Access**, adicione a regra `0.0.0.0/0` (permitir acesso de qualquer IP para Serverless da Vercel).
5. Obtenha a Connection String (ex: `mongodb+srv://usuario:senha@cluster0.mongodb.net/perfumes_db?retryWrites=true&w=majority`).
6. Cole no seu `backend/.env` ou nas variáveis da Vercel como `MONGODB_URI`.

### Opção B: MongoDB Local
Inicie o serviço do MongoDB na sua máquina e aponte para:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/perfumes_db
```

---

## 📡 Documentação da API REST

### Resumo dos Endpoints

| Método | Rota | Descrição | Status Retornado |
|---|---|---|---|
| `GET` | `/api/health` | Verifica a integridade da API e estado do MongoDB | `200 OK` |
| `GET` | `/api/perfumes` | Lista perfumes (com filtros, busca e ordenação) | `200 OK` |
| `GET` | `/api/perfumes/stats` | Retorna métricas consolidadas (total, marcas, médias) | `200 OK` |
| `GET` | `/api/perfumes/:id` | Retorna detalhes de um perfume específico | `200 OK` / `404 Not Found` |
| `POST` | `/api/perfumes` | Cadastra um novo perfume | `201 Created` / `400 Bad Request` |
| `PUT` | `/api/perfumes/:id` | Atualiza dados de um perfume existente | `200 OK` / `400` / `404` |
| `DELETE` | `/api/perfumes/:id` | Remove um perfume do catálogo | `200 OK` / `404 Not Found` |
| `POST` | `/api/perfumes/seed` | Repovoa a base com amostras de perfumes reais | `201 Created` |

### Exemplos de Requisição e Resposta

#### 1. Cadastrar Perfume (`POST /api/perfumes`)
**Payload:**
```json
{
  "marca": "Tom Ford",
  "modelo": "Oud Wood",
  "preco": 1490.00,
  "foto": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
  "categoria": "Unissex",
  "descricao": "Fragrância exótica com madeira de oud rara, sândalo e âmbar."
}
```
**Resposta (201 Created):**
```json
{
  "success": true,
  "message": "Perfume cadastrado com sucesso!",
  "data": {
    "id": "6724...",
    "marca": "Tom Ford",
    "modelo": "Oud Wood",
    "preco": 1490,
    "foto": "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
    "categoria": "Unissex",
    "descricao": "Fragrância exótica com madeira de oud rara, sândalo e âmbar.",
    "createdAt": "2026-10-30T18:00:00.000Z"
  }
}
```

#### 2. Parâmetros de Filtro (`GET /api/perfumes`)
- `?search=sauvage`: Busca por texto na marca, modelo ou descrição.
- `?marca=Dior`: Filtra apenas perfumes da marca especificada.
- `?categoria=Masculino`: Filtra por categoria.
- `?sortBy=preco_asc`: Ordena do menor para o maior preço (`preco_asc`, `preco_desc`, `nome_asc`, `data_desc`).

---

## 🧪 Testes Automatizados

A aplicação inclui uma suíte completa de testes de integração com **Jest** e **Supertest**, cobrindo rotas, validações de campos, respostas de erro e persistência.

Para executar os testes:
```bash
npm test
# ou diretamente no backend:
cd backend && npm test
```

Resultados cobertos pelos testes:
- `GET /api/health` — verificação do status da API.
- `GET /api/perfumes` — listagem, busca e ordenação.
- `GET /api/perfumes/stats` — cálculo de métricas e preços.
- `POST /api/perfumes` — cadastro bem-sucedido e rejeição de marca vazia, preço negativo ou foto ausente.
- `GET /api/perfumes/:id` — busca por id existente e tratamento de 404.
- `PUT /api/perfumes/:id` — atualização e validação de regras.
- `DELETE /api/perfumes/:id` — remoção e validação de 404 em id inexistente.
- `POST /api/perfumes/seed` — repovoamento de catálogo.

---

## ☁️ Guia de Deploy na Vercel

O projeto foi configurado com suporte nativo para Serverless Functions e reescrita de rotas na Vercel através dos arquivos `vercel.json` e `backend/api/index.js`.

### Opção 1: Deploy via Vercel CLI
1. Instale a CLI da Vercel globalmente (caso não tenha):
   ```bash
   npm i -g vercel
   ```
2. Na raiz do projeto (`gerenciador-perfumes`), execute:
   ```bash
   vercel
   ```
3. Configure as variáveis de ambiente no painel da Vercel:
   - `MONGODB_URI`: Sua string de conexão do MongoDB Atlas.
   - `NODE_ENV`: `production`

### Opção 2: Deploy via GitHub / GitLab / Bitbucket
1. Suba o repositório no GitHub.
2. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
3. Importe o repositório.
4. Em **Environment Variables**, adicione:
   - `MONGODB_URI`: string de conexão do MongoDB Atlas.
5. Clique em **Deploy**. A Vercel construirá o frontend estático e as funções Serverless da API automaticamente!

---

## 🛡️ Boas Práticas e Segurança

- **Tratamento Centralizado de Erros:** Middleware que intercepta e padroniza erros operacionais e de validação do Mongoose, sem expor stack traces em produção.
- **Sanitização de Dados:** Uso de `.trim()` em strings e validação estrita de tipos no schema Mongoose.
- **Connection Pooling Serverless:** Cache da conexão Mongoose (`cached.conn`) para evitar saturação de conexões simultâneas nas Serverless Functions da Vercel.
- **CORS Configurado:** Permite consumo seguro do backend tanto localmente quanto hospedado em domínios externos.
- **Prevenção de Injeção e IDS Inválidos:** Validação de `ObjectId.isValid` antes de consultas no MongoDB.
- **Acessibilidade & UX:** Semântica HTML5, contraste refinado, suporte a atalhos de teclado (como fechar modais com `Esc`) e feedback visual em cada ação.
