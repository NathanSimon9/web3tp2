/**
 * ============================================
 * VFX.JS - Effets Visuels + ŒIL ROUGE IRON MAN
 * ============================================
 * - Œil rouge qui scanne l'écran et fixe des cibles
 * - Particules flottantes
 * - Effets de chargement
 */

console.log('✨ Initialisation des effets VFX...');

// ==================== ŒIL ROUGE IRON MAN ====================
class RedEyeScanner {
  constructor() {
    this.eye = document.querySelector('.red-eye');
    this.eyeCoords = document.getElementById('eyeCoords');
    this.scanLines = [
      document.getElementById('scanLine1'),
      document.getElementById('scanLine2'),
      document.getElementById('scanLine3')
    ];
    
    this.currentX = window.innerWidth / 2;
    this.currentY = window.innerHeight / 2;
    this.targetX = this.currentX;
    this.targetY = this.currentY;
    
    this.targets = [];
    this.currentTargetIndex = 0;
    this.scanMode = 'patrol'; // 'patrol', 'focus', 'scan'
    this.scanTimer = 0;
    
    this.init();
  }
  
  init() {
    // Collecter les cibles (pièces d'échecs, cartes, etc.)
    this.collectTargets();
    
    // Démarrer l'animation
    this.animate();
    
    // Changer de mode périodiquement
    setInterval(() => this.changeMode(), 4000);
    
    // Mettre à jour les cibles quand la fenêtre change
    window.addEventListener('resize', () => this.collectTargets());
    
    console.log('👁️ Œil rouge initialisé avec', this.targets.length, 'cibles');
  }
  
  collectTargets() {
    this.targets = [];
    
    // Ajouter les pièces d'échecs
    document.querySelectorAll('.piece-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      this.targets.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        name: card.querySelector('.piece-name')?.textContent || 'PIECE',
        element: card
      });
    });
    
    // Ajouter les data cards
    document.querySelectorAll('.data-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      this.targets.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        name: 'DATA',
        element: card
      });
    });
    
    // Ajouter le graphique
    const chart = document.getElementById('eloChart');
    if (chart) {
      const rect = chart.getBoundingClientRect();
      this.targets.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        name: 'CHART',
        element: chart
      });
    }
    
    // Ajouter la carte
    const carte = document.getElementById('carte');
    if (carte) {
      const rect = carte.getBoundingClientRect();
      this.targets.push({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        name: 'MAP',
        element: carte
      });
    }
    
    // Ajouter des points aléatoires pour le patrol
    for (let i = 0; i < 5; i++) {
      this.targets.push({
        x: 100 + Math.random() * (window.innerWidth - 200),
        y: 100 + Math.random() * (window.innerHeight - 200),
        name: 'SECTOR-' + (i + 1),
        element: null
      });
    }
  }
  
  changeMode() {
    const modes = ['patrol', 'focus', 'scan'];
    this.scanMode = modes[Math.floor(Math.random() * modes.length)];
    
    if (this.scanMode === 'focus') {
      this.currentTargetIndex = Math.floor(Math.random() * this.targets.length);
    }
  }
  
  getNextTarget() {
    switch(this.scanMode) {
      case 'patrol':
        // Mouvement aléatoire
        return {
          x: 150 + Math.random() * (window.innerWidth - 300),
          y: 100 + Math.random() * (window.innerHeight - 200)
        };
        
      case 'focus':
        // Fixer une cible spécifique
        const target = this.targets[this.currentTargetIndex];
        if (target && target.element) {
          const rect = target.element.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            name: target.name
          };
        }
        return { x: this.currentX, y: this.currentY };
        
      case 'scan':
        // Scanner séquentiellement les cibles
        this.currentTargetIndex = (this.currentTargetIndex + 1) % this.targets.length;
        const scanTarget = this.targets[this.currentTargetIndex];
        if (scanTarget && scanTarget.element) {
          const rect = scanTarget.element.getBoundingClientRect();
          return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
            name: scanTarget.name
          };
        }
        return { x: this.currentX, y: this.currentY };
        
      default:
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }
  }
  
  updateScanLines() {
    const eyeX = this.currentX;
    const eyeY = this.currentY;
    
    // Dessiner des lignes vers des cibles proches
    this.targets.slice(0, 3).forEach((target, i) => {
      if (this.scanLines[i] && target.element) {
        const rect = target.element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top + rect.height / 2;
        
        const dist = Math.sqrt(Math.pow(targetX - eyeX, 2) + Math.pow(targetY - eyeY, 2));
        
        if (dist < 400) {
          this.scanLines[i].setAttribute('x1', eyeX);
          this.scanLines[i].setAttribute('y1', eyeY);
          this.scanLines[i].setAttribute('x2', targetX);
          this.scanLines[i].setAttribute('y2', targetY);
          this.scanLines[i].style.opacity = 1 - (dist / 400);
        } else {
          this.scanLines[i].style.opacity = 0;
        }
      }
    });
  }
  
  animate() {
    this.scanTimer++;
    
    // Changer de cible toutes les 2-3 secondes
    if (this.scanTimer % 120 === 0) {
      const nextTarget = this.getNextTarget();
      this.targetX = nextTarget.x;
      this.targetY = nextTarget.y;
    }
    
    // Mouvement fluide vers la cible
    const easing = 0.03;
    this.currentX += (this.targetX - this.currentX) * easing;
    this.currentY += (this.targetY - this.currentY) * easing;
    
    // Appliquer la position
    if (this.eye) {
      this.eye.style.left = this.currentX + 'px';
      this.eye.style.top = this.currentY + 'px';
    }
    
    // Mettre à jour les coordonnées affichées
    if (this.eyeCoords) {
      this.eyeCoords.textContent = `X:${Math.round(this.currentX)} Y:${Math.round(this.currentY)}`;
    }
    
    // Mettre à jour les lignes de scan
    this.updateScanLines();
    
    requestAnimationFrame(() => this.animate());
  }
}

