"""
API FastAPI para servir dados da Cesta Básica
Endpoints para Dashboard React - Pipeline de Dados Profissional
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text, create_engine
import pandas as pd
from typing import List, Dict
from pathlib import Path

app = FastAPI(
    title="Cesta Básica API",
    description="API REST para análise de preços da cesta básica com dados do Giassi e IPCA",
    version="1.0.0"
)

# CORS para desenvolvimento
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Engine SQLAlchemy
DB_PATH = Path(__file__).parent / "cesta_basica.db"
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)


# ═══════════════════════════════════════════════════════════
# QUERIES SQL
# ═══════════════════════════════════════════════════════════

SQL_CESTA_MENOR = """
SELECT
    c.nome AS categoria,
    c.quantidade_necessaria,
    c.unidade,
    c.complemento,
    p.nome AS produto,
    p.marca,
    p.preco AS preco_unitario,
    p.unidade_volume,
    p.preco_por_kg,
    p.url
FROM (
    SELECT p2.*, ROW_NUMBER() OVER (PARTITION BY p2.categoria_id ORDER BY p2.preco_por_kg ASC) AS rn
    FROM produto p2
    WHERE p2.preco_por_kg > 0 AND p2.preco > 0
) p
JOIN categoria c ON p.categoria_id = c.id
WHERE p.rn = 1
ORDER BY c.complemento, c.nome;
"""

SQL_CESTA_MAIOR = """
SELECT
    c.nome AS categoria,
    c.quantidade_necessaria,
    c.unidade,
    c.complemento,
    p.nome AS produto,
    p.marca,
    p.preco AS preco_unitario,
    p.unidade_volume,
    p.preco_por_kg,
    p.url
