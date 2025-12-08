

console.log('🎬 Initialisation des animations Anime.js...');

// ==================== DONNÉES GLOBALES ====================
let missionTime = 0;
let currentEval = 0;
let targetEval = 0;

// ==================== TIMER DE MISSION ====================
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

// ==================== HORLOGE TEMPS RÉEL ====================
function updateCurrentTime() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('fr-FR', { hour12: false });
  const timeElement = document.getElementById('currentTime');
  if (timeElement) {
    timeElement.textContent = timeStr;
  }
}

// ==================== CPU USAGE ANIMATION ====================
function animateCPU() {
  const cpuElement = document.getElementById('cpuUsage');
  if (cpuElement) {
    const newValue = Math.floor(35 + Math.random() * 30);
    
    anime({
      targets: { value: parseInt(cpuElement.textContent) || 40 },
      value: newValue,
      round: 1,
      duration: 800,
      easing: 'easeOutQuad',
      update: function(anim) {
        cpuElement.textContent = Math.round(anim.animations[0].currentValue) + '%';
      }
    });
  }
}

// ==================== ACTIVE TARGETS ANIMATION ====================
function animateTargets() {
  const targetsElement = document.getElementById('activeTargets');
  if (targetsElement) {
    const newValue = Math.floor(10 + Math.random() * 10);
    
    anime({
      targets: { value: parseInt(targetsElement.textContent) || 15 },
      value: newValue,
      round: 1,
      duration: 600,
      easing: 'easeOutQuad',
      update: function(anim) {
        targetsElement.textContent = Math.round(anim.animations[0].currentValue);
      }
    });
  }
}

// ==================== DONNÉES TACTIQUES ====================
function updateTacticalData() {
  const threatElement = document.getElementById('threatCount');
  const opportunityElement = document.getElementById('opportunityCount');
  const zoneElement = document.getElementById('zoneControl');
  
  if (threatElement) {
    const newThreat = Math.floor(8 + Math.random() * 10);
    anime({
      targets: { value: parseInt(threatElement.textContent) || 12 },
      value: newThreat,
      round: 1,
      duration: 500,
      easing: 'easeOutQuad',
      update: function(anim) {
        threatElement.textContent = Math.round(anim.animations[0].currentValue);
      }
    });
  }
  
  if (opportunityElement) {
    const newOpportunity = Math.floor(5 + Math.random() * 10);
    anime({
      targets: { value: parseInt(opportunityElement.textContent) || 8 },
      value: newOpportunity,
      round: 1,
      duration: 500,
      easing: 'easeOutQuad',
      update: function(anim) {
        opportunityElement.textContent = Math.round(anim.animations[0].currentValue);
      }
    });
  }
  
  if (zoneElement) {
    const newZone = Math.floor(50 + Math.random() * 30);
    anime({
      targets: { value: parseInt(zoneElement.textContent) || 64 },
      value: newZone,
      round: 1,
      duration: 500,
      easing: 'easeOutQuad',
      update: function(anim) {
        zoneElement.textContent = Math.round(anim.animations[0].currentValue) + '%';
      }
    });
  }
}

// ==================== SYSTÈME DE NOTIFICATIONS ====================
const notifications = [
  'Système initialisé • Tous les modules opérationnels',
  'Nouvelle menace détectée • Secteur Alpha-7',
  'Analyse tactique mise à jour • Confiance: 94%',
  'Scan global complété • 15 cibles identifiées',
  'Connexion satellite établie • Signal optimal',
  'Mise à jour IA en cours • Performance +12%',
  'Optimisation réseau neural terminée',
  'Calibration capteurs complète',
  'Détection schémas tactiques avancés',
  'Synchronisation données globales'
];

let currentNotification = 0;

