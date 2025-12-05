/**
 * NEXUS CHESS - MapLibre GL Integration
 * Carte 3D avec scanner de villes et profils des maîtres d'échecs
 */

import maplibregl from 'https://esm.sh/maplibre-gl@5.0.0';

console.log('🗺️ NEXUS CHESS - Initialisation MapLibre...');

// ==================== DONNÉES DES GRANDS MAÎTRES ====================
const grandMasters = [
  { 
    name: 'MOSCOW', 
    lng: 37.6173, 
    lat: 55.7558,
    image: 'assets/img/garry-kasparov.png',
    master: 'GARRY KASPAROV',
    title: 'World Champion 1985-2000',
    country: 'RUSSIA',
    elo: 2851,
    year: 1999,
    titles: 15,
    skills: { opening: 98, middlegame: 99, endgame: 95, tactics: 100, strategy: 98, calculation: 99 }
  },
  { 
    name: 'WASHINGTON DC', 
    lng: -77.0369, 
    lat: 38.9072,
    image: 'assets/img/Bobby-Fischer.png',
    master: 'BOBBY FISCHER',
    title: 'Legendary Champion 1972-1975',
    country: 'USA',
    elo: 2785,
    year: 1972,
    titles: 12,
    skills: { opening: 95, middlegame: 98, endgame: 99, tactics: 100, strategy: 96, calculation: 98 }
  },
  { 
    name: 'OSLO', 
    lng: 10.7522, 
    lat: 59.9139,
    image: 'assets/img/magnus-carlsen.jpg',
    master: 'MAGNUS CARLSEN',
    title: 'Current World Champion',
    country: 'NORWAY',
    elo: 2882,
    year: 2024,
    titles: 21,
    skills: { opening: 97, middlegame: 99, endgame: 100, tactics: 98, strategy: 99, calculation: 97 }
  },
  { 
    name: 'PARIS', 
    lng: 2.3522, 
    lat: 48.8566,
    image: 'assets/img/Alexander-Alekhine.png',
    master: 'ALEXANDER ALEKHINE',
    title: 'Attacking Genius 1927-1946',
    country: 'FRANCE',
    elo: 2690,
    year: 1927,
    titles: 10,
    skills: { opening: 93, middlegame: 98, endgame: 94, tactics: 99, strategy: 95, calculation: 98 }
  }
];

let currentCityIndex = 0;
let map = null;

// ==================== INITIALISATION DE LA CARTE ====================
function initMap() {
  map = new maplibregl.Map({
    container: 'carte',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
    center: [grandMasters[0].lng, grandMasters[0].lat],
    zoom: 15,
    pitch: 60,
    bearing: -20,
    antialias: true,
    attributionControl: false
  });

  console.log('✅ Carte MapLibre créée');

  map.on('load', () => {
    console.log('📦 Carte chargée, ajout des bâtiments 3D...');
    add3DBuildings();
    setupMarkers();
    startCityScanner();
  });
}

// ==================== BÂTIMENTS 3D ====================
function add3DBuildings() {
  const layers = map.getStyle().layers;
  let labelLayerId;
  
  for (const layer of layers) {
    if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
      labelLayerId = layer.id;
      break;
    }
  }

  // Ajouter les bâtiments avec un dégradé de couleur cyan
  map.addLayer({
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
        0, '#003344',
        30, '#005566',
        60, '#007788',
        100, '#00aacc',
        150, '#00f0ff'
      ],
      'fill-extrusion-height': ['get', 'render_height'],
      'fill-extrusion-base': ['get', 'render_min_height'],
      'fill-extrusion-opacity': 0.85
    }
  }, labelLayerId);

  console.log('✅ Bâtiments 3D ajoutés');
}

// ==================== MARKERS ====================
let scannerMarker = null;
let redEyeMarker = null;

function setupMarkers() {
  // Scanner Cyan
  const scannerDiv = document.createElement('div');
  scannerDiv.className = 'scanner-dot';
  scannerDiv.innerHTML = `
    <div class="scanner-pulse"></div>
    <div class="scanner-pulse delayed"></div>
    <div class="scanner-core"></div>
  `;
  
  scannerMarker = new maplibregl.Marker({ element: scannerDiv })
    .setLngLat([grandMasters[0].lng, grandMasters[0].lat])
    .addTo(map);

  scannerDiv.addEventListener('click', () => {
    showMasterProfile(grandMasters[currentCityIndex]);
  });

  // Œil Rouge
  const redEyeDiv = document.createElement('div');
  redEyeDiv.className = 'red-eye-scanner';
  redEyeDiv.innerHTML = `
    <div class="eye-outer"></div>
    <div class="eye-middle">
      <div class="eye-inner">
        <div class="eye-pupil"></div>
      </div>
    </div>
    <div class="eye-beam"></div>
  `;
  
  redEyeMarker = new maplibregl.Marker({ 
    element: redEyeDiv,
    anchor: 'center'
  })
    .setLngLat([grandMasters[0].lng, grandMasters[0].lat])
    .addTo(map);

  // Animation de la pupille
  let eyeAngle = 0;
  setInterval(() => {
    eyeAngle += 0.08;
    const pupil = redEyeDiv.querySelector('.eye-pupil');
    if (pupil) {
      const moveX = Math.cos(eyeAngle) * 4;
      const moveY = Math.sin(eyeAngle * 0.7) * 4;
      pupil.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
    }
  }, 50);

  console.log('✅ Markers créés');
}

