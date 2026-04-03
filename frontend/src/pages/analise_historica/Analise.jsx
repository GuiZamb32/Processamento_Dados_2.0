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
            <img src="/atencao.png" alt="Erro" className="status-icon-small" />
            <span>Erro ao Carregar Dados</span>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const getChartData = () => {
    if (!data) return [];
    return data.timeline.map(year => {
      let value;
      if (viewType === 'menor') {
        value = showComplemento ? year.cesta_menor_completa : year.cesta_menor;
      } else if (viewType === 'maior') {
        value = showComplemento ? year.cesta_maior_completa : year.cesta_maior;
      } else {
        return {
          ano: year.ano,
          menor: showComplemento ? year.cesta_menor_completa : year.cesta_menor,
          maior: showComplemento ? year.cesta_maior_completa : year.cesta_maior,
        };
      }
      return { ano: year.ano, valor: value };
    });
  };

  const chartData = getChartData();
  const maxValue = Math.max(...chartData.map(d => d.maior || d.valor || 0));

  const renderBar = (value, maxVal, color, ano, isBase) => {
    const heightPercent = (value / maxVal) * 100;
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', color: isBase ? 'var(--Azul-Primary)' : 'var(--Branco-Text)', marginBottom: '0.25rem' }}>
            R$ {value.toFixed(0)}
          </div>
          <div style={{ width: '100%', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'relative' }}>
            <div style={{
              width: '100%',
              height: `${heightPercent}%`,
              background: isBase ? 'var(--Azul-Primary)' : color,
              borderRadius: '4px 4px 0 0',
              border: isBase ? '1px solid var(--Branco-Text)' : 'none',
              transition: 'all 0.3s ease'
            }} />
          </div>
        </div>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: isBase ? 'var(--Azul-Primary)' : 'var(--Cinza-Light)' }}>
          {ano}
        </div>
      </div>
    );
  };

  return (
    <div className="page">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src="/historico.png" alt="Histórico" style={{ width: '40px' }} />
          <h1 className="page-title">Progressão Histórica Estimada</h1>
        </div>
        <p className="page-description">
          Valores estimados da cesta básica de 2016 a {data.ano_base} via deflação IPCA (SGS 433).
        </p>
      </header>

      {/* Controles Profissionais */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--Preto-Elevated)', padding: '8px', borderRadius: '8px', border: '1px solid var(--Cinza-Dark)', display: 'flex', gap: '8px' }}>
          <button className={`btn ${viewType === 'menor' ? 'btn-success' : 'btn-secondary'}`} onClick={() => setViewType('menor')}>
            <img src="/menos.png" alt="Menor" style={{ width: '14px', marginRight: '5px' }} /> Menor
          </button>
          <button className={`btn ${viewType === 'maior' ? 'btn-danger' : 'btn-secondary'}`} onClick={() => setViewType('maior')} style={viewType === 'maior' ? { backgroundColor: 'var(--Vermelho-Alert)' } : {}}>
            <img src="/mais.png" alt="Maior" style={{ width: '14px', marginRight: '5px' }} /> Maior
          </button>
          <button className={`btn ${viewType === 'comparacao' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setViewType('comparacao')}>
            <img src="/grafico.png" alt="Comparar" style={{ width: '14px', marginRight: '5px' }} /> Comparação
          </button>
        </div>

        <button className={`btn ${showComplemento ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setShowComplemento(!showComplemento)}>
          <img src="/metrica.png" alt="Métrica" style={{ width: '16px', marginRight: '8px' }} />
          {showComplemento ? '8 itens (Completo)' : '5 itens (Básico)'}
        </button>
      </div>

      {/* Gráfico de Barras Customizado */}
      <div className="table-container" style={{ padding: '20px', background: 'var(--Preto-Elevated)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', height: '260px' }}>
          {viewType === 'comparacao' ? (
            chartData.map(year => (
              <div key={year.ano} style={{ flex: 1, display: 'flex', gap: '4px' }}>
                {renderBar(year.menor, maxValue, 'var(--Verde-Accent)', year.ano, year.ano === data.ano_base)}
                {renderBar(year.maior, maxValue, 'var(--Vermelho-Alert)', '', false)}
              </div>
            ))
          ) : (
            chartData.map(year => (
              <React.Fragment key={year.ano}>
                {renderBar(year.valor, maxValue, viewType === 'menor' ? 'var(--Verde-Accent)' : 'var(--Vermelho-Alert)', year.ano, year.ano === data.ano_base)}
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      {/* Metodologia com Metrica.png */}
      <div className="info-box" style={{ background: 'var(--Preto-Elevated)', border: '1px solid var(--Cinza-Dark)', borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--Azul-Primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/metrica.png" alt="Metodologia" className="status-icon-small" />
          Metodologia de Cálculo de BI
        </h3>
        <div style={{ color: 'var(--Branco-Text)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          <p><strong>Cálculo:</strong> Os preços de {data.ano_base} (Giassi) foram deflacionados ano a ano usando a taxa IPCA acumulada.</p>
          <p><strong>Fórmula:</strong> Valor<sub>Passado</sub> = Valor<sub>Atual</sub> / (1 + IPCA<sub>Anual</sub>)</p>
          <p><strong>Fonte IPCA:</strong> Banco Central do Brasil - Sistema Gerenciador de Séries Temporais.</p>
        </div>
      </div>
    </div>
  );
}

export default Analise;