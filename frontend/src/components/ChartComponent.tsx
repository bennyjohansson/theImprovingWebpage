import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartComponent = () => {
  const data = {
    labels: [2001, 2002, 2003, 2004, 2005, 2006],
    datasets: [
      {
        label: 'Yearly Data',
        data: [100, 150, 140, 170, 160, 180],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Yearly Data Bar Chart',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ChartComponent;