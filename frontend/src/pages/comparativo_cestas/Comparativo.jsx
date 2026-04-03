import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function Comparativo() {
  const [tipo, setTipo] = useState('menor'); // 'menor' ou 'maior'
  const [showComplemento, setShowComplemento] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, [tipo]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/cesta/${tipo}`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar composição da cesta');
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
          <p>Carregando composição...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="error">
          <div className="error-title">
            <span>⚠️</span>
            <span>Erro ao Carregar Dados</span>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const renderTable = (items, title) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="table-container" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="table-header">
          <h3 className="table-title">{title}</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Categoria</th>
              <th>Produto</th>
              <th>Marca</th>
              <th>Qtd. Necessária</th>
              <th>Preço/kg ou L</th>
              <th>Preço Unitário</th>
              <th>Total Item</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td><strong>{item.categoria}</strong></td>
                <td>{item.produto}</td>
                <td>{item.marca || '—'}</td>
                <td>{item.quantidade_necessaria} {item.unidade}</td>
                <td className="price-cell">
                  R$ {(item.preco_por_kg || 0).toFixed(2)}
                </td>
                <td className="price-cell">
                  R$ {(item.preco_unitario || 0).toFixed(2)}
                </td>
                <td className={`price-cell ${tipo === 'maior' ? 'high' : ''}`}>
                  <strong>R$ {(item.total_item || 0).toFixed(2)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Composição Detalhada</h1>
        <p className="page-description">
          Produtos que compõem a cesta básica e complemento com informações completas de preços e quantidades.
        </p>
      </header>

      {/* Controles */}
      <div style={{
        display: 'flex',
        gap: 'var(--space-md)',
        marginBottom: 'var(--space-xl)',
        flexWrap: 'wrap'
      }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          gap: 'var(--space-xs)'
        }}>
          <button
            className={`btn ${tipo === 'menor' ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setTipo('menor')}
          >
            🛒 Menor Valor
          </button>
          <button
            className={`btn ${tipo === 'maior' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setTipo('maior')}
            style={tipo === 'maior' ? { background: 'var(--danger)' } : {}}
          >
            💰 Maior Valor
          </button>
        </div>

        <button
          className={`btn ${showComplemento ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowComplemento(!showComplemento)}
        >
          {showComplemento ? '✓ Exibindo Complemento' : '+ Mostrar Complemento'}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className={`kpi-card ${tipo === 'menor' ? 'success' : 'danger'}`}>
          <div className="kpi-label">Cesta Básica (5 itens)</div>
          <div className={`kpi-value ${tipo === 'menor' ? 'success' : 'danger'}`}>
            R$ {data.total_basica.toFixed(2)}
          </div>
          <div className="kpi-subtitle">
            Arroz · Feijão · Óleo · Açúcar · Café
          </div>
        </div>

        {showComplemento && (
          <>
            <div className={`kpi-card ${tipo === 'menor' ? 'success' : 'danger'}`}>
              <div className="kpi-label">Complemento (3 itens)</div>
              <div className="kpi-value">
                R$ {data.total_complemento.toFixed(2)}
              </div>
              <div className="kpi-subtitle">
                Macarrão · Farinha · Sal
              </div>
            </div>

            <div className={`kpi-card ${tipo === 'menor' ? 'success' : 'danger'}`}>
              <div className="kpi-label">Total Completo (8 itens)</div>
              <div className={`kpi-value ${tipo === 'menor' ? 'success' : 'danger'}`}>
                R$ {data.total_completo.toFixed(2)}
              </div>
              <div className="kpi-subtitle">
                Básica + Complemento
              </div>
            </div>
          </>
        )}
      </div>

      {/* Tabela Cesta Básica */}
      {renderTable(data.basica, '🛒 Cesta Básica (5 itens essenciais)')}

      {/* Tabela Complemento */}
      {showComplemento && renderTable(data.complemento, '➕ Complemento (3 itens adicionais)')}

      {/* Resumo */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Resumo Financeiro</h3>
        </div>
        <div className="table-footer">
          <div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Total Cesta Básica (5 itens)
            </div>
            <div className={`price-cell ${tipo === 'maior' ? 'high' : ''}`} style={{ fontSize: '1.25rem' }}>
              <strong>R$ {data.total_basica.toFixed(2)}</strong>
            </div>
          </div>

          {showComplemento && (
            <>
              <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>+</div>

              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Complemento (3 itens)
                </div>
                <div style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                  <strong>R$ {data.total_complemento.toFixed(2)}</strong>
                </div>
              </div>

              <div style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }}>=</div>

              <div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                  Total Completo (8 itens)
                </div>
                <div className={`price-cell ${tipo === 'maior' ? 'high' : ''}`} style={{ fontSize: '1.5rem' }}>
                  <strong>R$ {data.total_completo.toFixed(2)}</strong>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Observações */}
      <div style={{
        background: 'var(--info-bg)',
        border: '1px solid var(--info-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginTop: 'var(--space-lg)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--info)' }}>
          ℹ️ Sobre os Cálculos
        </h3>
        <ul style={{ color: 'var(--text-secondary)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li><strong>Preço por kg/L:</strong> Normalizado para comparação entre embalagens diferentes</li>
          <li><strong>Total Item:</strong> Preço por kg/L × Quantidade Necessária</li>
          <li><strong>Critério Menor Valor:</strong> Produto com menor preço por kg/L em cada categoria</li>
          <li><strong>Critério Maior Valor:</strong> Produto com maior preço por kg/L em cada categoria</li>
          <li><strong>Fonte:</strong> Dados coletados via web scraping do site Giassi Supermercados</li>
        </ul>
      </div>
    </div>
  );
}

export default Comparativo;