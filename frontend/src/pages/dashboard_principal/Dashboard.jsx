import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/dashboard`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados. Verifique se a API está rodando.');
      }
      
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">
          <div className="error-title">
            {/* Ícone de Atenção da pasta public */}
            <img src="/atencao.png" alt="Erro" className="status-icon-small" />
            <span>Erro ao Carregar Dados</span>
          </div>
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={fetchDashboardData} style={{ marginTop: '1rem' }}>
            Tentar Novamente
          </button>
        </div>
        <div className="empty-state">
          {/* Ícone de Gráfico da pasta public */}
          <img src="/grafico.png" alt="Pipeline" className="empty-icon-img" />
          <h3 className="empty-title">Pipeline Não Executado</h3>
          <p className="empty-description">
            Execute os scripts do pipeline na seguinte ordem:<br/>
            1. <code>py 01_criar_banco.py</code><br/>
            2. <code>py 02_coletar_ipca.py</code><br/>
            3. <code>py -m scrapy runspider 03_scraper_giassi.py</code><br/>
            4. <code>py 04_carregar_produtos.py</code><br/>
            5. <code>py api_cesta_basica.py</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Dashboard Geral</h1>
        <p className="page-description">
          Visão consolidada dos custos da cesta básica em Florianópolis/SC com dados do Giassi e IPCA do Banco Central.
        </p>
      </header>

      {/* KPIs Principais */}
      <div className="kpi-grid">
        <div className="kpi-card success">
          <div className="kpi-label">Cesta Menor Valor</div>
          <div className="kpi-value success" style={{ color: 'var(--Verde-Accent)' }}>
            R$ {data.cesta_menor_valor.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {data.itens_basica} produtos · Baseado em web scraping
          </div>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-label">Cesta Maior Valor</div>
          <div className="kpi-value danger" style={{ color: 'var(--Vermelho-Alert)' }}>
            R$ {data.cesta_maior_valor.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {data.itens_basica} produtos · Marcas premium
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">IPCA Acumulado Anual</div>
          <div className="kpi-value">
            {data.ipca_acumulado_anual.toFixed(2)}%
          </div>
          <div className="kpi-subtitle">
            Fonte: API Banco Central
          </div>
        </div>
      </div>

      {/* Complemento */}
      <div className="kpi-grid">
        <div className="kpi-card success">
          <div className="kpi-label">Complemento (Menor)</div>
          <div className="kpi-value">
            R$ {data.complemento_menor.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {data.itens_complemento} produtos adicionais
          </div>
        </div>

        <div className="kpi-card danger">
          <div className="kpi-label">Complemento (Maior)</div>
          <div className="kpi-value">
            R$ {data.complemento_maior.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            {data.itens_complemento} produtos adicionais
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-label">Total de Produtos</div>
          <div className="kpi-value">
            {data.total_produtos}
          </div>
          <div className="kpi-subtitle">
            Cadastrados no banco SQLite
          </div>
        </div>
      </div>

      {/* Totais Completos */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">Resumo Consolidado (Básica + Complemento)</h2>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Cesta Básica (5 itens)</th>
              <th>Complemento (3 itens)</th>
              <th>Total Completo (8 itens)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Menor Valor</strong></td>
              <td className="price-cell">R$ {data.cesta_menor_valor.toFixed(2)}</td>
              <td className="price-cell">R$ {data.complemento_menor.toFixed(2)}</td>
              <td className="price-cell" style={{ color: 'var(--Verde-Accent)' }}>
                <strong>R$ {data.total_menor_completo.toFixed(2)}</strong>
              </td>
            </tr>
            <tr>
              <td><strong>Maior Valor</strong></td>
              <td className="price-cell high">R$ {data.cesta_maior_valor.toFixed(2)}</td>
              <td className="price-cell high">R$ {data.complemento_maior.toFixed(2)}</td>
              <td className="price-cell high" style={{ color: 'var(--Vermelho-Alert)' }}>
                <strong>R$ {data.total_maior_completo.toFixed(2)}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Info Box */}
      <div className="info-box" style={{
        background: 'var(--Preto-Elevated)',
        border: '1px solid var(--Cinza-Dark)',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--Azul-Primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Ícone de Exclamação da pasta public */}
          <img src="/exclamacao.png" alt="Info" className="status-icon-small" />
          Sobre os Dados
        </h3>
        <ul style={{ color: 'var(--Branco-Text)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li><strong>Cesta Básica:</strong> Arroz (5kg), Feijão (2kg), Óleo de Soja (900ml), Açúcar (1kg), Café (500g)</li>
          <li><strong>Complemento:</strong> Macarrão (1kg), Farinha (500g), Sal (1kg)</li>
          <li><strong>Fonte de Preços:</strong> Web Scraping automatizado do site Giassi Supermercados</li>
          <li><strong>Fonte IPCA:</strong> API de Dados Abertos do Banco Central do Brasil (SGS 433)</li>
          <li><strong>Banco de Dados:</strong> SQLite com {data.total_produtos} produtos cadastrados</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;