// ==================== SCANNER DE VILLES ====================
function startCityScanner() {
  console.log('🎬 Démarrage du scanner automatique');
  scanNextCity();
  setInterval(scanNextCity, 8000);
}

function scanNextCity() {
  const city = grandMasters[currentCityIndex];
  console.log('🔍 Scan de:', city.name);

  // Activer la ligne de scan
  const scanLine = document.querySelector('.scan-line');
  if (scanLine) {
    scanLine.classList.add('active');
    setTimeout(() => scanLine.classList.remove('active'), 2000);
  }

  // Mettre à jour l'affichage
  updateScanDisplay(city);
  updateTargetList(currentCityIndex);

  // Vol vers la ville
  setTimeout(() => {
    map.flyTo({
      center: [city.lng, city.lat],
      zoom: 15 + Math.random() * 2,
      pitch: 55 + Math.random() * 20,
      bearing: Math.random() * 360,
      duration: 3000,
      essential: true
    });
  }, 200);

  // Déplacer les markers
  if (scannerMarker) scannerMarker.setLngLat([city.lng, city.lat]);
  if (redEyeMarker) redEyeMarker.setLngLat([city.lng, city.lat]);

  // Afficher le profil après le scan
  setTimeout(() => {
    showMasterProfile(city);
  }, 2500);

  // Ville suivante
  currentCityIndex = (currentCityIndex + 1) % grandMasters.length;
}

// ==================== MISE À JOUR DE L'AFFICHAGE ====================
function updateScanDisplay(city) {
  const scanTarget = document.getElementById('scanTarget');
  const scanCoords = document.getElementById('scanCoords');
  
  if (scanTarget) {
    scanTarget.style.opacity = '0';
    scanTarget.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      scanTarget.textContent = city.name;
      scanTarget.style.opacity = '1';
      scanTarget.style.transform = 'translateY(0)';
    }, 300);
  }
  
  if (scanCoords) {
    scanCoords.style.opacity = '0';
    setTimeout(() => {
      const lat = Math.abs(city.lat).toFixed(4);
      const lng = Math.abs(city.lng).toFixed(4);
      const latDir = city.lat >= 0 ? 'N' : 'S';
      const lngDir = city.lng >= 0 ? 'E' : 'W';
      scanCoords.textContent = `${lat}°${latDir}, ${lng}°${lngDir}`;
      scanCoords.style.opacity = '1';
    }, 500);
  }
}

function updateTargetList(activeIndex) {
  const targetItems = document.querySelectorAll('.target-item');
  
  targetItems.forEach((item, index) => {
    item.classList.remove('active');
    
    const cityIndex = (activeIndex + index) % grandMasters.length;
    const city = grandMasters[cityIndex];
    
    const nameElement = item.querySelector('.target-name');
    const masterElement = item.querySelector('.target-master');
    const statusElement = item.querySelector('.target-status');
    
    if (nameElement) nameElement.textContent = city.name;
    if (masterElement) masterElement.textContent = city.master;
    
    if (statusElement) {
      if (index === 0) {
        item.classList.add('active');
        statusElement.textContent = 'ACTIF';
      } else {
        statusElement.textContent = 'EN ATTENTE';
      }
    }
    
    // Click handler
    item.onclick = () => {
      currentCityIndex = cityIndex;
      showMasterProfile(city);
      
      map.flyTo({
        center: [city.lng, city.lat],
        zoom: 16,
        pitch: 65,
        bearing: Math.random() * 360,
        duration: 2000
      });
      
      if (scannerMarker) scannerMarker.setLngLat([city.lng, city.lat]);
      if (redEyeMarker) redEyeMarker.setLngLat([city.lng, city.lat]);
      
      updateTargetList(cityIndex);
    };
  });
}

