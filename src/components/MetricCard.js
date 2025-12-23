// components/MetricCard.js
import React from 'react';

const MetricCard = ({ label, value, change }) => {
  return (
    <div className="card metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      <div className={`metric-change text-${change.direction === 'up' ? 'success' : 'danger'}`}>
        <i className={`bi bi-arrow-${change.direction}`}></i> {change.value} from last month
      </div>
    </div>
  );
};

export default MetricCard;