// ==================== PARTICULES FLOTTANTES ====================
function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particles-canvas';
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.4;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  const ctx = canvas.getContext('2d');
  let particles = [];
  const particleCount = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.8 ? '#ff3300' : '#00ffff';
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Lignes entre particules proches
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0, 255, 255, ${0.08 * (1 - dist / 80)})`;
          ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// ==================== CURSEUR PERSONNALISÉ ====================
function initCustomCursor() {
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = `
    <div class="cursor-dot"></div>
    <div class="cursor-ring"></div>
  `;
  document.body.appendChild(cursor);

  const style = document.createElement('style');
  style.textContent = `
    .custom-cursor {
      position: fixed;
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: difference;
    }
    .cursor-dot {
      position: absolute;
      width: 6px;
      height: 6px;
      background: #00ffff;
      border-radius: 50%;
      transform: translate(-50%, -50%);
    }
    .cursor-ring {
      position: absolute;
      width: 35px;
      height: 35px;
      border: 2px solid rgba(0, 255, 255, 0.5);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      transition: all 0.15s ease;
    }
    .custom-cursor.hover .cursor-ring {
      width: 50px;
      height: 50px;
      border-color: #ff3300;
    }
    @media (max-width: 768px) {
      .custom-cursor { display: none; }
    }
  `;
  document.head.appendChild(style);

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.querySelectorAll('a, button, .piece-card, .target-item, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
  });
}

// ==================== EFFET DE CHARGEMENT ====================
function showLoadingEffect() {
  const loader = document.createElement('div');
  loader.id = 'hud-loader';
  loader.innerHTML = `
    <div class="loader-content">
      <div class="loader-eye">
        <div class="loader-eye-inner"></div>
      </div>
      <div class="loader-text">INITIALIZING JARVIS...</div>
      <div class="loader-progress">
        <div class="loader-bar"></div>
      </div>
    </div>
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    #hud-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #000510;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10001;
      transition: opacity 0.5s ease;
    }
    .loader-content {
      text-align: center;
    }
    .loader-eye {
      width: 80px;
      height: 80px;
      border: 3px solid rgba(255, 50, 0, 0.3);
      border-radius: 50%;
      margin: 0 auto 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: loader-eye-pulse 1.5s ease-in-out infinite;
    }
    .loader-eye-inner {
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, #ff3300 0%, #990000 100%);
      border-radius: 50%;
      box-shadow: 0 0 30px #ff3300, 0 0 60px rgba(255, 50, 0, 0.5);
    }
    @keyframes loader-eye-pulse {
      0%, 100% { transform: scale(1); border-color: rgba(255, 50, 0, 0.3); }
      50% { transform: scale(1.1); border-color: rgba(255, 50, 0, 0.8); }
    }
    .loader-text {
      font-family: 'Orbitron', monospace;
      color: #ff3300;
      font-size: 14px;
      letter-spacing: 4px;
      margin-bottom: 20px;
      text-shadow: 0 0 10px #ff3300;
    }
    .loader-progress {
      width: 200px;
      height: 3px;
      background: rgba(255, 50, 0, 0.2);
      border-radius: 2px;
      overflow: hidden;
      margin: 0 auto;
    }
    .loader-bar {
      height: 100%;
      background: #ff3300;
      box-shadow: 0 0 10px #ff3300;
      animation: load 2.5s ease forwards;
    }
    @keyframes load {
      0% { width: 0%; }
      100% { width: 100%; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(loader);
  
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 500);
  }, 3000);
}