FROM (
    SELECT p2.*, ROW_NUMBER() OVER (PARTITION BY p2.categoria_id ORDER BY p2.preco_por_kg DESC) AS rn
    FROM produto p2
    WHERE p2.preco_por_kg > 0 AND p2.preco > 0
) p
JOIN categoria c ON p.categoria_id = c.id
WHERE p.rn = 1
ORDER BY c.complemento, c.nome;
"""

SQL_IPCA = """
SELECT strftime('%Y', data) AS ano, data, valor
FROM ipca
ORDER BY data;
"""


# ═══════════════════════════════════════════════════════════
# FUNÇÕES AUXILIARES
# ═══════════════════════════════════════════════════════════

def calcular_total(items: List[Dict]) -> float:
    """Calcula o total da cesta baseado no preço por kg e quantidade necessária"""
    total = 0.0
    for item in items:
        preco_ref = item.get("preco_por_kg") or item.get("preco_unitario") or 0
        qtd = item.get("quantidade_necessaria", 1)
        total += float(preco_ref) * float(qtd)
    return round(total, 2)


def calcular_ipca_acumulado_anual(df_ipca: pd.DataFrame) -> Dict[int, float]:
    """Calcula IPCA acumulado anual (juros compostos)"""
    df_ipca["ano"] = pd.to_datetime(df_ipca["data"]).dt.year
    acumulado = {}
    for ano, grupo in df_ipca.groupby("ano"):
        fator = 1.0
        for v in grupo["valor"]:
            fator *= (1 + float(v) / 100)
        acumulado[int(ano)] = round((fator - 1) * 100, 4)
    return acumulado


def deflacionar(valor_atual: float, acumulado: Dict, ano_base: int, ano_min: int = 2016) -> Dict:
    """Estima valores históricos usando deflação"""
    anos = sorted([a for a in acumulado if a >= ano_min and a < ano_base], reverse=True)
    resultado = {ano_base: round(valor_atual, 2)}
    v = valor_atual
    for ano in anos:
        v = v / (1 + acumulado[ano] / 100)
        resultado[ano] = round(v, 2)
    return resultado


# ═══════════════════════════════════════════════════════════
# ENDPOINTS
# ═══════════════════════════════════════════════════════════

@app.get("/")
def root():
    """Informações da API"""
    return {
        "api": "Cesta Básica - Pipeline de Dados",
        "version": "1.0.0",
        "description": "API REST para análise de preços com dados do Giassi e IPCA do Banco Central",
        "endpoints": {
            "dashboard": "/api/dashboard",
            "cesta_menor": "/api/cesta/menor",
            "cesta_maior": "/api/cesta/maior",
            "historico": "/api/historico",
            "status": "/api/status"
        }
    }


@app.get("/api/dashboard")
def get_dashboard():
    """
    KPIs principais para o Dashboard
    
    Returns:
        - cesta_menor_valor: valor da cesta básica mais barata
        - cesta_maior_valor: valor da cesta básica mais cara
        - complemento_menor/maior: valor adicional do complemento
        - ipca_acumulado_anual: IPCA do último ano completo
        - total_produtos: quantidade de produtos cadastrados
    """
    try:
        with engine.connect() as conn:
            df_menor = pd.read_sql(text(SQL_CESTA_MENOR), conn)
            df_maior = pd.read_sql(text(SQL_CESTA_MAIOR), conn)
            df_ipca = pd.read_sql(text(SQL_IPCA), conn)
        
        if df_menor.empty or df_maior.empty:
            raise HTTPException(status_code=404, detail="Sem produtos no banco. Execute o pipeline de coleta primeiro.")
        
        # Separar básico e complemento
        basica_menor = df_menor[df_menor['complemento'] == 0].to_dict('records')
        comp_menor = df_menor[df_menor['complemento'] == 1].to_dict('records')
        
        basica_maior = df_maior[df_maior['complemento'] == 0].to_dict('records')
        comp_maior = df_maior[df_maior['complemento'] == 1].to_dict('records')
        
        total_menor = calcular_total(basica_menor)
        total_maior = calcular_total(basica_maior)
        total_comp_menor = calcular_total(comp_menor)
        total_comp_maior = calcular_total(comp_maior)
        
        # IPCA acumulado do último ano
        ipca_acum = 0.0
        if not df_ipca.empty:
            acumulado = calcular_ipca_acumulado_anual(df_ipca)
            ipca_acum = acumulado.get(max(acumulado.keys()), 0.0)
        
        return {
            "cesta_menor_valor": total_menor,
            "cesta_maior_valor": total_maior,
            "complemento_menor": total_comp_menor,
            "complemento_maior": total_comp_maior,
            "total_menor_completo": total_menor + total_comp_menor,
            "total_maior_completo": total_maior + total_comp_maior,
            "ipca_acumulado_anual": ipca_acum,
            "total_produtos": len(df_menor),
            "itens_basica": len(basica_menor),
            "itens_complemento": len(comp_menor)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar dados: {str(e)}")


@app.get("/api/cesta/menor")
def get_cesta_menor():
    """
    Composição detalhada da cesta de menor valor
    
    Returns:
        - basica: lista de produtos da cesta básica (5 itens)
        - complemento: lista de produtos do complemento (3 itens)
        - totais parciais e completos
    """
    try:
        with engine.connect() as conn:
            df = pd.read_sql(text(SQL_CESTA_MENOR), conn)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Sem produtos cadastrados")
        
        basica = df[df['complemento'] == 0].to_dict('records')
        complemento = df[df['complemento'] == 1].to_dict('records')
        
        # Adicionar total por item
        for item in basica + complemento:
            preco_ref = item.get("preco_por_kg") or item.get("preco_unitario") or 0
            item["total_item"] = round(float(preco_ref) * float(item["quantidade_necessaria"]), 2)
        
        return {
            "tipo": "menor_valor",
            "basica": basica,
            "complemento": complemento,
            "total_basica": calcular_total(basica),
            "total_complemento": calcular_total(complemento),
            "total_completo": calcular_total(basica) + calcular_total(complemento)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar cesta menor: {str(e)}")


@app.get("/api/cesta/maior")
def get_cesta_maior():
    """
    Composição detalhada da cesta de maior valor
    
    Returns:
        - basica: lista de produtos da cesta básica (5 itens)
        - complemento: lista de produtos do complemento (3 itens)
        - totais parciais e completos
    """
    try:
        with engine.connect() as conn:
            df = pd.read_sql(text(SQL_CESTA_MAIOR), conn)
        
        if df.empty:
            raise HTTPException(status_code=404, detail="Sem produtos cadastrados")
        
        basica = df[df['complemento'] == 0].to_dict('records')
        complemento = df[df['complemento'] == 1].to_dict('records')
        
        # Adicionar total por item
        for item in basica + complemento:
            preco_ref = item.get("preco_por_kg") or item.get("preco_unitario") or 0
            item["total_item"] = round(float(preco_ref) * float(item["quantidade_necessaria"]), 2)
        
        return {
            "tipo": "maior_valor",
            "basica": basica,
            "complemento": complemento,
            "total_basica": calcular_total(basica),
            "total_complemento": calcular_total(complemento),
            "total_completo": calcular_total(basica) + calcular_total(complemento)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao buscar cesta maior: {str(e)}")


@app.get("/api/historico")
def get_historico():
    """
    Progressão histórica estimada com deflação IPCA (2016-atual)
    
    Returns:
        - timeline: array com valores estimados por ano
        - ano_base: ano de referência (preços atuais)
        - ipca_acumulado por ano
    """
    try:
        with engine.connect() as conn:
            df_menor = pd.read_sql(text(SQL_CESTA_MENOR), conn)
            df_maior = pd.read_sql(text(SQL_CESTA_MAIOR), conn)
            df_ipca = pd.read_sql(text(SQL_IPCA), conn)
        
        if df_ipca.empty:
            raise HTTPException(status_code=404, detail="Sem dados de IPCA. Execute 02_coletar_ipca.py")
        
        basica_menor = df_menor[df_menor['complemento'] == 0].to_dict('records')
        comp_menor = df_menor[df_menor['complemento'] == 1].to_dict('records')
        basica_maior = df_maior[df_maior['complemento'] == 0].to_dict('records')
        comp_maior = df_maior[df_maior['complemento'] == 1].to_dict('records')
        
        total_menor = calcular_total(basica_menor)
        total_maior = calcular_total(basica_maior)
        total_menor_comp = total_menor + calcular_total(comp_menor)
        total_maior_comp = total_maior + calcular_total(comp_maior)
        
        acumulado = calcular_ipca_acumulado_anual(df_ipca)
        ano_base = max(acumulado.keys())
        
        hist_menor = deflacionar(total_menor, acumulado, ano_base, 2016)
        hist_maior = deflacionar(total_maior, acumulado, ano_base, 2016)
        hist_menor_comp = deflacionar(total_menor_comp, acumulado, ano_base, 2016)
        hist_maior_comp = deflacionar(total_maior_comp, acumulado, ano_base, 2016)
        
        # Formatar para o frontend
        timeline = []
        for ano in sorted(hist_menor.keys()):
            timeline.append({
                "ano": ano,
                "ipca_acumulado": acumulado.get(ano, 0),
                "cesta_menor": hist_menor[ano],
                "cesta_maior": hist_maior[ano],
                "cesta_menor_completa": hist_menor_comp[ano],
                "cesta_maior_completa": hist_maior_comp[ano]
            })
        
        return {
            "ano_base": ano_base,
            "metodo": "deflacao_ipca",
            "timeline": timeline
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao gerar histórico: {str(e)}")


@app.get("/api/status")
def get_status():
    """
    Status do pipeline e integridade dos dados
    
    Returns:
        - status do banco de dados
        - contadores de registros
        - última atualização
        - status do pipeline
    """
    try:
        with engine.connect() as conn:
            # Contar registros
            count_produtos = conn.execute(text("SELECT COUNT(*) FROM produto")).scalar()
            count_ipca = conn.execute(text("SELECT COUNT(*) FROM ipca")).scalar()
            count_categorias = conn.execute(text("SELECT COUNT(*) FROM categoria")).scalar()
            
            # Última atualização IPCA
            ultima_ipca = conn.execute(
                text("SELECT MAX(data) FROM ipca")
            ).scalar()
            
            # Verificar se tem produtos por categoria
            produtos_por_categoria = pd.read_sql(
                text("""
                    SELECT c.nome, COUNT(p.id) as total
                    FROM categoria c
                    LEFT JOIN produto p ON c.id = p.categoria_id
                    GROUP BY c.id, c.nome
                    ORDER BY c.complemento, c.nome
                """),
                conn
            ).to_dict('records')
        
        return {
            "status": "online",
            "database": str(DB_PATH.name),
            "database_exists": DB_PATH.exists(),
            "produtos_cadastrados": count_produtos,
            "registros_ipca": count_ipca,
            "categorias": count_categorias,
            "ultima_atualizacao_ipca": str(ultima_ipca) if ultima_ipca else None,
            "pipeline_status": "operacional" if count_produtos > 0 else "aguardando_scraping",
            "produtos_por_categoria": produtos_por_categoria,
            "cobertura": {
                "tem_ipca": count_ipca > 0,
                "tem_produtos": count_produtos > 0,
                "tem_categorias": count_categorias == 8  # 5 básica + 3 complemento
            }
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao verificar status: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*70)
    print("🚀 Iniciando API da Cesta Básica")
    print("="*70)
    print(f"📊 Banco de dados: {DB_PATH}")
    print(f"🌐 URL: http://localhost:8000")
    print(f"📖 Docs: http://localhost:8000/docs")
    print("="*70 + "\n")
    uvicorn.run(app, host="0.0.0.0", port=8000)