import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="page-container">
      <header className="page-header">
        <h1>Dashboard Geral</h1>
        <p>Visão consolidada dos custos da cesta básica em Florianópolis.</p>
      </header>

      <div className="kpi-grid">
        <div className="kpi-card success">
          <span>Cesta Menor Valor</span>
          <h2>R$ 145,20</h2>
          <small>Atualizado via Web Scraping</small>
        </div>
        <div className="kpi-card alert">
          <span>Cesta Maior Valor</span>
          <h2>R$ 210,50</h2>
          <small>Marcas Premium</small>
        </div>
        <div className="kpi-card primary">
          <span>IPCA Acumulado</span>
          <h2>4,52%</h2>
          <small>Fonte: Banco Central</small>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;