// ==================== HUD CORNERS ====================
function addHudDecorations() {
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  
  const style = document.createElement('style');
  style.textContent = `
    .hud-corner {
      position: fixed;
      width: 40px;
      height: 40px;
      pointer-events: none;
      z-index: 100;
    }
    .hud-corner::before,
    .hud-corner::after {
      content: '';
      position: absolute;
      background: #ff3300;
      box-shadow: 0 0 8px #ff3300;
    }
    .hud-corner.top-left { top: 70px; left: 330px; }
    .hud-corner.top-right { top: 70px; right: 350px; }
    .hud-corner.bottom-left { bottom: 60px; left: 330px; }
    .hud-corner.bottom-right { bottom: 60px; right: 350px; }
    
    .hud-corner.top-left::before,
    .hud-corner.bottom-left::before { width: 25px; height: 2px; top: 0; left: 0; }
    .hud-corner.top-left::after,
    .hud-corner.bottom-left::after { width: 2px; height: 25px; top: 0; left: 0; }
    .hud-corner.top-right::before,
    .hud-corner.bottom-right::before { width: 25px; height: 2px; top: 0; right: 0; }
    .hud-corner.top-right::after,
    .hud-corner.bottom-right::after { width: 2px; height: 25px; top: 0; right: 0; }
    .hud-corner.bottom-left::before { top: auto; bottom: 0; }
    .hud-corner.bottom-left::after { top: auto; bottom: 0; }
    .hud-corner.bottom-right::before { top: auto; bottom: 0; }
    .hud-corner.bottom-right::after { top: auto; bottom: 0; }
    
    @media (max-width: 1200px) { .hud-corner { display: none; } }
  `;
  document.head.appendChild(style);
  
  corners.forEach(corner => {
    const el = document.createElement('div');
    el.className = `hud-corner ${corner}`;
    document.body.appendChild(el);
  });
}

// ==================== INITIALISATION ====================
let redEyeScanner = null;

document.addEventListener('DOMContentLoaded', () => {
  showLoadingEffect();
  
  setTimeout(() => {
    initParticles();
    initCustomCursor();
    addHudDecorations();
    
    // Initialiser l'œil rouge
    redEyeScanner = new RedEyeScanner();
    
    console.log('✅ Effets VFX initialisés avec œil rouge Iron Man');
  }, 100);
});

// Export pour utilisation externe
window.redEyeScanner = () => redEyeScanner;
