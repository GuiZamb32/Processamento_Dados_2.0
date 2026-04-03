// A importação correta deve ser assim:
import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importações das suas páginas (verifique se os nomes das pastas estão corretos)
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

  const menuItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'comparativo', icon: '🛒', label: 'Composição' },
    { id: 'analise', icon: '📈', label: 'Histórico' },
    { id: 'status', icon: '⚙️', label: 'Status' }
  ];

  return (
    <div className="app">
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">🛒 Cesta Básica</h1>
          <p className="subtitle">Pipeline de Dados</p>
        </div>

        <div className="nav-items">
          {menuItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => setCurrentPage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <p className="footer-text">UniSENAI SC</p>
          <p className="footer-text">BI & Data Visualization</p>
          <p className="footer-year">2025</p>
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