function updateNotification() {
  const notificationSpan = document.querySelector('#notification span');
  if (notificationSpan) {
    // Fade out
    anime({
      targets: notificationSpan,
      opacity: 0,
      translateX: -20,
      duration: 300,
      easing: 'easeInQuad',
      complete: function() {
        currentNotification = (currentNotification + 1) % notifications.length;
        notificationSpan.textContent = notifications[currentNotification];
        
        // Fade in
        anime({
          targets: notificationSpan,
          opacity: 1,
          translateX: 0,
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    });
  }
}

// ==================== BARRE D'ÉVALUATION ====================
function initEvaluationBar() {
  const barFillWhite = document.getElementById('barFillWhite');
  const barFillBlack = document.getElementById('barFillBlack');
  const barValue = document.getElementById('barValue');
  
  if (!barFillWhite || !barFillBlack || !barValue) {
    console.warn('⚠️ Éléments de la barre d\'évaluation non trouvés');
    return;
  }
  
  console.log('✅ Barre d\'évaluation initialisée');
  
  function updateBar() {
    // Interpolation fluide
    const diff = targetEval - currentEval;
    currentEval += diff * 0.08;
    
    // Convertir en pourcentage (-10 à +10 -> 0% à 100%)
    const percentage = Math.max(0, Math.min(100, ((currentEval + 10) / 20) * 100));
    
    barFillWhite.style.height = percentage + '%';
    barFillBlack.style.height = (100 - percentage) + '%';
    
    // Afficher la valeur
    const displayValue = currentEval.toFixed(1);
    barValue.textContent = currentEval >= 0 ? '+' + displayValue : displayValue;
    
    // Couleur selon avantage
    barValue.classList.remove('positive', 'negative');
    if (currentEval > 0.5) {
      barValue.classList.add('positive');
    } else if (currentEval < -0.5) {
      barValue.classList.add('negative');
    }
    
    requestAnimationFrame(updateBar);
  }
  
  function changeTarget() {
    targetEval = (Math.random() - 0.5) * 14; // -7 à +7
  }
  
  updateBar();
  changeTarget();
  setInterval(changeTarget, 4000);
}

// ==================== ANIMATIONS D'ENTRÉE ====================
function animatePageLoad() {
  // Animation du header
  anime({
    targets: '.hud-header',
    translateY: [-60, 0],
    opacity: [0, 1],
    duration: 800,
    easing: 'easeOutExpo'
  });
  
  // Animation du panneau gauche
  anime({
    targets: '.left-panel',
    translateX: [-320, 0],
    opacity: [0, 1],
    duration: 1000,
    delay: 200,
    easing: 'easeOutExpo'
  });
  
  // Animation du panneau droit
  anime({
    targets: '.right-panel',
    translateX: [340, 0],
    opacity: [0, 1],
    duration: 1000,
    delay: 200,
    easing: 'easeOutExpo'
  });
  
  // Animation du footer
  anime({
    targets: '.hud-footer',
    translateY: [50, 0],
    opacity: [0, 1],
    duration: 800,
    delay: 400,
    easing: 'easeOutExpo'
  });
  
  // Animation des cartes de pièces
  anime({
    targets: '.piece-card',
    translateX: [-50, 0],
    opacity: [0, 1],
    duration: 600,
    delay: anime.stagger(100, { start: 500 }),
    easing: 'easeOutQuad'
  });
  
  // Animation des sections intel
  anime({
    targets: '.intel-section',
    translateY: [30, 0],
    opacity: [0, 1],
    duration: 600,
    delay: anime.stagger(100, { start: 600 }),
    easing: 'easeOutQuad'
  });
  
  // Animation des barres de progression
  setTimeout(() => {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach((bar, index) => {
      const targetWidth = bar.style.width;
      bar.style.width = '0%';
      
      anime({
        targets: bar,
        width: targetWidth,
        duration: 1200,
        delay: index * 80,
        easing: 'easeOutQuad'
      });
    });
  }, 800);
}

// ==================== ANIMATION HOVER CARTES ====================
function setupCardHoverAnimations() {
  const cards = document.querySelectorAll('.piece-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      anime({
        targets: card,
        translateX: 8,
        scale: 1.02,
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      // Animer la bordure
      anime({
        targets: card,
        borderColor: 'rgba(0, 255, 255, 1)',
        boxShadow: '0 0 25px rgba(0, 255, 255, 0.5)',
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
    
    card.addEventListener('mouseleave', () => {
      anime({
        targets: card,
        translateX: 0,
        scale: 1,
        duration: 300,
        easing: 'easeOutQuad'
      });
      
      anime({
        targets: card,
        borderColor: 'rgba(0, 255, 255, 0.3)',
        boxShadow: '0 0 0px rgba(0, 255, 255, 0)',
        duration: 300,
        easing: 'easeOutQuad'
      });
    });
  });
}

// ==================== ANIMATION LOGO ====================
function animateLogo() {
  anime({
    targets: '.logo-icon',
    scale: [1, 1.1, 1],
    rotate: [0, 5, 0],
    duration: 3000,
    easing: 'easeInOutSine',
    loop: true
  });
}

// ==================== ANIMATION STATUS INDICATOR ====================
function animateStatusIndicator() {
  anime({
    targets: '.status-indicator',
    scale: [1, 1.3, 1],
    opacity: [1, 0.5, 1],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true
  });
}

// ==================== ANIMATION GLITCH EFFET ====================
function triggerGlitch() {
  const glitchOverlay = document.querySelector('.glitch-overlay');
  if (glitchOverlay) {
    glitchOverlay.classList.add('active');
    setTimeout(() => {
      glitchOverlay.classList.remove('active');
    }, 300);
  }
}

// ==================== ANIMATION SCAN LINE ====================
function animateScanLine() {
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-effect';
  scanLine.style.cssText = `
    position: fixed;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.8), transparent);
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
    pointer-events: none;
    z-index: 1001;
    top: 0;
  `;
  document.body.appendChild(scanLine);
  
  anime({
    targets: scanLine,
    top: ['0%', '100%'],
    duration: 2000,
    easing: 'easeInOutQuad',
    complete: function() {
      scanLine.remove();
    }
  });
}

// Déclencher un scan périodiquement
setInterval(animateScanLine, 15000);

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Démarrer les timers
  setInterval(updateMissionTimer, 1000);
  setInterval(updateCurrentTime, 1000);
  updateCurrentTime();
  
  // Mises à jour périodiques
  setInterval(animateCPU, 3000);
  setInterval(animateTargets, 5000);
  setInterval(updateTacticalData, 7000);
  setInterval(updateNotification, 8000);
  
  // Glitch aléatoire
  setInterval(() => {
    if (Math.random() > 0.7) {
      triggerGlitch();
    }
  }, 10000);
  
  // Initialiser la barre d'évaluation
  setTimeout(initEvaluationBar, 500);
  
  // Animations d'entrée
  animatePageLoad();
  
  // Setup hover animations
  setupCardHoverAnimations();
  
  // Animations continues
  animateLogo();
  animateStatusIndicator();
  
  // Premier scan
  setTimeout(animateScanLine, 2000);
  
  console.log('✅ Animations Anime.js initialisées');
});

// ==================== EXPORT POUR UTILISATION EXTERNE ====================
window.animeHelpers = {
  triggerGlitch,
  animateScanLine,
  updateNotification
};
