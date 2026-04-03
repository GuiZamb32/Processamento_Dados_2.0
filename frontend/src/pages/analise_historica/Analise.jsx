import React from 'react';
import './Analise.css';

const Analise = () => {
  return (
    <div className="page-container">
      <h2>Progressão Histórica Estimated</h2>
      <p>Custo da cesta básica corrigido pelo IPCA (Deflação).</p>
      
      <div className="history-chart-placeholder">
        {/* Futuro componente de gráfico (Recharts) */}
        <div className="bar-item"><span>2024</span><div className="bar" style={{height: '100%'}}></div><p>R$ 145,20</p></div>
        <div className="bar-item"><span>2023</span><div className="bar" style={{height: '92%'}}></div><p>R$ 138,40</p></div>
        <div className="bar-item"><span>2022</span><div className="bar" style={{height: '85%'}}></div><p>R$ 132,15</p></div>
      </div>
    </div>
  );
};

export default Analise;