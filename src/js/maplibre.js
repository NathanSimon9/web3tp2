

console.log('🗺️ Initialisation de MapLibre...');

// ==================== DONNÉES DES GRANDS MAÎTRES ====================
const chessMasters = [
  { 
    name: 'GARRY KASPAROV', 
    city: 'MOSCOW', 
    country: 'RUSSIA',
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
    city: 'NEW YORK', 
    country: 'USA',
    lng: -74.0060, 
    lat: 40.7128,
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
    country: 'NORWAY',
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
    name: 'JOSÉ CAPABLANCA', 
    city: 'HAVANA', 
    country: 'CUBA',
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
    country: 'RUSSIA',
    lng: 37.62, 
    lat: 55.76,
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
    country: 'FRANCE',
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
    country: 'LATVIA',
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
    country: 'RUSSIA',
    lng: 37.615, 
    lat: 55.752,
    image: 'assets/img/Vladimir-Kramnik.png',
    title: 'Solid Champion',
    elo: 2817,
    year: 2016,
    titles: 14,
    skills: { opening: 98, middlegame: 96, endgame: 98, tactics: 95, strategy: 99, calculation: 96 }
  }
];

let currentMasterIndex = 0;
let carte = null;
let scannerMarker = null;

// ==================== CRÉATION DE LA CARTE ====================
function initMap() {
  carte = new maplibregl.Map({
    container: 'carte',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
    center: [chessMasters[0].lng, chessMasters[0].lat],
    zoom: 12,
    pitch: 60,
    bearing: 0,
    antialias: true
  });

  carte.on('load', () => {
    console.log('✅ Carte MapLibre chargée');
    
    // Ajouter les bâtiments 3D
    addBuildings();
    
    // Créer le marqueur scanner
    createScannerMarker();
    
    // Créer la liste des cibles
    populateTargetList();
    
    // Démarrer le scan automatique
    startAutoScan();
  });

  // Contrôles de navigation
  carte.addControl(new maplibregl.NavigationControl(), 'bottom-right');
}

// ==================== BÂTIMENTS 3D ====================
function addBuildings() {
  const layers = carte.getStyle().layers;
  let labelLayerId;
  
  for (const layer of layers) {
    if (layer.type === 'symbol' && layer.layout && layer.layout['text-field']) {
      labelLayerId = layer.id;
      break;
    }
  }

  try {
    carte.addLayer({
      id: '3d-buildings',
      source: 'openmaptiles',
      'source-layer': 'building',
      filter: ['!', ['has', 'hide_3d']],
      type: 'fill-extrusion',
      minzoom: 12,
      paint: {
        'fill-extrusion-color': [
          'interpolate',
          ['linear'],
          ['get', 'render_height'],
          0, '#0066ff',
          50, '#0099ff',
          100, '#00ccff',
          200, '#00ffff'
        ],
        'fill-extrusion-height': ['get', 'render_height'],
        'fill-extrusion-base': ['get', 'render_min_height'],
        'fill-extrusion-opacity': 0.7
      }
    }, labelLayerId);
    console.log('✅ Bâtiments 3D ajoutés');
  } catch (e) {
    console.warn('⚠️ Impossible d\'ajouter les bâtiments 3D');
  }
}

