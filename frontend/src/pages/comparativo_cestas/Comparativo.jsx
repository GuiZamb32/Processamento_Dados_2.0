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
            <img src="/atencao.png" alt="Erro" className="status-icon-small" />
            <span>Erro ao Carregar Dados</span>
          </div>
          <p className="error-message">{error}</p>
        </div>
      </div>
    );
  }

  const renderTable = (items, title, icon) => {
    if (!items || items.length === 0) return null;

    return (
      <div className="table-container" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="table-header" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={icon} alt="Icone" className="status-icon-small" />
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
                  <strong style={{ color: tipo === 'menor' ? 'var(--Verde-Accent)' : 'var(--Vermelho-Alert)' }}>
                    R$ {(item.total_item || 0).toFixed(2)}
                  </strong>
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
          Análise técnica dos itens coletados no Giassi via Web Scraping.
        </p>
      </header>

      {/* Controles */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div style={{
          background: 'var(--Preto-Elevated)',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--Cinza-Dark)',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            className={`btn ${tipo === 'menor' ? 'btn-success' : 'btn-secondary'}`}
            onClick={() => setTipo('menor')}
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <img src="/menos.png" alt="Menor" style={{ width: '16px' }} />
            Menor Valor
          </button>
          <button
            className={`btn ${tipo === 'maior' ? 'btn-danger' : 'btn-secondary'}`}
            onClick={() => setTipo('maior')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              backgroundColor: tipo === 'maior' ? 'var(--Vermelho-Alert)' : '' 
            }}
          >
            <img src="/mais.png" alt="Maior" style={{ width: '16px' }} />
            Maior Valor
          </button>
        </div>

        <button
          className={`btn ${showComplemento ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowComplemento(!showComplemento)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <img src={showComplemento ? "/metrica.png" : "/mais.png"} alt="Toggle" style={{ width: '16px' }} />
          {showComplemento ? 'Ocultar Complemento' : 'Mostrar Complemento'}
        </button>
      </div>

      {/* Tabela Cesta Básica */}
      {renderTable(data.basica, 'Cesta Básica (5 itens essenciais)', '/carrinho-compras.png')}

      {/* Tabela Complemento */}
      {showComplemento && renderTable(data.complemento, 'Complemento (3 itens adicionais)', '/mais.png')}

      {/* Observações com Globo.png */}
      <div className="info-box" style={{
        background: 'var(--Preto-Elevated)',
        border: '1px solid var(--Cinza-Dark)',
        borderRadius: '8px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h3 style={{ marginBottom: '10px', color: 'var(--Azul-Primary)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/globo.png" alt="Global" className="status-icon-small" />
          Sobre os Cálculos de BI
        </h3>
        <ul style={{ color: 'var(--Branco-Text)', lineHeight: '1.8', paddingLeft: '1.5rem' }}>
          <li><strong>Métrica Base:</strong> Normalização por kg/L para comparação justa entre marcas.</li>
          <li><strong>Regra de Negócio:</strong> Filtro automático de menor/maior preço por categoria.</li>
          <li><strong>Extração:</strong> Dados sincronizados com o banco SQLite <code>cesta_basica.db</code>.</li>
        </ul>
      </div>
    </div>
  );
}

export default Comparativo;