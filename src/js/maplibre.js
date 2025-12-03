import maplibregl from 'maplibre-gl';

// Création de la map 3D
const carte = new maplibregl.Map({
    container: 'carte',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
    center: [-73.8462195, 45.6125882], // Laval
    zoom: 18,
    pitch: 75,
    bearing: 0,
    antialias: true
});

carte.on('load', () => {
    // Ajouter bâtiments 3D avec effet futuriste
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

    startCityScan();
});

// Liste des villes célèbres pour les échecs
const chessCities = [
    { name: 'MOSCOW', lng: 37.6173, lat: 55.7558 },
    { name: 'NEW DELHI', lng: 77.2090, lat: 28.6139 },
    { name: 'WASHINGTON DC', lng: -77.0369, lat: 38.9072 },
    { name: 'BEIJING', lng: 116.4074, lat: 39.9042 },
    { name: 'OSLO', lng: 10.7522, lat: 59.9139 },
    { name: 'YEREVAN', lng: 44.5152, lat: 40.1872 },
    { name: 'BAKU', lng: 49.8671, lat: 40.4093 },
    { name: 'KIEV', lng: 30.5234, lat: 50.4501 },
    { name: 'BUDAPEST', lng: 19.0402, lat: 47.4979 },
    { name: 'PARIS', lng: 2.3522, lat: 48.8566 },
    { name: 'BERLIN', lng: 13.4050, lat: 52.5200 },
    { name: 'AMSTERDAM', lng: 4.9041, lat: 52.3676 },
    { name: 'HAVANA', lng: -82.3666, lat: 23.1136 },
    { name: 'TEL AVIV', lng: 34.7818, lat: 32.0853 },
    { name: 'TEHRAN', lng: 51.3890, lat: 35.6892 }
];

let currentCity = 0;

// Marqueur scanner amélioré
const scannerDiv = document.createElement("div");
scannerDiv.className = "scanner-dot";
scannerDiv.innerHTML = `<div class="pulse1"></div><div class="pulse2"></div>`;
const scannerMarker = new maplibregl.Marker({ element: scannerDiv }).setLngLat([0,0]).addTo(carte);

// Ligne de scan
const scanLine = document.createElement("div");
scanLine.className = "scan-line";
document.body.appendChild(scanLine);

// Animation scan améliorée
function startCityScan() {
    scanNextCity();
    setInterval(scanNextCity, 13000);
}

function scanNextCity() {
    const city = chessCities[currentCity];

    // Mise à jour de l'interface
    updateScanDisplay(city);
    updateTargetList(currentCity);

    // Arrêter la rotation pendant le scan
    autoRotate = false;

    // Animation directe vers la ville sans dézoom
    setTimeout(() => {
        carte.flyTo({
            center: [city.lng, city.lat],
            zoom: 16 + Math.random() * 1,
            pitch: 70 + Math.random() * 5,
            bearing: Math.random() * 360,
            duration: 10000,
            essential: true
        });
    }, 100);

    scannerMarker.setLngLat([city.lng, city.lat]);

    // Animation de la ligne de scan
    setTimeout(() => {
        const point = carte.project([city.lng, city.lat]);
        scanLine.style.top = `${point.y}px`;
        scanLine.style.transition = 'top 0.8s ease';
        
        // Effet de scan qui traverse l'écran
        setTimeout(() => {
            scanLine.style.top = '0px';
        }, 100);
        
        setTimeout(() => {
            scanLine.style.top = '100vh';
        }, 1000);
    }, 1500);

    currentCity = (currentCity + 1) % chessCities.length;
}

// Mise à jour du display de scan
function updateScanDisplay(city) {
    const scanTarget = document.getElementById('scanTarget');
    const scanCoords = document.getElementById('scanCoords');
    
    if (scanTarget) {
        scanTarget.style.opacity = '0';
        scanTarget.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            scanTarget.textContent = city.name;
            scanTarget.style.transition = 'all 0.5s ease';
            scanTarget.style.opacity = '1';
            scanTarget.style.transform = 'scale(1)';
        }, 300);
    }
    
    if (scanCoords) {
        scanCoords.style.opacity = '0';
        
        setTimeout(() => {
            const lat = city.lat.toFixed(4);
            const lng = city.lng.toFixed(4);
            const latDir = city.lat >= 0 ? 'N' : 'S';
            const lngDir = city.lng >= 0 ? 'E' : 'W';
            scanCoords.textContent = `${Math.abs(lat)}°${latDir}, ${Math.abs(lng)}°${lngDir}`;
            scanCoords.style.transition = 'opacity 0.5s ease';
            scanCoords.style.opacity = '1';
        }, 500);
    }
}

// Mise à jour de la liste des cibles
function updateTargetList(activeIndex) {
    const targetItems = document.querySelectorAll('.target-item');
    targetItems.forEach((item, index) => {
        item.classList.remove('active');
        
        // Afficher les 4 prochaines villes
        const cityIndex = (activeIndex + index) % chessCities.length;
        const city = chessCities[cityIndex];
        
        const nameElement = item.querySelector('.target-name');
        const statusElement = item.querySelector('.target-status');
        
        if (nameElement) {
            nameElement.textContent = city.name;
        }
        
        if (statusElement) {
            if (index === 0) {
                item.classList.add('active');
                statusElement.textContent = 'ACTIF';
            } else {
                statusElement.textContent = 'EN ATTENTE';
            }
        }
    });
}

// Rotation automatique de la carte
let autoRotate = false; // Désactivé par défaut pour ne pas interférer avec flyTo
let rotationSpeed = 0.1;

function rotateCamera() {
    if (autoRotate) {
        const bearing = carte.getBearing();
        carte.setBearing(bearing + rotationSpeed);
    }
}

setInterval(rotateCamera, 50);

// Désactiver la rotation quand l'utilisateur interagit
carte.on('mousedown', () => {
    autoRotate = false;
});

carte.on('touchstart', () => {
    autoRotate = false;
});

// Réactiver après 5 secondes d'inactivité
let inactivityTimer;
carte.on('mouseup', () => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
        autoRotate = true;
    }, 5000);
});

console.log('🗺️ Carte tactique initialisée');