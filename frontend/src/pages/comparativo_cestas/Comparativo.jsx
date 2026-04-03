import React, { useState } from 'react';
import './Comparativo.css';

const Comparativo = () => {
  const [extra, setExtra] = useState(false);

  return (
    <div className="page-container">
      <div className="header-actions">
        <h2>Detalhamento da Composição</h2>
        <button className="btn-toggle" onClick={() => setExtra(!extra)}>
          {extra ? "Remover Complemento" : "Adicionar Complemento"}
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Marca</th>
            <th>Preço Unitário</th>
            <th>Qtd. Necessária</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Arroz Branco</td>
            <td>Tio João</td>
            <td>R$ 25,90</td>
            <td>5kg</td>
          </tr>
          {/* Mapear itens do banco aqui futuramente */}
          {extra && (
            <tr className="row-bonus">
              <td>Macarrão (Bônus)</td>
              <td>Galo</td>
              <td>R$ 5,90</td>
              <td>1kg</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Comparativo;