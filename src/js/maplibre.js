import maplibregl from 'https://esm.sh/maplibre-gl@5.13.0';

// ==================== CHESS MASTERS DATA ====================
const chessMasters = [
  { 
    name: 'GARRY KASPAROV', 
    city: 'MOSCOW', 
    lng: 37.6173, 
    lat: 55.7558,
    image: 'assets/img/garry-kasparov.png',
    title: 'World Champion',
    elo: 2851,
    year: 1999,
    titles: 15,
    skills: { opening: 98, middlegame: 99, endgame: 95, tactics: 100, strategy: 98, calculation: 99 }
  },
  { 
    name: 'BOBBY FISCHER', 
    city: 'WASHINGTON DC', 
    lng: -77.0369, 
    lat: 38.9072,
    image: 'assets/img/Bobby-Fischer.png',
    title: 'Legendary Champion',
    elo: 2785,
    year: 1972,
    titles: 12,
    skills: { opening: 95, middlegame: 98, endgame: 99, tactics: 100, strategy: 96, calculation: 98 }
  },
  { 
    name: 'MAGNUS CARLSEN', 
    city: 'OSLO', 
    lng: 10.7522, 
    lat: 59.9139,
    image: 'assets/img/magnus-carlsen.jpg',
    title: 'Current World Champion',
    elo: 2882,
    year: 2014,
    titles: 21,
    skills: { opening: 97, middlegame: 99, endgame: 100, tactics: 98, strategy: 99, calculation: 97 }
  },
  { 
    name: 'JOSÉ RAÚL CAPABLANCA', 
    city: 'HAVANA', 
    lng: -82.3666, 
    lat: 23.1136,
    image: 'assets/img/capablanca.png',
    title: 'Chess Machine',
    elo: 2725,
    year: 1921,
    titles: 8,
    skills: { opening: 92, middlegame: 96, endgame: 100, tactics: 94, strategy: 97, calculation: 93 }
  },
  { 
    name: 'ANATOLY KARPOV', 
    city: 'MOSCOW', 
    lng: 37.6173, 
    lat: 55.7558,
    image: 'assets/img/anatoly-karpov.png',
    title: 'Positional Master',
    elo: 2780,
    year: 1994,
    titles: 16,
    skills: { opening: 96, middlegame: 97, endgame: 98, tactics: 95, strategy: 100, calculation: 96 }
  },
  { 
    name: 'ALEXANDER ALEKHINE', 
    city: 'PARIS', 
    lng: 2.3522, 
    lat: 48.8566,
    image: 'assets/img/Alexander-Alekhine.png',
    title: 'Attacking Genius',
    elo: 2690,
    year: 1927,
    titles: 10,
    skills: { opening: 93, middlegame: 98, endgame: 94, tactics: 99, strategy: 95, calculation: 98 }
  },
  { 
    name: 'MIKHAIL TAL', 
    city: 'RIGA', 
    lng: 24.1052, 
    lat: 56.9496,
    image: 'assets/img/Mikhail.png',
    title: 'The Magician',
    elo: 2705,
    year: 1980,
    titles: 11,
    skills: { opening: 94, middlegame: 100, endgame: 88, tactics: 100, strategy: 92, calculation: 99 }
  },
  { 
    name: 'VLADIMIR KRAMNIK', 
    city: 'MOSCOW', 
    lng: 37.6173, 
    lat: 55.7558,
    image: 'assets/img/Vladimir-Kramnik.png',
    title: 'Solid Champion',
    elo: 2817,
    year: 2016,
    titles: 14,
    skills: { opening: 98, middlegame: 96, endgame: 98, tactics: 95, strategy: 99, calculation: 96 }
  }
];

let currentMasterIndex = 0;