// ==================== MARQUEUR SCANNER ====================
function createScannerMarker() {
  const el = document.createElement('div');
  el.className = 'scanner-marker';
  el.innerHTML = `
    <div class="scanner-core"></div>
    <div class="scanner-ring ring-1"></div>
    <div class="scanner-ring ring-2"></div>
    <div class="scanner-ring ring-3"></div>
  `;
  
  // Styles du marqueur
  const style = document.createElement('style');
  style.textContent = `
    .scanner-marker {
      width: 60px;
      height: 60px;
      position: relative;
      cursor: pointer;
    }
    .scanner-core {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 16px;
      height: 16px;
      background: #00ffff;
      border-radius: 50%;
      box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
      animation: core-pulse 2s ease-in-out infinite;
    }
    .scanner-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 2px solid #00ffff;
      border-radius: 50%;
      animation: ring-expand 2s ease-out infinite;
    }
    .ring-1 { width: 20px; height: 20px; animation-delay: 0s; }
    .ring-2 { width: 20px; height: 20px; animation-delay: 0.5s; }
    .ring-3 { width: 20px; height: 20px; animation-delay: 1s; }
    
    @keyframes core-pulse {
      0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
    }
    @keyframes ring-expand {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(-50%, -50%) scale(3); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  scannerMarker = new maplibregl.Marker({ element: el })
    .setLngLat([chessMasters[0].lng, chessMasters[0].lat])
    .addTo(carte);
  
  el.addEventListener('click', () => {
    showMasterProfile(chessMasters[currentMasterIndex]);
  });
}

// ==================== LISTE DES CIBLES ====================
function populateTargetList() {
  const targetList = document.getElementById('targetList');
  if (!targetList) return;
  
  targetList.innerHTML = '';
  
  chessMasters.slice(0, 5).forEach((master, index) => {
    const item = document.createElement('div');
    item.className = `target-item ${index === 0 ? 'active' : ''}`;
    item.innerHTML = `
      <span class="target-dot"></span>
      <span class="target-name">${master.city}</span>
      <span class="target-status">${index === 0 ? 'ACTIF' : 'STANDBY'}</span>
    `;
    item.addEventListener('click', () => {
      goToMaster(index);
    });
    targetList.appendChild(item);
  });
}

// ==================== NAVIGATION VERS UN MAÎTRE ====================
function goToMaster(index) {
  currentMasterIndex = index;
  const master = chessMasters[index];
  
  // Animation de vol
  carte.flyTo({
    center: [master.lng, master.lat],
    zoom: 14,
    pitch: 65,
    bearing: Math.random() * 60 - 30,
    duration: 2500,
    essential: true
  });
  
  // Déplacer le marqueur
  scannerMarker.setLngLat([master.lng, master.lat]);
  
  // Mettre à jour l'affichage
  updateScanDisplay(master);
  updateTargetList(index);
  
  // Afficher le profil
  setTimeout(() => {
    showMasterProfile(master);
  }, 1000);
  
  // Jouer un son
  if (window.playUISound) {
    window.playUISound('scan');
  }
}

// ==================== MISE À JOUR AFFICHAGE SCAN ====================
function updateScanDisplay(master) {
  const scanTarget = document.getElementById('scanTarget');
  const scanCoords = document.getElementById('scanCoords');
  
  if (scanTarget) {
    scanTarget.style.opacity = '0';
    setTimeout(() => {
      scanTarget.textContent = master.city;
      scanTarget.style.opacity = '1';
    }, 200);
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
    }, 300);
  }
}

// ==================== MISE À JOUR LISTE CIBLES ====================
function updateTargetList(activeIndex) {
  const items = document.querySelectorAll('.target-item');
  items.forEach((item, index) => {
    item.classList.remove('active');
    const status = item.querySelector('.target-status');
    if (index === activeIndex) {
      item.classList.add('active');
      if (status) status.textContent = 'ACTIF';
    } else {
      if (status) status.textContent = 'STANDBY';
    }
  });
}

// ==================== AFFICHER PROFIL MAÎTRE ====================
function showMasterProfile(master) {
  // Basculer vers la vue Master
  if (window.switchToMasterView) {
    window.switchToMasterView();
  }
  
  // Mettre à jour les informations
  const avatar = document.getElementById('profileAvatar');
  const name = document.getElementById('profileName');
  const title = document.getElementById('profileTitle');
  const location = document.getElementById('profileLocation');
  const elo = document.getElementById('profileElo');
  const year = document.getElementById('profileYear');
  const titles = document.getElementById('profileTitles');
  
  if (avatar) avatar.style.backgroundImage = `url('${master.image}')`;
  if (name) name.textContent = master.name;
  if (title) title.textContent = master.title;
  if (location) location.textContent = `${master.city}, ${master.country}`;
  if (elo) elo.textContent = master.elo;
  if (year) year.textContent = master.year;
  if (titles) titles.textContent = master.titles;
  
  // Mettre à jour le graphique radar
  if (window.updateRadarChart) {
    window.updateRadarChart(master.skills);
  }
  
  console.log('👤 Profil affiché:', master.name);
}

// ==================== SCAN AUTOMATIQUE ====================
function startAutoScan() {
  setInterval(() => {
    currentMasterIndex = (currentMasterIndex + 1) % chessMasters.length;
    goToMaster(currentMasterIndex);
  }, 10000);
  
  // Premier scan après délai
  setTimeout(() => {
    goToMaster(0);
  }, 2000);
}

// ==================== INITIALISATION ====================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initMap, 300);
});

// Export pour utilisation externe
window.goToMaster = goToMaster;
window.chessMasters = chessMasters;
