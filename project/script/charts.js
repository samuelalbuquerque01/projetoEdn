let hardwareChart = null;
let sectorChart = null;

function initCharts() {
  const hardwareCanvas = document.getElementById('hardware-chart');
  const sectorCanvas = document.getElementById('sector-chart');
  if (!hardwareCanvas || !sectorCanvas || !document.getElementById('home-page').classList.contains('active')) return;

  const hardwareCounts = {};
  const sectorCounts = {};

  inventories.forEach(item => {
    hardwareCounts[item.hardware] = (hardwareCounts[item.hardware] || 0) + 1;
    sectorCounts[item.setor] = (sectorCounts[item.setor] || 0) + 1;
  });

  const backgroundColors = ['#4361ee', '#3f37c9', '#4895ef', '#4cc9f0', '#560bad', '#b5179e'];

  if (hardwareChart) hardwareChart.destroy();
  if (sectorChart) sectorChart.destroy();

  hardwareChart = new Chart(hardwareCanvas, {
    type: 'doughnut',
    data: {
      labels: Object.keys(hardwareCounts),
      datasets: [{ data: Object.values(hardwareCounts), backgroundColor: backgroundColors }]
    },
    options: { responsive: true, plugins: { legend: { position: 'right' } } }
  });

  sectorChart = new Chart(sectorCanvas, {
    type: 'bar',
    data: {
      labels: Object.keys(sectorCounts),
      datasets: [{ label: 'Itens por Setor', data: Object.values(sectorCounts), backgroundColor: backgroundColors }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
  });
}
