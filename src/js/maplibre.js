import maplibregl from 'maplibre-gl';

// Liste des grands maîtres avec leurs villes
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

// Précharger les images
console.log('🖼️ Préchargement des images...');
chessMasters.forEach(master => {
    const img = new Image();
    img.onload = () => console.log('✅', master.name);
    img.onerror = () => console.error('❌', master.image);
    img.src = master.image;
});

// Création de la map 3D
const carte = new maplibregl.Map({
    container: 'carte',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
    center: [37.6173, 55.7558],
    zoom: 16,
    pitch: 75,
    bearing: 0,
    antialias: true
});

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
            'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'render_height'], 0, '#0080ff', 50, '#00aaff', 100, '#00ffff'],
            'fill-extrusion-height': ['get', 'render_height'],
            'fill-extrusion-base': ['get', 'render_min_height'],
            'fill-extrusion-opacity': 0.8
        }
    }, labelLayerId);

    startCityScan();
});

// Scanner marker
const scannerDiv = document.createElement("div");
scannerDiv.className = "scanner-dot";
scannerDiv.innerHTML = `<div class="pulse1"></div><div class="pulse2"></div>`;
scannerDiv.style.cursor = 'pointer';
const scannerMarker = new maplibregl.Marker({ element: scannerDiv }).setLngLat([37.6173, 55.7558]).addTo(carte);

// Click sur le scanner
scannerDiv.addEventListener('click', (e) => {
    e.stopPropagation();
    console.log('🖱️ Click sur scanner - Index:', currentMasterIndex);
    showMasterProfile(chessMasters[currentMasterIndex]);
});

// Ligne de scan
const scanLine = document.createElement("div");
scanLine.className = "scan-line";
document.body.appendChild(scanLine);

function startCityScan() {
    scanNextCity();
    setInterval(scanNextCity, 6000);
}

function scanNextCity() {
    const master = chessMasters[currentMasterIndex];
    console.log('📍 Scan de:', master.city, '-', master.name);

    updateScanDisplay(master);
    updateTargetList(currentMasterIndex);

    // AFFICHER LE PROFIL AUTOMATIQUEMENT
    setTimeout(() => {
        showMasterProfile(master);
    }, 1500);

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

    scannerMarker.setLngLat([master.lng, master.lat]);

    setTimeout(() => {
        const point = carte.project([master.lng, master.lat]);
        scanLine.style.top = `${point.y}px`;
        scanLine.style.transition = 'top 0.8s ease';
        setTimeout(() => { scanLine.style.top = '0px'; }, 100);
        setTimeout(() => { scanLine.style.top = '100vh'; }, 1000);
    }, 1500);

    currentMasterIndex = (currentMasterIndex + 1) % chessMasters.length;
}

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
        
        // Rendre cliquable
        item.style.cursor = 'pointer';
        item.onclick = () => {
            console.log('🖱️ Click sur ville:', master.city);
            showMasterProfile(master);
        };
    });
}

// FONCTION PRINCIPALE - Afficher le profil
window.showMasterProfile = function(master) {
    console.log('👤 Affichage du profil de:', master.name);
    
    const profile = document.getElementById('masterProfile');
    const avatar = document.getElementById('profileAvatar');
    const name = document.getElementById('profileName');
    const title = document.getElementById('profileTitle');
    const location = document.getElementById('profileLocation');
    const elo = document.getElementById('profileElo');
    const year = document.getElementById('profileYear');
    const titles = document.getElementById('profileTitles');
    
    if (!profile) {
        console.error('❌ Element masterProfile non trouvé!');
        return;
    }
    
    console.log('📸 Chargement image:', master.image);
    
    // Mettre l'image
    if (avatar) {
        avatar.style.backgroundImage = `url('${master.image}')`;
        console.log('✅ Image définie dans avatar');
    }
    
    // Remplir les infos
    if (name) name.textContent = master.name;
    if (title) title.textContent = master.title;
    if (location) location.textContent = master.city;
    if (elo) elo.textContent = master.elo;
    if (year) year.textContent = master.year;
    if (titles) titles.textContent = master.titles;
    
    // Afficher le profil et cacher les autres sections
    profile.style.display = 'flex';
    profile.classList.add('visible');
    console.log('✅ Profil affiché');
    
    // Créer le radar
    setTimeout(() => {
        console.log('📊 Création du graphique radar');
        createRadarChart(master.skills);
    }, 200);
};

// Bouton fermer
setTimeout(() => {
    const closeBtn = document.getElementById('profileClose');
    if (closeBtn) {
        closeBtn.onclick = () => {
            console.log('❌ Fermeture du profil');
            const profile = document.getElementById('masterProfile');
            if (profile) {
                profile.style.display = 'none';
                profile.classList.remove('visible');
            }
        };
        console.log('✅ Bouton fermer configuré');
    }
}, 1000);

let previousMapped = null; // Pour stocker la forme précédente
let animationFrame = null;

// Graphique radar animé
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

    // Mapping 85 → 0, 100 → radius
    const mapValue = v => v < 85 ? 0 : ((v - 85) / 15) * radius;

    const newMapped = raw.map(mapValue);

    // Si première fois → pas d’anim
    if (!previousMapped) previousMapped = [...newMapped];

    // Annuler une ancienne animation
    if (animationFrame) cancelAnimationFrame(animationFrame);

    // Animation
    const duration = 700; // ms
    const startTime = performance.now();

    function animate() {
        const now = performance.now();
        const t = Math.min((now - startTime) / duration, 1);

        // Easing pour plus de style
        const eased = t * t * (3 - 2 * t);

        // Interpolation entre ancien et nouveau
        const current = previousMapped.map((oldVal, i) => 
            oldVal + (newMapped[i] - oldVal) * eased
        );

        drawRadar(ctx, centerX, centerY, radius, categories, raw, current);

        if (t < 1) {
            animationFrame = requestAnimationFrame(animate);
        } else {
            previousMapped = [...newMapped]; // On fixe la nouvelle forme
        }
    }

    animate();
}


// Fonction qui dessine réellement le radar (sans anim)
function drawRadar(ctx, centerX, centerY, radius, categories, rawValues, mappedValues) {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Fond
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, width, height);

    // Grille
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

    // Radiales
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
        ctx.stroke();
    }

    // Zone animée
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

    // Points
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
        const v = mappedValues[i];
        const x = centerX + Math.cos(angle) * v;
        const y = centerY + Math.sin(angle) * v;

        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#00ffff';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
    }

    // Labels
    ctx.font = 'bold 9px Orbitron';
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
        ctx.font = 'bold 12px Orbitron';
    }

    ctx.shadowBlur = 0;
}



console.log('🗺️ MapLibre initialisé avec', chessMasters.length, 'grands maîtres');
console.log('💡 Le profil s\'affiche automatiquement à chaque changement de ville!');

// Afficher le premier profil au démarrage
setTimeout(() => {
    console.log('🎬 Affichage du premier grand maître...');
    showMasterProfile(chessMasters[0]);
}, 2000);