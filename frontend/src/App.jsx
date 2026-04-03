import React, { useState } from 'react'; 
// As importações de Router foram mantidas caso precise usá-las futuramente, 
// mas o controle atual é via estado (useState).
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Dashboard from './pages/dashboard_principal/Dashboard';
import Analise from './pages/analise_historica/Analise';
import Comparativo from './pages/comparativo_cestas/Comparativo';
import Status from './pages/status_pipeline/Status';

import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pages = {
    dashboard: <Dashboard />,
    analise: <Analise />,
    comparativo: <Comparativo />,
    status: <Status />
  };

  // Ícones atualizados para apontar para a pasta public
  const menuItems = [
    { id: 'dashboard', icon: '/grafico.png', label: 'Dashboard' },
    { id: 'comparativo', icon: '/carrinho-compras.png', label: 'Composição' },
    { id: 'analise', icon: '/historico.png', label: 'Histórico' },
    { id: 'status', icon: '/configuracao.png', label: 'Status' }
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          {/* Logo principal também usando o ícone de carrinho */}
          <h1 className="logo">
            <img src="/carrinho-compras.png" alt="Logo" className="nav-icon-img" />
            Cesta Básica
          </h1>
          <p className="subtitle">Pipeline de Dados</p>
        </div>

        <div className="nav-items">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-icon">
                <img src={item.icon} alt={item.label} className="nav-icon-img" />
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <p className="footer-text">UniSENAI SC</p>
          <p className="footer-text">BI & Data Visualization</p>
          <p className="footer-year">2026</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {pages[currentPage]}
      </main>
    </div>
  );
}

export default App;