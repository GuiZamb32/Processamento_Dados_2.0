#  Pipeline de Dados — Cesta Básica (Versão Profissional)

**Dashboard Interativo com React + FastAPI para Análise de Preços da Cesta Básica**

Sistema completo de ETL e visualização para análise do custo da cesta básica em Florianópolis/SC, integrando:
-  Web Scraping do Giassi Supermercados
-  Série histórica do IPCA (Banco Central)
-  Banco de dados SQLite
-  API REST com FastAPI
-  Dashboard React moderno e responsivo

---

##  Funcionalidades

### Backend (Python + FastAPI)
-  Coleta automatizada de preços via web scraping (Scrapy)
-  Integração com API do Banco Central (IPCA)
-  Banco de dados relacional (SQLite + SQLAlchemy)
-  API REST com documentação automática (FastAPI)
-  Cálculos de deflação histórica (2016-2024)

### Frontend (React)
-  **Dashboard**: KPIs principais e resumo consolidado
-  **Composição**: Detalhamento completo dos produtos por categoria
-  **Histórico**: Gráficos de progressão com deflação IPCA
-  **Status**: Monitoramento da integridade do pipeline

---

##  Estrutura do Projeto

```
pipeline-cesta-basica/
├── backend/
│   ├── models.py                  # Modelos SQLAlchemy (tabelas)
│   ├── 01_criar_banco.py          # Cria schema e categorias
│   ├── 02_coletar_ipca.py         # Coleta IPCA do Banco Central
│   ├── 03_scraper_giassi.py       # Spider Scrapy (web scraping)
│   ├── 04_carregar_produtos.py    # ETL: JSON → SQLite
│   ├── 05_gerar_relatorios.py     # Relatórios em terminal
│   ├── api_cesta_basica.py        # API FastAPI
│   ├── cesta_basica.db            # Banco SQLite (gerado)
│   ├── produtos_cesta.json        # Saída do scraper (gerado)
│   └── cache/                     # Cache HTTP do Scrapy
│
└── frontend/
    ├── src/
    │   ├── App.jsx                # App principal com navegação
    │   ├── App.css                # Estilos globais
    │   ├── pages/
    │   │   ├── Dashboard.jsx      # Página de KPIs
    │   │   ├── Comparativo.jsx    # Composição detalhada
    │   │   ├── Analise.jsx        # Progressão histórica
    │   │   └── Status.jsx         # Status do pipeline
    │   └── main.jsx               # Entry point
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

##  Instalação e Execução

### 1️ Requisitos
- **Python 3.10+**
- **Node.js 18+** 
- **npm** ou **yarn**

### 2️ Backend - Instalação

```bash
# Instalar dependências Python
pip install scrapy sqlalchemy pandas requests fastapi uvicorn

# Ou com requirements.txt
pip install -r requirements.txt
```

### 3️ Backend - Execução do Pipeline

Execute os scripts **na ordem**:

```bash
# 1. Criar banco de dados e categorias
python 01_criar_banco.py

# 2. Coletar série histórica do IPCA (2015-2024)
python 02_coletar_ipca.py

# 3. Web scraping dos produtos (Giassi)
# ATENÇÃO: Primeira execução pode demorar ~10 minutos
python -m scrapy runspider 03_scraper_giassi.py

# 4. Carregar produtos no banco
python 04_carregar_produtos.py

# 5. (Opcional) Ver relatórios no terminal
python 05_gerar_relatorios.py
```

### 4️ Backend - Iniciar API

```bash
# Iniciar servidor FastAPI
python api_cesta_basica.py

# API estará disponível em:
# http://localhost:8000
# Documentação interativa: http://localhost:8000/docs
```

### 5️ Frontend - Instalação

```bash
cd frontend

# Instalar dependências
npm install

# Ou com yarn
yarn install
```

### 6️ Frontend - Executar

```bash
# Modo desenvolvimento (com hot reload)
npm run dev

