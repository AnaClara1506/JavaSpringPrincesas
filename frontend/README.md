# 👑 Reino Encantado • CRUD de Princesas Disney

Aplicação frontend completa desenvolvida em **HTML5**, **CSS3** e **JavaScript moderno (Vanilla JS)** integrada ao backend **Spring Boot** com **PostgreSQL**.

---

## 🌸 Tema e Design
- **Paleta de Cores**: Tons suaves e elegantes de rosa pastel (`#ff758c`, `#fce4ec`, `#f8bbd0`), acentos em **Ouro Real** (`#d4af37`), efeito frosted glass (vidro jateado / glassmorphism) e sombras delicadas.
- **Elementos Visuais**: Coroas reais 👑, varinhas mágicas 🪄, espelho encantado 🪞, sapatilhas de cristal 👠, partículas de brilho flutuantes ✨ e cartões com auras na cor do vestido de cada princesa.
- **Tipografia Nobre**: Fontes *Cinzel Decorative*, *Playfair Display* e *Poppins* (Google Fonts).

---

## 🎯 Funcionalidades e Verbos HTTP Integrados

O frontend consome rigorosamente os endpoints existentes no backend:

| Verbo HTTP | Endpoint | Descrição |
|---|---|---|
| **POST** | `/princesa` | Cadastra uma nova princesa enviando o JSON no corpo da requisição. |
| **GET** | `/princesa?nome={nome}` | Busca e carrega os dados de uma princesa existente pelo nome. |
| **PUT** | `/princesa?id={id}` | Atualiza os dados de uma princesa pelo seu `id` (parâmetro de query) enviando os novos dados no corpo. |
| **DELETE** | `/princesa?nome={nome}` | Remove a princesa do banco de dados pelo seu nome. |
| **GET** *(extra)* | `/princesa/todas` | Sincroniza e lista todas as princesas cadastradas no banco de dados. |

### Componentes da Interface:
1. **Espaço para Digitar os Dados**:
   - 👑 **Nome da Princesa** (`nome`)
   - 🎬 **Nome do Filme** (`nome_filme`)
   - 👗 **Cor do Vestido** (`cor_vestido`) com amostra visual em tempo real e paleta de cores clássicas Disney (Cinderela, Bela, Aurora, Tiana, Rapunzel, Jasmine).
   - 📅 **Ano de Lançamento** (`ano_filme`)
   - 🏷️ **ID no Banco** (campo visível e carregado no modo de edição)

2. **Espaço para Mostrá-los ("Mostrar conforme a pessoa envia os dados")**:
   - Galeria Real reativa onde cada princesa enviada ou buscada aparece instantaneamente como um card elegante.
   - Cada card possui os dados completos, indicador de cor do vestido e botões rápidos de **Editar** (preenche o formulário) e **Excluir** (remove via DELETE).
   - Barra de busca rápida por nome no topo da galeria.

3. **Botões de Ação**:
   - 💖 **Cadastrar Princesa** (POST)
   - 👑 **Atualizar Princesa** (PUT)
   - 🗑️ **Deletar Princesa** (DELETE)
   - 🧹 **Limpar Campos** (reseta o formulário e retorna ao modo de novo cadastro)
   - 🔍 **Buscar** (GET)
   - 🔄 **Sincronizar** (recarrega do banco de dados)

---

## 🚀 Como Executar

### 1. Iniciar o Banco de Dados (PostgreSQL)
Certifique-se de que o serviço do PostgreSQL está ativo na porta `5432` com o banco `cadastro_princesa` (conforme configurado em `src/main/resources/application.properties`):
```sql
CREATE DATABASE cadastro_princesa;
```

### 2. Iniciar o Backend Spring Boot
No terminal, dentro da pasta do projeto (`cadastro-princesa`):
```bash
# Executar com Maven (usando Java 21 ou superior)
.\mvnw.cmd spring-boot:run
```
O servidor iniciará em `http://localhost:8080`.

### 3. Abrir o Frontend
Você tem duas formas simples de acessar:

- **Forma 1 (Direto pelo Spring Boot)**:
  Com o backend rodando, abra o navegador e acesse:
  [http://localhost:8080/](http://localhost:8080/)
  *(Os arquivos estáticos já estão configurados em `src/main/resources/static/`)*

- **Forma 2 (Separado / Live Server / Navegador)**:
  Abra o arquivo `frontend/index.html` diretamente em seu navegador (ou via extensão Live Server no VS Code). O backend possui suporte a CORS habilitado (`@CrossOrigin(origins = "*")`).
