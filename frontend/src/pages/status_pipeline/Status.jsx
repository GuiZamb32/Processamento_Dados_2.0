import React from 'react';
import './Status.css';

const Status = () => {
  return (
    <div className="page-container">
      <h2>Integridade do Pipeline</h2>
      <div className="status-list">
        <div className="status-item">
          <p>Banco de Dados SQLite (`cesta_basica.db`)</p>
          <span className="badge-online">Conectado</span>
        </div>
        <div className="status-item">
          <p>Último Scraping (Giassi)</p>
          <span>Há 2 horas</span>
        </div>
        <div className="status-item">
          <p>Série IPCA (Banco Central)</p>
          <span>Sincronizado</span>
        </div>
      </div>
    </div>
  );
};

export default Status;