# Aplicação estará em: http://localhost:5173
```

---

##  Endpoints da API

| Endpoint | Método | Descrição |
|----------|--------|-----------|
| `/` | GET | Informações da API |
| `/api/dashboard` | GET | KPIs principais |
| `/api/cesta/menor` | GET | Composição cesta menor valor |
| `/api/cesta/maior` | GET | Composição cesta maior valor |
| `/api/historico` | GET | Progressão histórica (deflação IPCA) |
| `/api/status` | GET | Status e integridade do pipeline |

### Exemplo de Resposta - Dashboard

```json
{
  "cesta_menor_valor": 145.20,
  "cesta_maior_valor": 210.50,
  "complemento_menor": 18.90,
  "complemento_maior": 32.40,
  "total_menor_completo": 164.10,
  "total_maior_completo": 242.90,
  "ipca_acumulado_anual": 4.52,
  "total_produtos": 120
}
```

---

##  Design System

### Paleta de Cores

```css
/* Backgrounds */
--bg-deep: #0a0a0a        /* Fundo principal */
--bg-card: #1f1f1f        /* Cards e containers */
--bg-elevated: #1a1a1a    /* Elementos elevados */

/* Brand */
--brand-primary: #016FE1  /* Azul principal */
--success: #04BDA2        /* Verde (menor valor) */
--danger: #bd0404         /* Vermelho (maior valor) */
--warning: #f59e0b        /* Laranja (avisos) */

/* Text */
--text-primary: #e8e8e8   /* Texto principal */
--text-secondary: #a8a8a8 /* Texto secundário */
--text-muted: #6a6a6a     /* Texto discreto */
```

---

##  Tecnologias Utilizadas

### Backend
- **Python 3.10+**
- **FastAPI** — Framework web moderno e rápido
- **SQLAlchemy** — ORM para banco de dados
- **Scrapy** — Framework de web scraping
- **Pandas** — Manipulação de dados
- **Uvicorn** — Servidor ASGI

### Frontend
- **React 18** — Biblioteca UI
- **Vite** — Build tool ultrarrápido
- **CSS Modules** — Estilos encapsulados
- **Fetch API** — Comunicação com backend

### Dados
- **SQLite** — Banco de dados embutido
- **API Banco Central** — Série histórica IPCA (SGS 433)
- **Giassi.com.br** — Fonte de preços (web scraping)

---

##  Metodologia

### Cesta Básica (5 itens obrigatórios)
1. Arroz (5kg)
2. Feijão (2kg)
3. Óleo de Soja (900ml)
4. Açúcar (1kg)
5. Café (500g)

### Complemento (3 itens adicionais)
6. Macarrão (1kg)
7. Farinha (500g)
8. Sal (1kg)

### Cálculo de Deflação Histórica

**Fórmula:**
```
valor_ano_anterior = valor_atual ÷ (1 + IPCA_acumulado / 100)
```

**IPCA Acumulado Anual:**
```
IPCA_ano = ∏(1 + taxa_mensal / 100) - 1
```

---

##  Configurações Avançadas

### Cache do Scrapy
O scraper usa cache HTTP de 24 horas para evitar sobrecarga no site:

```python
# Em 03_scraper_giassi.py
HTTPCACHE_ENABLED = True
HTTPCACHE_EXPIRATION_SECS = 86400  # 24 horas
```

### Modificar Delay entre Requisições
```python
# Em 03_scraper_giassi.py
DOWNLOAD_DELAY = 2  # segundos entre requisições
RANDOMIZE_DOWNLOAD_DELAY = True
```

### CORS da API
Para produção, modifique os origins permitidos:

```python
# Em api_cesta_basica.py
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://seu-dominio.com"],  # Específico para produção
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🐛 Troubleshooting

### ❌ Erro: "Sem produtos no banco"
**Solução:** Execute o pipeline completo na ordem (passos 1-4)

### ❌ Erro: "API não disponível" no Frontend
**Solução:** Verifique se `python api_cesta_basica.py` está rodando

### ❌ Scraper não encontra produtos
**Solução:** O site pode ter mudado estrutura. Verifique os seletores CSS em `03_scraper_giassi.py`

### ❌ CORS Error no navegador
**Solução:** Certifique-se que API e Frontend estão nas portas corretas (8000 e 5173)

---

##  Licença

Projeto acadêmico - **UniSENAI SC 2025/1**  
Disciplina: BI e Data Visualization

---

##  Autor

**Seu Nome**  
Pipeline de Dados - Análise de Cesta Básica  
[Seu LinkedIn] | [Seu GitHub]

---

##  Créditos

- **Dados IPCA:** Banco Central do Brasil (API SGS 433)
- **Preços:** Giassi Supermercados (web scraping educacional)
- **Frameworks:** FastAPI, React, Scrapy
- **Instituição:** UniSENAI Santa Catarina
