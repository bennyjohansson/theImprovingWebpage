() => {
  const data = {
    labels: [2001, 2002, 2003, 2004, 2005, 2006],
    datasets: [{
      label: 'Yearly Data',
      data: [100, 150, 140, 170, 160, 180],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-4 bg-blue-100 rounded">
      <h1 className="text-xl font-bold mb-4">Yearly Data Bar Chart</h1>
      <div className="w-full max-w-md mx-auto">
        <canvas id="myChart"></canvas>
      </div>
      <script>
        {`
          const ctx = document.getElementById('myChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: ${JSON.stringify(data)},
            options: ${JSON.stringify(options)}
          });
        `}
      </script>
    </div>
  )
}

export default data;