/**
 * NEXUS CHESS - Dashboard Controller
 * Gère les animations, timers, et interactions du dashboard
 */

console.log('🚀 NEXUS CHESS - Initialisation du Dashboard...');

// ==================== MISSION TIMER ====================
let missionTime = 0;

function updateMissionTimer() {
  missionTime++;
  const hours = Math.floor(missionTime / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((missionTime % 3600) / 60).toString().padStart(2, '0');
  const seconds = (missionTime % 60).toString().padStart(2, '0');
  
  const timerElement = document.getElementById('missionTimer');
  if (timerElement) {
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
  }
}

setInterval(updateMissionTimer, 1000);

// ==================== DATE SYSTÈME ====================
function updateSystemDate() {
  const dateElement = document.getElementById('systemDate');
  if (dateElement) {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    dateElement.textContent = `${year}.${month}.${day}`;
  }
}

updateSystemDate();

// ==================== CPU USAGE ANIMATION ====================
let cpuBase = 45;
let cpuTarget = 45;

function animateCPU() {
  const cpuElement = document.getElementById('cpuUsage');
  if (cpuElement) {
    // Smooth transition vers la cible
    cpuBase += (cpuTarget - cpuBase) * 0.1;
    const displayed = Math.round(cpuBase);
    cpuElement.textContent = displayed + '%';
    
    // Changer la cible périodiquement
    if (Math.random() < 0.1) {
      cpuTarget = Math.floor(35 + Math.random() * 30);
    }
  }
}

setInterval(animateCPU, 100);

// ==================== ACTIVE TARGETS COUNTER ====================
function animateTargets() {
  const targetsElement = document.getElementById('activeTargets');
  if (targetsElement) {
    const targets = Math.floor(12 + Math.random() * 8);
    targetsElement.textContent = targets;
  }
}

setInterval(animateTargets, 5000);

// ==================== NOTIFICATION SYSTEM ====================
const notifications = [
  { icon: 'bi-broadcast', text: 'Système initialisé • Tous les modules opérationnels' },
  { icon: 'bi-exclamation-triangle', text: 'Nouvelle menace détectée • Secteur Alpha-7' },
  { icon: 'bi-graph-up', text: 'Analyse tactique mise à jour • Niveau de confiance: 94%' },
  { icon: 'bi-search', text: 'Scan global complété • 15 cibles identifiées' },
  { icon: 'bi-wifi', text: 'Connexion établie avec satellite de surveillance' },
  { icon: 'bi-cpu', text: 'Mise à jour de l\'intelligence artificielle en cours' },
  { icon: 'bi-lightning-charge', text: 'Optimisation du réseau neural • Performance +12%' },
  { icon: 'bi-shield-check', text: 'Protocoles de sécurité vérifiés • Aucune intrusion' },
  { icon: 'bi-geo-alt', text: 'Nouvelle position de grand maître localisée' },
  { icon: 'bi-trophy', text: 'Base de données ELO mise à jour • 2,847 profils' }
];

let currentNotification = 0;

function updateNotification() {
  const notificationElement = document.getElementById('notification');
  if (notificationElement) {
    const iconElement = notificationElement.querySelector('i');
    const textElement = notificationElement.querySelector('span');
    
    if (iconElement && textElement) {
      // Fade out
      notificationElement.style.opacity = '0';
      notificationElement.style.transform = 'translateY(10px)';
      
      setTimeout(() => {
        currentNotification = (currentNotification + 1) % notifications.length;
        const notif = notifications[currentNotification];
        
        iconElement.className = `bi ${notif.icon}`;
        textElement.textContent = notif.text;
        
        // Fade in
        notificationElement.style.opacity = '1';
        notificationElement.style.transform = 'translateY(0)';
      }, 300);
    }
  }
}

setInterval(updateNotification, 6000);

// ==================== ACTIVITY GRAPH ====================
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('activityGraph');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const dataPoints = 50;
  let activityData = Array(dataPoints).fill(0).map(() => Math.random() * 70 + 30);
  
  function drawGraph() {
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Fond avec gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(0, 240, 255, 0.05)');
    bgGradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Grille horizontale
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Données
    const pointSpacing = width / (dataPoints - 1);
    
    // Zone de remplissage
    ctx.beginPath();
    ctx.moveTo(0, height);
    
    activityData.forEach((value, index) => {
      const x = index * pointSpacing;
      const y = height - (value / 100) * height;
      ctx.lineTo(x, y);
    });
    
    ctx.lineTo(width, height);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(0, 240, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Ligne principale
    ctx.beginPath();
    activityData.forEach((value, index) => {
      const x = index * pointSpacing;
      const y = height - (value / 100) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Points sur la ligne
    activityData.forEach((value, index) => {
      if (index % 5 === 0) {
        const x = index * pointSpacing;
        const y = height - (value / 100) * height;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f0ff';
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });
  }
  
  function updateGraph() {
    // Décaler les données et ajouter un nouveau point
    activityData.shift();
    
    // Nouveau point avec tendance douce
    const lastValue = activityData[activityData.length - 1];
    const change = (Math.random() - 0.5) * 20;
    let newValue = lastValue + change;
    newValue = Math.max(20, Math.min(90, newValue));
    
    activityData.push(newValue);
    drawGraph();
  }
  
  drawGraph();
  setInterval(updateGraph, 150);
});

// ==================== TACTICAL DATA UPDATES ====================
function updateTacticalData() {
  const threatElement = document.querySelector('.data-row.threat .data-value');
  const opportunityElement = document.querySelector('.data-row.opportunity .data-value');
  const zoneElement = document.querySelector('.data-row.neutral .data-value');
  
  if (threatElement) {
    const threats = Math.floor(8 + Math.random() * 8);
    animateValue(threatElement, parseInt(threatElement.textContent) || 0, threats);
  }
  
  if (opportunityElement) {
    const opportunities = Math.floor(5 + Math.random() * 8);
    animateValue(opportunityElement, parseInt(opportunityElement.textContent) || 0, opportunities);
  }
  
  if (zoneElement) {
    const zones = Math.floor(55 + Math.random() * 25);
    animateValue(zoneElement, parseInt(zoneElement.textContent) || 0, zones, '%');
  }
}

function animateValue(element, start, end, suffix = '') {
  const duration = 500;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    const current = Math.round(start + (end - start) * eased);
    element.textContent = current + suffix;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

setInterval(updateTacticalData, 7000);

// ==================== EVALUATION BAR ====================
let currentEval = 0;
let targetEval = 0;

function initEvaluationBar() {
  const barFillWhite = document.getElementById('barFillWhite');
  const barFillBlack = document.getElementById('barFillBlack');
  const barValue = document.getElementById('barValue');
  const evalLabel = document.getElementById('evalLabel');
  
  if (!barFillWhite || !barFillBlack || !barValue) {
    console.warn('⚠️ Éléments de la barre d\'évaluation non trouvés');
    return;
  }
  
  console.log('✅ Barre d\'évaluation initialisée');
  
  function updateBar() {
    // Interpolation douce
    const diff = targetEval - currentEval;
    currentEval += diff * 0.06;
    
    // Conversion en pourcentage (-10 à +10 -> 0% à 100%)
    const percentage = Math.max(0, Math.min(100, ((currentEval + 10) / 20) * 100));
    
    barFillWhite.style.height = percentage + '%';
    barFillBlack.style.height = (100 - percentage) + '%';
    
    // Affichage de la valeur
    const displayValue = Math.abs(currentEval).toFixed(1);
    barValue.textContent = currentEval >= 0 ? '+' + displayValue : '-' + displayValue;
    
    // Couleur et label
    barValue.classList.remove('positive', 'negative');
    
    if (currentEval > 0.5) {
      barValue.classList.add('positive');
      if (evalLabel) evalLabel.textContent = 'BLANC +';
    } else if (currentEval < -0.5) {
      barValue.classList.add('negative');
      if (evalLabel) evalLabel.textContent = 'NOIR +';
    } else {
      if (evalLabel) evalLabel.textContent = 'ÉGALITÉ';
    }
  }
  
  function changeTarget() {
    // Nouvelle évaluation cible (entre -6 et +6)
    targetEval = (Math.random() - 0.5) * 12;
  }
  
  setInterval(updateBar, 30);
  setInterval(changeTarget, 5000);
  
  changeTarget();
}

// ==================== PROGRESS BARS ANIMATION ====================
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach((bar, index) => {
    const targetWidth = bar.style.getPropertyValue('--target-width');
    if (targetWidth) {
      bar.style.width = '0%';
      
      setTimeout(() => {
        bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = targetWidth;
      }, 100 + index * 150);
    }
  });
}

// ==================== HOVER EFFECTS ====================
function setupHoverEffects() {
  // Piece cards
  document.querySelectorAll('.piece-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateX(8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
  
  // Target items
  document.querySelectorAll('.target-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        item.style.transform = 'translateX(8px)';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.transform = '';
      }
    });
  });
}

