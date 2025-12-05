console.log('⚡ Initialisation du dashboard...');

// ==================== TIMER MISSION ====================
let missionTime = 0;

function updateTimer() {
  missionTime++;
  const h = Math.floor(missionTime / 3600).toString().padStart(2, '0');
  const m = Math.floor((missionTime % 3600) / 60).toString().padStart(2, '0');
  const s = (missionTime % 60).toString().padStart(2, '0');
  
  const timer = document.getElementById('missionTimer');
  if (timer) {
    timer.textContent = `${h}:${m}:${s}`;
  }
}

setInterval(updateTimer, 1000);
console.log('✅ Timer activé');

// ==================== CPU USAGE ====================
function updateCPU() {
  const cpu = document.getElementById('cpuUsage');
  if (cpu) {
    const value = Math.floor(40 + Math.random() * 20);
    cpu.textContent = value + '%';
  }
}

setInterval(updateCPU, 3000);

// ==================== TARGETS ====================
function updateTargets() {
  const targets = document.getElementById('activeTargets');
  if (targets) {
    const value = Math.floor(12 + Math.random() * 6);
    targets.textContent = value;
  }
}

setInterval(updateTargets, 5000);

// ==================== NOTIFICATIONS ====================
const notifications = [
  'Système initialisé • Tous les modules opérationnels',
  'Nouvelle menace détectée • Secteur Alpha-7',
  'Analyse tactique mise à jour • Confiance: 94%',
  'Scan global complété • 15 cibles identifiées',
  'Connexion satellite établie',
  'Mise à jour IA en cours',
  'Optimisation réseau neural • +12%',
  'Calibration capteurs terminée',
  'Détection schémas tactiques avancés'
];

let notifIndex = 0;

function updateNotification() {
  const notif = document.querySelector('#notification span');
  if (notif) {
    notif.style.opacity = '0';
    
    setTimeout(() => {
      notifIndex = (notifIndex + 1) % notifications.length;
      notif.textContent = notifications[notifIndex];
      notif.style.opacity = '1';
    }, 300);
  }
}

setInterval(updateNotification, 8000);

// ==================== GRAPHIQUE ACTIVITÉ ====================
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('activityGraph');
  if (!canvas) return;
  
  console.log('📊 Création du graphique d\'activité...');
  
  const ctx = canvas.getContext('2d');
  const points = 40;
  let data = Array(points).fill(0).map(() => Math.random() * 80 + 20);
  
  function drawGraph() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Grille
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (canvas.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Zone
    const spacing = canvas.width / (points - 1);
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(0, 255, 255, 0.4)');
    gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
    
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    
    data.forEach((val, i) => {
      const x = i * spacing;
      const y = canvas.height - (val / 100) * canvas.height;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Ligne
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = i * spacing;
      const y = canvas.height - (val / 100) * canvas.height;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Points
    data.forEach((val, i) => {
      const x = i * spacing;
      const y = canvas.height - (val / 100) * canvas.height;
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#00ffff';
      ctx.fill();
    });
  }
  
  function updateGraph() {
    data.shift();
    data.push(Math.random() * 80 + 20);
    drawGraph();
  }
  
  drawGraph();
  setInterval(updateGraph, 2000);
  
  console.log('✅ Graphique créé');
});

// ==================== BARRES DE PROGRESSION ====================
window.addEventListener('DOMContentLoaded', () => {
  const bars = document.querySelectorAll('.progress-fill');
  
  bars.forEach((bar, index) => {
    const targetWidth = bar.style.width;
    bar.style.width = '0%';
    
    setTimeout(() => {
      bar.style.transition = 'width 1.5s ease';
      bar.style.width = targetWidth;
    }, 100 + index * 100);
  });
  
  console.log('✅ Barres de progression animées');
});

