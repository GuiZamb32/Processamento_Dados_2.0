import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function Status() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
    // Auto-refresh a cada 30 segundos
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/status`);
      
      if (!response.ok) {
        throw new Error('Falha ao verificar status do pipeline');
      }
      
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !data) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Verificando status...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="page">
        <div className="error">
          <div className="error-title">
            <span>⚠️</span>
            <span>API Não Disponível</span>
          </div>
          <p className="error-message">{error}</p>
          <button className="btn btn-primary" onClick={fetchStatus} style={{ marginTop: '1rem' }}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  const isOperacional = data.pipeline_status === 'operacional';
  const hasDatabase = data.database_exists;

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Integridade do Pipeline</h1>
        <p className="page-description">
          Monitoramento do status de execução e qualidade dos dados do pipeline de ETL.
        </p>
      </header>

      {/* Status Geral */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className={`kpi-card ${isOperacional ? 'success' : 'danger'}`}>
          <div className="kpi-label">Status do Pipeline</div>
          <div className={`kpi-value ${isOperacional ? 'success' : 'danger'}`}>
            {isOperacional ? '✓ Operacional' : '⚠ Aguardando'}
          </div>
          <div className="kpi-subtitle">
            {isOperacional ? 'Todos os dados disponíveis' : 'Execute os scripts de coleta'}
          </div>
        </div>

        <div className={`kpi-card ${data.status === 'online' ? 'success' : 'danger'}`}>
          <div className="kpi-label">Status da API</div>
          <div className={`kpi-value ${data.status === 'online' ? 'success' : 'danger'}`}>
            {data.status === 'online' ? '🟢 Online' : '🔴 Offline'}
          </div>
          <div className="kpi-subtitle">
            FastAPI + SQLAlchemy
          </div>
        </div>

        <div className={`kpi-card ${hasDatabase ? 'success' : 'danger'}`}>
          <div className="kpi-label">Banco de Dados</div>
          <div className={`kpi-value ${hasDatabase ? 'success' : 'danger'}`}>
            {hasDatabase ? '✓ Conectado' : '✗ Não Encontrado'}
          </div>
          <div className="kpi-subtitle">
            {data.database}
          </div>
        </div>
      </div>

      {/* Métricas de Dados */}
      <div className="table-container" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="table-header">
          <h2 className="table-title">Métricas de Dados</h2>
          <button className="btn btn-secondary" onClick={fetchStatus}>
            🔄 Atualizar
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Métrica</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Observação</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Produtos Cadastrados</strong></td>
              <td>{data.produtos_cadastrados}</td>
              <td>
                <span className={`badge ${data.produtos_cadastrados > 0 ? 'badge-success' : 'badge-danger'}`}>
                  {data.produtos_cadastrados > 0 ? '✓ OK' : '⚠ Vazio'}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Fonte: Web Scraping Giassi
              </td>
            </tr>
            <tr>
              <td><strong>Registros IPCA</strong></td>
              <td>{data.registros_ipca}</td>
              <td>
                <span className={`badge ${data.registros_ipca >= 120 ? 'badge-success' : 'badge-warning'}`}>
                  {data.registros_ipca >= 120 ? '✓ Completo' : '⚠ Parcial'}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Fonte: API Banco Central (SGS 433)
              </td>
            </tr>
            <tr>
              <td><strong>Categorias</strong></td>
              <td>{data.categorias}</td>
              <td>
                <span className={`badge ${data.categorias === 8 ? 'badge-success' : 'badge-danger'}`}>
                  {data.categorias === 8 ? '✓ Completo' : '⚠ Incompleto'}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Esperado: 5 básica + 3 complemento
              </td>
            </tr>
            <tr>
              <td><strong>Última Atualização IPCA</strong></td>
              <td>{data.ultima_atualizacao_ipca || '—'}</td>
              <td>
                <span className={`badge ${data.ultima_atualizacao_ipca ? 'badge-info' : 'badge-warning'}`}>
                  {data.ultima_atualizacao_ipca ? 'ℹ Registrado' : '⚠ Sem dados'}
                </span>
              </td>
              <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Série histórica 2015-2024
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Produtos por Categoria */}
      {data.produtos_por_categoria && data.produtos_por_categoria.length > 0 && (
        <div className="table-container" style={{ marginBottom: 'var(--space-xl)' }}>
          <div className="table-header">
            <h3 className="table-title">Cobertura por Categoria</h3>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th>Produtos Cadastrados</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.produtos_por_categoria.map(cat => (
                <tr key={cat.nome}>
                  <td><strong>{cat.nome}</strong></td>
                  <td>{cat.total}</td>
                  <td>
                    <span className={`badge ${cat.total > 0 ? 'badge-success' : 'badge-danger'}`}>
                      {cat.total > 0 ? `✓ ${cat.total} opções` : '⚠ Sem produtos'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Checklist de Cobertura */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Checklist de Integridade</h3>
        </div>
        <div style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span className={`badge ${data.cobertura.tem_ipca ? 'badge-success' : 'badge-danger'}`}>
                {data.cobertura.tem_ipca ? '✓' : '✗'}
              </span>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Série Histórica IPCA
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {data.cobertura.tem_ipca 
                    ? `${data.registros_ipca} registros mensais disponíveis` 
                    : 'Execute: python 02_coletar_ipca.py'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span className={`badge ${data.cobertura.tem_categorias ? 'badge-success' : 'badge-danger'}`}>
                {data.cobertura.tem_categorias ? '✓' : '✗'}
              </span>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Categorias da Cesta
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {data.cobertura.tem_categorias 
                    ? 'Todas as 8 categorias criadas' 
                    : 'Execute: python 01_criar_banco.py'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <span className={`badge ${data.cobertura.tem_produtos ? 'badge-success' : 'badge-danger'}`}>
                {data.cobertura.tem_produtos ? '✓' : '✗'}
              </span>
              <div>
                <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                  Produtos Coletados
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {data.cobertura.tem_produtos 
                    ? `${data.produtos_cadastrados} produtos via web scraping` 
                    : 'Execute: python -m scrapy runspider 03_scraper_giassi.py → python 04_carregar_produtos.py'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções de Execução */}
      {!isOperacional && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
          marginTop: 'var(--space-lg)'
        }}>
          <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--warning)' }}>
            ⚠️ Pipeline Incompleto - Execute os Scripts
          </h3>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: 'var(--space-sm)' }}>
              Para inicializar o pipeline completo, execute os scripts na ordem:
            </p>
            <ol style={{ paddingLeft: '1.5rem' }}>
              <li><code>python 01_criar_banco.py</code> — Cria o banco SQLite e categorias</li>
              <li><code>python 02_coletar_ipca.py</code> — Coleta série histórica do IPCA</li>
              <li><code>python -m scrapy runspider 03_scraper_giassi.py</code> — Web scraping dos produtos</li>
              <li><code>python 04_carregar_produtos.py</code> — Carrega produtos no banco</li>
              <li><code>python api_cesta_basica.py</code> — Inicia esta API</li>
            </ol>
          </div>
        </div>
      )}

      {/* Info Final */}
      <div style={{
        background: 'var(--info-bg)',
        border: '1px solid var(--info-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginTop: 'var(--space-lg)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--info)' }}>
          <img src="/exclamacao.png" alt="Info" className="status-icon-small" />
          Sobre o Pipeline
        </h3>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li><strong>Arquitetura:</strong> Python + SQLAlchemy + FastAPI + React</li>
          <li><strong>Web Scraping:</strong> Scrapy com cache HTTP de 24h</li>
          <li><strong>Fonte IPCA:</strong> API de Dados Abertos do Banco Central (SGS 433)</li>
          <li><strong>Banco de Dados:</strong> SQLite com 3 tabelas (ipca, categoria, produto)</li>
          <li><strong>Atualização:</strong> Esta página atualiza automaticamente a cada 30 segundos</li>
        </ul>
      </div>
    </div>
  );
}

export default Status;