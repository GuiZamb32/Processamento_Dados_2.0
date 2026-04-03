import React, { useState, useEffect } from 'react';
import './App.css';

// Simulação de dados (Substituir pelo Fetch da sua futura API)
const mockCestaMenor = [
  { produto: 'Arroz Branco', marca: 'Tio João', preco: 25.90, qtd: '5kg' },
  { produto: 'Feijão Carioca', marca: 'Kicaldo', preco: 8.50, qtd: '2kg' },
];

function App() {
  const [showComplemento, setShowComplemento] = useState(false);

  return (
    <div className="container">
      <header>
        <h1 style={{ color: 'var(--Azul-Primary)' }}>Pipeline de Dados: Cesta Básica</h1>
        <p style={{ color: 'var(--Cinza-Muted)' }}>Análise de Preços Giassi & IPCA Banco Central</p>
      </header>

      {/* TELA 1: DASHBOARD DE INDICADORES */}
      <section className="dashboard-grid">
        <div className="card success">
          <h3>Menor Valor (Cesta)</h3>
          <h2 style={{ color: 'var(--Verde-Accent)' }}>R$ 145,20</h2>
          <small>Baseado em Web Scraping atual</small>
        </div>

        <div className="card danger">
          <h3>Maior Valor (Cesta)</h3>
          <h2 style={{ color: 'var(--Vermelho-Alert)' }}>R$ 210,50</h2>
          <small>Produtos de marcas Premium</small>
        </div>

        <div className="card">
          <h3>IPCA Acumulado (12m)</h3>
          <h2>4.52%</h2>
          <small>Fonte: API Banco Central</small>
        </div>
      </section>

      {/* TELA 2: COMPARATIVO DE PRODUTOS */}
      <section style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Composição da Cesta de Menor Valor</h2>
          <button 
            onClick={() => setShowComplemento(!showComplemento)}
            style={{ background: 'var(--Azul-Primary)', color: 'white', border: 'none', padding: '10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            {showComplemento ? 'Ocultar Complemento' : 'Ver com Complemento'}
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Produto [cite: 34]</th>
              <th>Marca [cite: 34]</th>
              <th>Qtd Pedida [cite: 35]</th>
              <th>Preço Unitário [cite: 34]</th>
            </tr>
          </thead>
          <tbody>
            {mockCestaMenor.map((item, index) => (
              <tr key={index}>
                <td>{item.produto}</td>
                <td>{item.marca}</td>
                <td>{item.qtd}</td>
                <td className="price-tag">R$ {item.preco.toFixed(2)}</td>
              </tr>
            ))}
            {showComplemento && (
              <tr style={{ backgroundColor: 'rgba(4, 189, 162, 0.1)' }}>
                <td>Macarrão (Bônus) [cite: 47, 48]</td>
                <td>Galo</td>
                <td>1kg</td>
                <td className="price-tag">R$ 5,90</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* TELA 3: PROGRESSÃO HISTÓRICA */}
      <section className="card" style={{ borderLeftColor: 'var(--Cinza-Muted)' }}>
        <h2>Estimativa de Custo Anual (Deflação IPCA) [cite: 37, 40]</h2>
        <p>Projeção baseada no IPCA acumulado de anos anteriores[cite: 38, 69]:</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--Cinza-Muted)' }}>2024</p>
            <p>R$ 145,20</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--Cinza-Muted)' }}>2023</p>
            <p>R$ 138,40</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--Cinza-Muted)' }}>2022</p>
            <p>R$ 132,15</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;