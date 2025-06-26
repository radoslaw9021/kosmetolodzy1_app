import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, title, value, color }) => {
  return (
    <div className="stat-card" style={{ '--card-color': color }}>
      <div className="stat-card-icon">
        {icon}
      </div>
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        <span className="stat-card-value">{value}</span>
      </div>
    </div>
  );
};

export default StatCard; 