// ==================== PRELOAD IMAGES ====================
console.log('🖼️ Préchargement des images des grands maîtres...');
chessMasters.forEach(master => {
  const img = new Image();
  img.onload = () => console.log('✅ Image chargée:', master.name);
  img.onerror = () => console.warn('⚠️ Image non trouvée:', master.image);
  img.src = master.image;
});

// ==================== CREATE MAP ====================
const carte = new maplibregl.Map({
  container: 'carte',
  style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
  center: [37.6173, 55.7558],
  zoom: 16,
  pitch: 75,
  bearing: 0,
  antialias: true
});

// ==================== ADD 3D BUILDINGS ====================
carte.on('load', () => {
  const layers = carte.getStyle().layers;
  let labelLayerId;
  
  for (const layer of layers) {
    if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
      labelLayerId = layer.id;
      break;
    }
  }

  carte.addLayer({
    id: '3d-buildings',
    source: 'openmaptiles',
    'source-layer': 'building',
    filter: ['!', ['has', 'hide_3d']],
    type: 'fill-extrusion',
    minzoom: 14,
    paint: {
      'fill-extrusion-color': [
        'interpolate',
        ['linear'],
        ['get', 'render_height'],
        0, '#0080ff',
        50, '#00aaff',
        100, '#00ffff'
      ],
      'fill-extrusion-height': ['get', 'render_height'],
      'fill-extrusion-base': ['get', 'render_min_height'],
      'fill-extrusion-opacity': 0.8
    }
  }, labelLayerId);

  console.log('✅ Bâtiments 3D ajoutés');
  startCityScan();
});

// ==================== SCANNER MARKER ====================
const scannerDiv = document.createElement('div');
scannerDiv.className = 'scanner-dot';
scannerDiv.innerHTML = '<div class="pulse1"></div><div class="pulse2"></div>';
scannerDiv.style.cursor = 'pointer';

const scannerMarker = new maplibregl.Marker({ element: scannerDiv })
  .setLngLat([37.6173, 55.7558])
  .addTo(carte);

// ==================== ŒIL ROUGE SCANNER ====================
const redEyeDiv = document.createElement('div');
redEyeDiv.className = 'red-eye-scanner';
redEyeDiv.innerHTML = `
  <div class="eye-outer">
    <div class="eye-middle">
      <div class="eye-inner">
        <div class="eye-pupil"></div>
      </div>
    </div>
  </div>
  <div class="eye-beam"></div>
`;

const redEyeMarker = new maplibregl.Marker({ 
  element: redEyeDiv,
  anchor: 'center'
})
  .setLngLat([37.6173, 55.7558])
  .addTo(carte);

// Animation de l'œil qui regarde autour
let eyeAngle = 0;
setInterval(() => {
  eyeAngle += 0.05;
  const pupil = redEyeDiv.querySelector('.eye-pupil');
  const beam = redEyeDiv.querySelector('.eye-beam');
  if (pupil && beam) {
    const moveX = Math.cos(eyeAngle) * 3;
    const moveY = Math.sin(eyeAngle) * 3;
    pupil.style.transform = `translate(${moveX}px, ${moveY}px)`;
    beam.style.transform = `rotate(${eyeAngle * 50}deg)`;
  }
}, 50);

// Click on scanner
scannerDiv.addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('🖱️ Click sur scanner - Affichage du profil');
  showMasterProfile(chessMasters[currentMasterIndex]);
});

// ==================== SCAN LINE ====================
const scanLine = document.createElement('div');
scanLine.className = 'scan-line';
document.body.appendChild(scanLine);

// ==================== CITY SCANNING ====================
function startCityScan() {
  scanNextCity();
  setInterval(scanNextCity, 6000);
}

