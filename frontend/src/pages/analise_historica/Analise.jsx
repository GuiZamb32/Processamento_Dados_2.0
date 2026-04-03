import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:8000';

function Analise() {
  const [data, setData] = useState(null);
  const [showComplemento, setShowComplemento] = useState(false);
  const [viewType, setViewType] = useState('menor'); // 'menor', 'maior', 'comparacao'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistorico();
  }, []);

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/api/historico`);
      
      if (!response.ok) {
        throw new Error('Falha ao carregar dados históricos');
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
          <p>Calculando deflação histórica...</p>
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

  // Determinar valores para visualização
  const getChartData = () => {
    if (!data) return [];
    
    return data.timeline.map(year => {
      let value;
      if (viewType === 'menor') {
        value = showComplemento ? year.cesta_menor_completa : year.cesta_menor;
      } else if (viewType === 'maior') {
        value = showComplemento ? year.cesta_maior_completa : year.cesta_maior;
      } else { // comparacao
        return {
          ano: year.ano,
          menor: showComplemento ? year.cesta_menor_completa : year.cesta_menor,
          maior: showComplemento ? year.cesta_maior_completa : year.cesta_maior,
          ipca: year.ipca_acumulado
        };
      }
      
      return {
        ano: year.ano,
        valor: value,
        ipca: year.ipca_acumulado
      };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.maior || d.valor || 0));
  const minValue = Math.min(...chartData.filter(d => d.ano !== data.ano_base).map(d => d.menor || d.valor || 0));

  // Função para renderizar barra
  const renderBar = (value, maxVal, color, ano, isBase) => {
    const heightPercent = (value / maxVal) * 100;
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: isBase ? 'var(--brand-primary)' : 'var(--text-primary)',
            marginBottom: '0.25rem'
          }}>
            R$ {value.toFixed(2)}
          </div>
          <div style={{
            width: '100%',
            height: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              height: `${heightPercent}%`,
              background: `linear-gradient(to top, ${color}, ${color}dd)`,
              borderRadius: '4px 4px 0 0',
              position: 'relative',
              border: isBase ? '2px solid var(--brand-primary)' : 'none',
              boxShadow: isBase ? '0 0 20px rgba(1, 111, 225, 0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {isBase && (
                <div style={{
                  position: 'absolute',
                  top: '-1.5rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'var(--brand-primary)',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}>
                  ANO BASE
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={{
          fontSize: '1rem',
          fontWeight: '700',
          color: isBase ? 'var(--brand-primary)' : 'var(--text-secondary)'
        }}>
          {ano}
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <h1 className="page-title">Progressão Histórica Estimada</h1>
        <p className="page-description">
          Valores estimados da cesta básica de 2016 a {data.ano_base} usando deflação pelo IPCA acumulado anual.
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
            className={`btn ${viewType === 'menor' ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setViewType('menor')}
          >
            📉 Menor Valor
          </button>
          <button
            className={`btn ${viewType === 'maior' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewType('maior')}
            style={viewType === 'maior' ? { background: 'var(--danger)' } : {}}
          >
            📈 Maior Valor
          </button>
          <button
            className={`btn ${viewType === 'comparacao' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setViewType('comparacao')}
          >
            📊 Comparação
          </button>
        </div>

        <button
          className={`btn ${showComplemento ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowComplemento(!showComplemento)}
        >
          {showComplemento ? '8 itens (Completo)' : '5 itens (Básico)'}
        </button>
      </div>

      {/* Visualização Gráfica */}
      <div className="table-container">
        <div className="table-header">
          <h2 className="table-title">
            {viewType === 'comparacao' ? 'Comparação Menor vs Maior' : 
             viewType === 'menor' ? 'Evolução - Cesta Menor Valor' : 'Evolução - Cesta Maior Valor'}
          </h2>
          <span className="badge badge-info">
            {showComplemento ? 'Com Complemento' : 'Apenas Básica'}
          </span>
        </div>
        <div style={{
          padding: 'var(--space-xl)',
          background: 'var(--bg-elevated)'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
            marginBottom: 'var(--space-md)'
          }}>
            {viewType === 'comparacao' ? (
              chartData.map(year => (
                <div key={year.ano} style={{ flex: 1, display: 'flex', gap: '0.25rem' }}>
                  {renderBar(year.menor, maxValue, 'var(--success)', year.ano, year.ano === data.ano_base)}
                  {renderBar(year.maior, maxValue, 'var(--danger)', '', false)}
                </div>
              ))
            ) : (
              chartData.map(year => (
                <React.Fragment key={year.ano}>
                  {renderBar(
                    year.valor, 
                    maxValue, 
                    viewType === 'menor' ? 'var(--success)' : 'var(--danger)',
                    year.ano,
                    year.ano === data.ano_base
                  )}
                </React.Fragment>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Tabela Detalhada */}
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Dados Históricos Detalhados</h3>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Ano</th>
              <th>IPCA Acumulado</th>
              <th>Cesta Menor</th>
              <th>Cesta Maior</th>
              {showComplemento && (
                <>
                  <th>Menor + Complemento</th>
                  <th>Maior + Complemento</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {data.timeline.map(year => (
              <tr key={year.ano} style={year.ano === data.ano_base ? {
                background: 'var(--info-bg)',
                borderLeft: '3px solid var(--brand-primary)'
              } : {}}>
                <td>
                  <strong>{year.ano}</strong>
                  {year.ano === data.ano_base && (
                    <span className="badge badge-info" style={{ marginLeft: '0.5rem' }}>
                      BASE
                    </span>
                  )}
                </td>
                <td>
                  {year.ano === data.ano_base ? '—' : `${year.ipca_acumulado.toFixed(2)}%`}
                </td>
                <td className="price-cell">
                  R$ {year.cesta_menor.toFixed(2)}
                </td>
                <td className="price-cell high">
                  R$ {year.cesta_maior.toFixed(2)}
                </td>
                {showComplemento && (
                  <>
                    <td className="price-cell">
                      R$ {year.cesta_menor_completa.toFixed(2)}
                    </td>
                    <td className="price-cell high">
                      R$ {year.cesta_maior_completa.toFixed(2)}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explicação Metodologia */}
      <div style={{
        background: 'var(--warning-bg)',
        border: '1px solid var(--warning-border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg)',
        marginTop: 'var(--space-lg)'
      }}>
        <h3 style={{ marginBottom: 'var(--space-sm)', color: 'var(--warning)' }}>
          📐 Metodologia de Cálculo
        </h3>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          <p style={{ marginBottom: 'var(--space-sm)' }}>
            <strong>Ano Base ({data.ano_base}):</strong> Preços atuais coletados via web scraping do Giassi.
          </p>
          <p style={{ marginBottom: 'var(--space-sm)' }}>
            <strong>Fórmula de Deflação:</strong> valor<sub>ano_anterior</sub> = valor<sub>atual</sub> ÷ (1 + IPCA<sub>acumulado_ano</sub> / 100)
          </p>
          <p style={{ marginBottom: 'var(--space-sm)' }}>
            <strong>IPCA Acumulado:</strong> Calculado através de juros compostos mensais → ∏(1 + taxa<sub>mensal</sub> / 100) - 1
          </p>
          <p>
            <strong>Interpretação:</strong> Os valores históricos são <em>estimativas</em> baseadas na deflação pelo IPCA. 
            Representam quanto a cesta custaria se apenas a inflação tivesse impactado os preços.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Analise;