// ==================== SCAN LINE ANIMATION ====================
function triggerScanLine() {
  const scanLine = document.querySelector('.scan-line');
  if (scanLine) {
    scanLine.classList.add('active');
    setTimeout(() => {
      scanLine.classList.remove('active');
    }, 2000);
  }
}

// Déclencher le scan périodiquement
setInterval(triggerScanLine, 15000);

// ==================== KEYBOARD SHORTCUTS ====================
document.addEventListener('keydown', (e) => {
  // Espace pour basculer le profil
  if (e.code === 'Space' && !e.target.matches('input, textarea')) {
    e.preventDefault();
    const toggleBtn = document.getElementById('toggleView');
    if (toggleBtn) toggleBtn.click();
  }
  
  // S pour déclencher un scan
  if (e.code === 'KeyS' && !e.target.matches('input, textarea')) {
    triggerScanLine();
  }
});

// ==================== INITIALISATION ====================
window.addEventListener('DOMContentLoaded', () => {
  console.log('🎯 Initialisation des composants du dashboard...');
  
  setTimeout(() => {
    initEvaluationBar();
    animateProgressBars();
    setupHoverEffects();
    
    // Premier scan
    setTimeout(triggerScanLine, 2000);
    
    console.log('✅ Dashboard NEXUS CHESS initialisé avec succès');
  }, 500);
});

// ==================== EXPORT POUR DEBUG ====================
window.NEXUS = {
  triggerScan: triggerScanLine,
  updateTactical: updateTacticalData,
  version: '2.4.1'
};

console.log('✅ Module Dashboard chargé');
