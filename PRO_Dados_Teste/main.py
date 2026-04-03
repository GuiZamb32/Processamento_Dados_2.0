from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models # Seu arquivo de modelos existente

app = FastAPI()

# Permite que o React (geralmente na porta 5173) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/relatorio/menor-valor")
def get_menor_valor():
    # Aqui você move a lógica do seu script 05_gerar_relatorios.py
    # Retornando um JSON com os produtos da cesta
    return {"cesta": [...], "total": 120.50}

@app.get("/relatorio/historico-ipca")
def get_ipca():
    # Retorna os dados para o gráfico de progressão anual
    return [{"ano": 2023, "valor": 550.00}, {"ano": 2024, "valor": 600.00}]