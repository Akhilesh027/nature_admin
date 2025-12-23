// components/ServiceDistributionChart.js
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ServiceDistributionChart = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Home Services', 'Salon', 'Wellness', 'Other'],
          datasets: [{
            data: [45, 25, 20, 10],
            backgroundColor: [
              '#4361ee',
              '#4cc9f0',
              '#f72585',
              '#7209b7'
            ],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          },
          cutout: '70%'
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return <canvas ref={chartRef} />;
};

export default ServiceDistributionChart;