// ==================== AFFICHAGE DU PROFIL ====================
window.showMasterProfile = function(city) {
  console.log('👤 Affichage du profil:', city.master);
  
  const masterProfile = document.getElementById('masterProfile');
  const globalContainer = document.getElementById('globalContainer');
  const toggleBtn = document.getElementById('toggleView');
  
  if (!masterProfile || !globalContainer || !toggleBtn) {
    console.error('❌ Éléments du profil non trouvés');
    return;
  }
  
  // Switcher vers le profil
  globalContainer.style.display = 'none';
  masterProfile.style.display = 'flex';
  toggleBtn.innerHTML = '<span class="btn-icon"><i class="bi bi-globe"></i></span><span class="btn-text">VUE GLOBALE</span>';
  
  // Remplir les données avec animation
  setTimeout(() => {
    const avatar = document.getElementById('profileAvatar');
    const name = document.getElementById('profileName');
    const title = document.getElementById('profileTitle');
    const location = document.getElementById('profileLocation');
    const elo = document.getElementById('profileElo');
    const year = document.getElementById('profileYear');
    const titles = document.getElementById('profileTitles');
    
    if (avatar) avatar.style.backgroundImage = `url('${city.image}')`;
    if (name) name.textContent = city.master;
    if (title) title.textContent = city.title;
    if (location) location.textContent = `${city.name}, ${city.country}`;
    if (elo) animateNumber(elo, city.elo);
    if (year) animateNumber(year, city.year);
    if (titles) animateNumber(titles, city.titles);
    
    // Créer le radar chart
    setTimeout(() => createRadarChart(city.skills), 300);
  }, 100);
};

// Animation des nombres
function animateNumber(element, target) {
  const duration = 1000;
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    
    element.textContent = Math.floor(start + (target - start) * eased);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  
  requestAnimationFrame(update);
}

// ==================== TOGGLE VIEW ====================
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggleView');
  const masterProfile = document.getElementById('masterProfile');
  const globalContainer = document.getElementById('globalContainer');
  
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isProfileVisible = masterProfile.style.display !== 'none';
      
      if (isProfileVisible) {
        masterProfile.style.display = 'none';
        globalContainer.style.display = 'flex';
        toggleBtn.innerHTML = '<span class="btn-icon"><i class="bi bi-person-badge"></i></span><span class="btn-text">PROFIL MAÎTRE</span>';
      } else {
        showMasterProfile(grandMasters[currentCityIndex]);
      }
    });
  }
});

// ==================== GRAPHIQUE RADAR ====================
let previousMapped = null;
let animFrame = null;

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
  const radius = (Math.min(width, height) / 2) * 0.55;

  const categories = ['Opening', 'Middlegame', 'Endgame', 'Tactics', 'Strategy', 'Calculation'];
  const raw = [skills.opening, skills.middlegame, skills.endgame, skills.tactics, skills.strategy, skills.calculation];

  const mapValue = v => v < 80 ? 0 : ((v - 80) / 20) * radius;
  const newMapped = raw.map(mapValue);

  if (!previousMapped) previousMapped = new Array(6).fill(0);
  if (animFrame) cancelAnimationFrame(animFrame);

  const duration = 800;
  const startTime = performance.now();
  const startMapped = [...previousMapped];

  function animate() {
    const now = performance.now();
    const t = Math.min((now - startTime) / duration, 1);
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const current = startMapped.map((oldVal, i) => 
      oldVal + (newMapped[i] - oldVal) * eased
    );

    drawRadar(ctx, centerX, centerY, radius, categories, raw, current);

    if (t < 1) {
      animFrame = requestAnimationFrame(animate);
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

  // Fond sombre
  ctx.fillStyle = 'rgba(3, 8, 16, 0.6)';
  ctx.fillRect(0, 0, width, height);

  // Grille hexagonale
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 1;

  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }

  // Lignes radiales
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.1)';
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
    ctx.stroke();
  }

  // Zone de données
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const value = mappedValues[i];
    const x = centerX + Math.cos(angle) * value;
    const y = centerY + Math.sin(angle) * value;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();

  // Gradient de remplissage
  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
  gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.2)');
  gradient.addColorStop(1, 'rgba(0, 240, 255, 0.05)');
  ctx.fillStyle = gradient;
  ctx.fill();

  // Contour
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 20;
  ctx.shadowColor = '#00f0ff';
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Points de données
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const v = mappedValues[i];
    const x = centerX + Math.cos(angle) * v;
    const y = centerY + Math.sin(angle) * v;

    // Cercle externe
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 240, 255, 0.3)';
    ctx.fill();

    // Point central
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#00f0ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f0ff';
    ctx.fill();
    ctx.shadowBlur = 0;

    // Point blanc central
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Labels
  ctx.font = 'bold 10px Rajdhani, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
    const labelRadius = radius + 35;
    const x = centerX + Math.cos(angle) * labelRadius;
    const y = centerY + Math.sin(angle) * labelRadius;

    // Nom de la catégorie
    ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.fillText(categories[i].toUpperCase(), x, y - 8);

    // Valeur
    ctx.font = 'bold 14px Orbitron, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00f0ff';
    ctx.fillText(rawValues[i].toString(), x, y + 10);
    ctx.shadowBlur = 0;
    ctx.font = 'bold 10px Rajdhani, sans-serif';
  }
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initMap, 100);
});

console.log('✅ MapLibre module chargé');
