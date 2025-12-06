/**
 * ============================================
 * CHARTJS.JS - Graphiques avec Chart.js
 * ============================================
 * Import depuis node_modules via importmap
 */

import { Chart, registerables } from 'chart.js';

// Enregistrer tous les composants Chart.js
Chart.register(...registerables);

console.log('📊 Initialisation des graphiques Chart.js...');

// Configuration globale
Chart.defaults.color = '#00ffff';
Chart.defaults.font.family = "'Rajdhani', sans-serif";

// Variables globales
let eloChart = null;
let activityChart = null;
let radarChart = null;

// Données des maîtres
const masterData = {
  kasparov: {
    elo: [2800, 2810, 2825, 2840, 2851, 2849, 2830],
    years: ['1993', '1995', '1997', '1999', '2001', '2003', '2005'],
    skills: { opening: 98, middlegame: 99, endgame: 95, tactics: 100, strategy: 98, calculation: 99 }
  },
  carlsen: {
    elo: [2801, 2835, 2862, 2872, 2882, 2875, 2853],
    years: ['2013', '2015', '2017', '2019', '2021', '2023', '2025'],
    skills: { opening: 97, middlegame: 99, endgame: 100, tactics: 98, strategy: 99, calculation: 97 }
  },
  fischer: {
    elo: [2720, 2760, 2780, 2785, 2780, 2775, 2770],
    years: ['1967', '1968', '1969', '1970', '1971', '1972', '1973'],
    skills: { opening: 95, middlegame: 98, endgame: 99, tactics: 100, strategy: 96, calculation: 98 }
  }
};

// ==================== GRAPHIQUE ELO ====================
function createEloChart() {
  const ctx = document.getElementById('eloChart');
  if (!ctx) return;

  const data = masterData.kasparov;
  const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');

  eloChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.years,
      datasets: [{
        label: 'ELO Rating',
        data: data.elo,
        borderColor: '#00ffff',
        backgroundColor: gradient,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00ffff',
        pointBorderColor: '#001020',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#00ffff',
            font: { family: "'Orbitron', monospace", size: 10 }
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 16, 32, 0.95)',
          titleColor: '#00ffff',
          bodyColor: '#ffffff',
          borderColor: '#00ffff',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(0, 255, 255, 0.1)' },
          ticks: { color: '#00ffff', font: { size: 9 } }
        },
        y: {
          min: 2700,
          max: 2900,
          grid: { color: 'rgba(0, 255, 255, 0.1)' },
          ticks: { color: '#00ffff', font: { size: 9 } }
        }
      },
      animation: { duration: 1500, easing: 'easeOutQuart' }
    }
  });
  console.log('✅ Graphique ELO créé');
}

// ==================== GRAPHIQUE ACTIVITÉ ====================
function createActivityChart() {
  const ctx = document.getElementById('activityChart');
  if (!ctx) return;

  const activityData = Array(12).fill(0).map(() => Math.floor(Math.random() * 80 + 20));
  const labels = ['J-11', 'J-10', 'J-9', 'J-8', 'J-7', 'J-6', 'J-5', 'J-4', 'J-3', 'J-2', 'J-1', 'Now'];

  activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Activité',
        data: activityData,
        backgroundColor: activityData.map(v => v > 60 ? 'rgba(0, 255, 136, 0.7)' : 'rgba(0, 255, 255, 0.7)'),
        borderColor: activityData.map(v => v > 60 ? '#00ff88' : '#00ffff'),
        borderWidth: 1,
        borderRadius: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 16, 32, 0.95)',
          titleColor: '#00ffff',
          bodyColor: '#ffffff',
          borderColor: '#00ffff',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#00ffff', font: { size: 8 } }
        },
        y: {
          grid: { color: 'rgba(0, 255, 255, 0.1)' },
          ticks: { color: '#00ffff', font: { size: 8 } },
          max: 100
        }
      },
      animation: { duration: 1000 }
    }
  });
  console.log('✅ Graphique Activité créé');

  // Mise à jour périodique
  setInterval(() => {
    if (activityChart) {
      activityChart.data.datasets[0].data.shift();
      const newVal = Math.floor(Math.random() * 80 + 20);
      activityChart.data.datasets[0].data.push(newVal);
      activityChart.update('none');
    }
  }, 3000);
}

// ==================== GRAPHIQUE RADAR ====================
function createRadarChart(skills) {
  const ctx = document.getElementById('radarChart');
  if (!ctx) return;

  const skillData = skills || masterData.kasparov.skills;
  const labels = ['Opening', 'Middlegame', 'Endgame', 'Tactics', 'Strategy', 'Calculation'];
  const values = [
    skillData.opening,
    skillData.middlegame,
    skillData.endgame,
    skillData.tactics,
    skillData.strategy,
    skillData.calculation
  ];

  if (radarChart) {
    radarChart.data.datasets[0].data = values;
    radarChart.update();
    return;
  }

  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Skills',
        data: values,
        backgroundColor: 'rgba(0, 255, 255, 0.3)',
        borderColor: '#00ffff',
        borderWidth: 2,
        pointBackgroundColor: '#00ffff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1,
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 16, 32, 0.95)',
          titleColor: '#00ffff',
          bodyColor: '#ffffff',
          borderColor: '#00ffff',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          min: 80,
          max: 100,
          ticks: {
            stepSize: 5,
            color: '#00ffff',
            backdropColor: 'transparent',
            font: { size: 9 }
          },
          grid: { color: 'rgba(0, 255, 255, 0.2)' },
          angleLines: { color: 'rgba(0, 255, 255, 0.2)' },
          pointLabels: {
            color: '#00ffff',
            font: { family: "'Orbitron', monospace", size: 10, weight: 'bold' }
          }
        }
      },
      animation: { duration: 1000, easing: 'easeOutQuart' }
    }
  });
  console.log('✅ Graphique Radar créé');
}

// ==================== FONCTIONS GLOBALES ====================
window.updateEloChart = function(masterKey) {
  if (!eloChart || !masterData[masterKey]) return;
  
  const data = masterData[masterKey];
  eloChart.data.labels = data.years;
  eloChart.data.datasets[0].data = data.elo;
  eloChart.update();
};

window.updateRadarChart = function(skills) {
  createRadarChart(skills);
};

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    createEloChart();
    createActivityChart();
    createRadarChart();
    console.log('✅ Tous les graphiques Chart.js initialisés');
  }, 500);
});