function scanNextCity() {
  const master = chessMasters[currentMasterIndex];
  console.log('📍 Scan de:', master.city, '-', master.name);

  updateScanDisplay(master);
  updateTargetList(currentMasterIndex);

  // Auto-show profile after scan
  setTimeout(() => {
    showMasterProfile(master);
  }, 1500);

  // Fly to city
  setTimeout(() => {
    carte.flyTo({
      center: [master.lng, master.lat],
      zoom: 16,
      pitch: 70,
      bearing: Math.random() * 360,
      duration: 2500,
      essential: true
    });
  }, 100);

  // Move scanner marker
  scannerMarker.setLngLat([master.lng, master.lat]);
  
  // Move red eye marker
  redEyeMarker.setLngLat([master.lng, master.lat]);

  // Scan line animation
  setTimeout(() => {
    const point = carte.project([master.lng, master.lat]);
    scanLine.style.top = `${point.y}px`;
    scanLine.style.transition = 'top 0.8s ease';
    
    setTimeout(() => {
      scanLine.style.top = '0px';
    }, 100);
    
    setTimeout(() => {
      scanLine.style.top = '100vh';
    }, 1000);
  }, 1500);

  currentMasterIndex = (currentMasterIndex + 1) % chessMasters.length;
}

// ==================== UPDATE SCAN DISPLAY ====================
function updateScanDisplay(master) {
  const scanTarget = document.getElementById('scanTarget');
  const scanCoords = document.getElementById('scanCoords');
  
  if (scanTarget) {
    scanTarget.style.opacity = '0';
    setTimeout(() => {
      scanTarget.textContent = master.city;
      scanTarget.style.opacity = '1';
    }, 300);
  }
  
  if (scanCoords) {
    scanCoords.style.opacity = '0';
    setTimeout(() => {
      const lat = Math.abs(master.lat).toFixed(4);
      const lng = Math.abs(master.lng).toFixed(4);
      const latDir = master.lat >= 0 ? 'N' : 'S';
      const lngDir = master.lng >= 0 ? 'E' : 'W';
      scanCoords.textContent = `${lat}°${latDir}, ${lng}°${lngDir}`;
      scanCoords.style.opacity = '1';
    }, 500);
  }
}

// ==================== UPDATE TARGET LIST ====================
function updateTargetList(activeIndex) {
  const targetItems = document.querySelectorAll('.target-item');
  
  targetItems.forEach((item, index) => {
    item.classList.remove('active');
    
    const masterIndex = (activeIndex + index) % chessMasters.length;
    const master = chessMasters[masterIndex];
    
    const nameElement = item.querySelector('.target-name');
    const statusElement = item.querySelector('.target-status');
    
    if (nameElement) nameElement.textContent = master.city;
    
    if (statusElement) {
      if (index === 0) {
        item.classList.add('active');
        statusElement.textContent = 'ACTIF';
      } else {
        statusElement.textContent = 'EN ATTENTE';
      }
    }
    
    // Make clickable
    item.style.cursor = 'pointer';
    item.onclick = () => {
      console.log('🖱️ Click sur ville:', master.city);
      showMasterProfile(master);
    };
  });
}

// ==================== SHOW MASTER PROFILE ====================
window.showMasterProfile = function(master) {
  console.log('👤 Affichage du profil de:', master.name);
  
  const masterProfile = document.getElementById('masterProfile');
  const globalContainer = document.getElementById('globalContainer');
  const toggleBtn = document.getElementById('toggleView');
  
  if (!masterProfile) {
    console.error('❌ Element masterProfile non trouvé!');
    return;
  }
  
  // Switch to master profile view
  globalContainer.style.display = 'none';
  masterProfile.style.display = 'flex';
  toggleBtn.textContent = 'GLOBAL VIEW';
  
  // Update profile data
  const avatar = document.getElementById('profileAvatar');
  const name = document.getElementById('profileName');
  const title = document.getElementById('profileTitle');
  const location = document.getElementById('profileLocation');
  const elo = document.getElementById('profileElo');
  const year = document.getElementById('profileYear');
  const titles = document.getElementById('profileTitles');
  
  if (avatar) {
    avatar.style.backgroundImage = `url('${master.image}')`;
  }
  
  if (name) name.textContent = master.name;
  if (title) title.textContent = master.title;
  if (location) location.textContent = `${master.city}, ${master.city === 'WASHINGTON DC' ? 'USA' : master.city === 'HAVANA' ? 'CUBA' : master.city === 'PARIS' ? 'FRANCE' : master.city === 'RIGA' ? 'LATVIA' : master.city === 'OSLO' ? 'NORWAY' : 'RUSSIA'}`;
  if (elo) elo.textContent = master.elo;
  if (year) year.textContent = master.year;
  if (titles) titles.textContent = master.titles;
  
  // Create radar chart
  setTimeout(() => {
    createRadarChart(master.skills);
  }, 200);
  
  console.log('✅ Profil affiché avec succès');
};

