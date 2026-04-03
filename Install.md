# 📦 INSTRUÇÕES DE INSTALAÇÃO DOS ARQUIVOS

Este documento explica onde colocar cada arquivo que criei para você.

## 🗂️ Estrutura de Diretórios

Crie esta estrutura no seu projeto:

```
seu-projeto/
├── PRO_Dados_Teste/           # Já existe
│   ├── models.py              # Já existe
│   ├── 01_criar_banco.py      # Já existe
│   ├── 02_coletar_ipca.py     # Já existe
│   ├── 03_scraper_giassi.py   # Já existe
│   ├── 04_carregar_produtos.py # Já existe
│   ├── 05_gerar_relatorios.py # Já existe
│   └── api_cesta_basica.py    # ⭐ NOVO - Copiar daqui
│
└── frontend/                   # Já existe
    ├── src/
    │   ├── App.jsx            # ⭐ SUBSTITUIR com novo
    │   ├── App.css            # ⭐ SUBSTITUIR com novo
    │   ├── pages/             # ⭐ CRIAR esta pasta
    │   │   ├── Dashboard.jsx  # ⭐ NOVO
    │   │   ├── Comparativo.jsx # ⭐ NOVO
    │   │   ├── Analise.jsx    # ⭐ NOVO
    │   │   └── Status.jsx     # ⭐ NOVO
    │   └── main.jsx           # Manter o existente
    ├── package.json           # Manter o existente
    └── vite.config.js         # Manter o existente
```

---

## 📋 PASSO A PASSO

### 1️⃣ Backend - API FastAPI

**Arquivo:** `api_cesta_basica.py`  
**Localização:** `PRO_Dados_Teste/api_cesta_basica.py`

```bash
# Copiar o arquivo api_cesta_basica.py para:
PRO_Dados_Teste/api_cesta_basica.py
```

**Conteúdo está em:** `/home/claude/api_cesta_basica.py`

---

### 2️⃣ Frontend - App Principal

**Arquivo:** `App.jsx`  
**Localização:** `frontend/src/App.jsx`  
**Ação:** SUBSTITUIR o arquivo existente

**Conteúdo está em:** `/home/claude/frontend_app.jsx`

---

### 3️⃣ Frontend - Estilos

**Arquivo:** `App.css`  
**Localização:** `frontend/src/App.css`  
**Ação:** SUBSTITUIR o arquivo existente

**Conteúdo está em:** `/home/claude/frontend_app.css`

---

### 4️⃣ Frontend - Páginas (CRIAR PASTA)

**Criar pasta:** `frontend/src/pages/`

Depois adicionar 4 arquivos:

#### Dashboard.jsx
**Localização:** `frontend/src/pages/Dashboard.jsx`  
**Conteúdo está em:** `/home/claude/pages_Dashboard.jsx`

#### Comparativo.jsx
**Localização:** `frontend/src/pages/Comparativo.jsx`  
**Conteúdo está em:** `/home/claude/pages_Comparativo.jsx`

#### Analise.jsx
**Localização:** `frontend/src/pages/Analise.jsx`  
**Conteúdo está em:** `/home/claude/pages_Analise.jsx`

#### Status.jsx
**Localização:** `frontend/src/pages/Status.jsx`  
**Conteúdo está em:** `/home/claude/pages_Status.jsx`

---

## 🚀 EXECUÇÃO

### Backend

```bash
# 1. Vá para a pasta do backend
cd PRO_Dados_Teste

# 2. Execute o pipeline (se ainda não executou)
python 01_criar_banco.py
python 02_coletar_ipca.py
python -m scrapy runspider 03_scraper_giassi.py
python 04_carregar_produtos.py

# 3. Inicie a API
python api_cesta_basica.py
```

A API estará em: **http://localhost:8000**  
Documentação: **http://localhost:8000/docs**

---

### Frontend

```bash
# 1. Vá para a pasta frontend
cd frontend

# 2. Instale dependências (primeira vez)
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará em: **http://localhost:5173**

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Copiar `api_cesta_basica.py` para `PRO_Dados_Teste/`
- [ ] Substituir `frontend/src/App.jsx`
- [ ] Substituir `frontend/src/App.css`
- [ ] Criar pasta `frontend/src/pages/`
- [ ] Adicionar `Dashboard.jsx` em `pages/`
- [ ] Adicionar `Comparativo.jsx` em `pages/`
- [ ] Adicionar `Analise.jsx` em `pages/`
- [ ] Adicionar `Status.jsx` em `pages/`
- [ ] Executar `npm install` no frontend
- [ ] Testar: rodar API (`python api_cesta_basica.py`)
- [ ] Testar: rodar Frontend (`npm run dev`)

---

## 🎯 RESULTADO ESPERADO

Quando tudo estiver funcionando:

1. **API rodando:** http://localhost:8000
2. **Frontend rodando:** http://localhost:5173
3. **Dashboard mostra:** KPIs com dados reais do banco
4. **Navegação funciona:** Botões da sidebar trocam entre páginas
5. **Status mostra:** Integridade do pipeline

---

## 🆘 PROBLEMAS COMUNS

### ❌ "Module not found: pages/Dashboard"
**Solução:** Verifique se criou a pasta `frontend/src/pages/`

### ❌ "Failed to fetch" no Frontend
**Solução:** API não está rodando. Execute `python api_cesta_basica.py`

### ❌ Página em branco
**Solução:** Abra o console do navegador (F12) e veja os erros

### ❌ CORS Error
**Solução:** Certifique-se que API está na porta 8000 e frontend na 5173

---

## 📞 ARQUIVOS CRIADOS

Todos os arquivos estão em `/home/claude/` com estes nomes:

1. `api_cesta_basica.py` → Backend API
2. `frontend_app.jsx` → App.jsx do React
3. `frontend_app.css` → App.css com estilos
4. `pages_Dashboard.jsx` → Página Dashboard
5. `pages_Comparativo.jsx` → Página Comparativo
6. `pages_Analise.jsx` → Página Análise
7. `pages_Status.jsx` → Página Status
8. `README_PROJETO.md` → Documentação completa

---

Boa sorte com seu projeto! 🚀