// ==================== DONNÉES TACTIQUES ====================
function updateTacticalData() {
  const threat = document.querySelector('.data-value.threat');
  const opportunity = document.querySelector('.data-value.opportunity');
  const zone = document.querySelector('.data-value.neutral');
  
  if (threat) {
    threat.style.opacity = '0';
    setTimeout(() => {
      threat.textContent = Math.floor(8 + Math.random() * 8);
      threat.style.opacity = '1';
    }, 300);
  }
  
  if (opportunity) {
    opportunity.style.opacity = '0';
    setTimeout(() => {
      opportunity.textContent = Math.floor(5 + Math.random() * 8);
      opportunity.style.opacity = '1';
    }, 300);
  }
  
  if (zone) {
    zone.style.opacity = '0';
    setTimeout(() => {
      zone.textContent = Math.floor(55 + Math.random() * 20) + '%';
      zone.style.opacity = '1';
    }, 300);
  }
}

setInterval(updateTacticalData, 7000);

// ==================== BARRE ÉVALUATION ====================
let currentEval = 0;
let targetEval = 0;

function initEvalBar() {
  const barWhite = document.getElementById('barFillWhite');
  const barBlack = document.getElementById('barFillBlack');
  const barValue = document.getElementById('barValue');
  
  if (!barWhite || !barBlack || !barValue) {
    console.error('❌ Barre d\'évaluation non trouvée');
    return;
  }
  
  console.log('✅ Barre d\'évaluation initialisée');
  
  function updateBar() {
    const diff = targetEval - currentEval;
    currentEval += diff * 0.08;
    
    const percentage = Math.max(0, Math.min(100, ((currentEval + 10) / 20) * 100));
    
    barWhite.style.height = percentage + '%';
    barBlack.style.height = (100 - percentage) + '%';
    
    const displayVal = currentEval.toFixed(1);
    barValue.textContent = currentEval >= 0 ? '+' + displayVal : displayVal;
    
    barValue.classList.remove('positive', 'negative');
    if (currentEval > 0.3) {
      barValue.classList.add('positive');
    } else if (currentEval < -0.3) {
      barValue.classList.add('negative');
    }
  }
  
  function changeTarget() {
    targetEval = (Math.random() - 0.5) * 12;
  }
  
  setInterval(updateBar, 50);
  setInterval(changeTarget, 4000);
  
  changeTarget();
}

window.addEventListener('DOMContentLoaded', () => {
  setTimeout(initEvalBar, 500);
});

// ==================== TOGGLE VIEW ====================
window.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleView');
  const globalContainer = document.getElementById('globalContainer');
  const masterProfile = document.getElementById('masterProfile');
  
  if (!toggleBtn || !globalContainer || !masterProfile) {
    console.error('❌ Éléments toggle non trouvés');
    return;
  }
  
  console.log('✅ Toggle configuré');
  
  let currentView = 'global';
  
  toggleBtn.addEventListener('click', () => {
    if (currentView === 'global') {
      // Vers Master Profile
      globalContainer.style.display = 'none';
      masterProfile.style.display = 'flex';
      toggleBtn.textContent = 'GLOBAL VIEW';
      currentView = 'master';
      console.log('📊 Vue: Master Profile');
    } else {
      // Vers Global View
      masterProfile.style.display = 'none';
      globalContainer.style.display = 'flex';
      toggleBtn.textContent = 'MASTER PROFILE';
      currentView = 'global';
      console.log('🌍 Vue: Global');
    }
  });
});

// ==================== HOVER CARTES ====================
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.piece-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateX(8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateX(0) scale(1)';
    });
  });
});

// ==================== BOUTON REFRESH ====================
window.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.querySelector('.panel-btn:last-child');
  
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      console.log('🔄 Refresh');
      refreshBtn.style.transform = 'rotate(360deg)';
      refreshBtn.style.transition = 'transform 0.6s ease';
      
      setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
      }, 600);
      
      const bars = document.querySelectorAll('.progress-fill');
      bars.forEach(bar => {
        const currentWidth = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
          bar.style.width = currentWidth;
        }, 100);
      });
    });
  }
});

// ==================== FADE IN ====================
window.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  
  setTimeout(() => {
    document.body.style.transition = 'opacity 1s ease';
    document.body.style.opacity = '1';
  }, 100);
  
  console.log('✅ Dashboard chargé avec succès');
  console.log('🎉 Tous les systèmes opérationnels');
});