// ==================== RADAR CHART ====================
let previousMapped = null;
let animationFrame = null;

function createRadarChart(skills) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) {
    console.error('❌ Canvas radarChart non trouvé');
    return;
  }

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = (Math.min(width, height) / 2) * 0.5;

  const categories = ['Opening', 'Middlegame', 'Endgame', 'Tactics', 'Strategy', 'Calculation'];
  const raw = [skills.opening, skills.middlegame, skills.endgame, skills.tactics, skills.strategy, skills.calculation];

  // Map 85-100 to 0-radius
  const mapValue = v => v < 85 ? 0 : ((v - 85) / 15) * radius;
  const newMapped = raw.map(mapValue);

  if (!previousMapped) previousMapped = [...newMapped];

  if (animationFrame) cancelAnimationFrame(animationFrame);

  const duration = 700;
  const startTime = performance.now();

  function animate() {
    const now = performance.now();
    const t = Math.min((now - startTime) / duration, 1);
    const eased = t * t * (3 - 2 * t);

    const current = previousMapped.map((oldVal, i) => 
      oldVal + (newMapped[i] - oldVal) * eased
    );

    drawRadar(ctx, centerX, centerY, radius, categories, raw, current);

    if (t < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      previousMapped = [...newMapped];
    }
  }

  animate();
}

function drawRadar(ctx, centerX, centerY, radius, categories, rawValues, mappedValues) {
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);

  // Grid circles
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
  ctx.lineWidth = 1;

  for (let i = 1; i <= 5; i++) {
    const r = (radius / 5) * i;
    ctx.beginPath();
    for (let j = 0; j <= 6; j++) {
      const angle = (Math.PI * 2 * j) / 6 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Radial lines
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.stroke();
  }

  // Data area
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const value = mappedValues[i];
    const x = centerX + Math.cos(angle) * value;
    const y = centerY + Math.sin(angle) * value;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(0,255,255,0.5)');
  gradient.addColorStop(1, 'rgba(0,255,255,0.1)');
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#00ffff';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Data points
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const v = mappedValues[i];
    const x = centerX + Math.cos(angle) * v;
    const y = centerY + Math.sin(angle) * v;

    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffff';
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Labels
  ctx.font = 'bold 10px Rajdhani';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const labelRadius = radius + 40;
    const x = centerX + Math.cos(angle) * labelRadius;
    const y = centerY + Math.sin(angle) * labelRadius;

    ctx.fillStyle = '#00ffff';
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#00ffff';
    ctx.fillText(categories[i], x, y - 10);

    ctx.font = 'bold 14px Orbitron';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(rawValues[i], x, y + 8);
    ctx.font = 'bold 10px Rajdhani';
  }

  ctx.shadowBlur = 0;
}

// ==================== INITIALIZATION ====================
console.log('🗺️ MapLibre initialisé avec', chessMasters.length, 'grands maîtres');
console.log('🎯 Scanner automatique activé');

// Show first master profile after delay
setTimeout(() => {
  console.log('🎬 Affichage du premier grand maître...');
  showMasterProfile(chessMasters[0]);
}, 2000);