import maplibregl from 'maplibre-gl';

// Création de la map 3D
const carte = new maplibregl.Map({
    container: 'carte',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',
    center: [-73.8462195, 45.6125882], // Laval
    zoom: 3,
    pitch: 60,
    bearing: 0,
    antialias: true
});

carte.on('load', () => {
    // Ajouter bâtiments 3D
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
            'fill-extrusion-color': '#0ff',
            'fill-extrusion-height': ['get', 'render_height'],
            'fill-extrusion-base': ['get', 'render_min_height'],
            'fill-extrusion-opacity': 0.7
        }
    }, labelLayerId);

    startCityScan();
});

// Liste des villes réputées pour les échecs
const chessCities = [
    { name: 'Moscou', lng: 37.6173, lat: 55.7558 },
    { name: 'New Delhi', lng: 77.2090, lat: 28.6139 },
    { name: 'Washington DC', lng: -77.0369, lat: 38.9072 },
    { name: 'Beijing', lng: 116.4074, lat: 39.9042 },
    { name: 'Oslo', lng: 10.7522, lat: 59.9139 },
    { name: 'Yerevan', lng: 44.5152, lat: 40.1872 },
    { name: 'Baku', lng: 49.8671, lat: 40.4093 },
    { name: 'Kiev', lng: 30.5234, lat: 50.4501 },
    { name: 'Budapest', lng: 19.0402, lat: 47.4979 },
    { name: 'Paris', lng: 2.3522, lat: 48.8566 },
    { name: 'Berlin', lng: 13.4050, lat: 52.5200 },
    { name: 'Amsterdam', lng: 4.9041, lat: 52.3676 },
    { name: 'La Havane', lng: -82.3666, lat: 23.1136 },
    { name: 'Tel Aviv', lng: 34.7818, lat: 32.0853 },
    { name: 'Téhéran', lng: 51.3890, lat: 35.6892 }
];

let currentCity = 0;

// Marqueur scanner
const scannerDiv = document.createElement("div");
scannerDiv.className = "scanner-dot";
scannerDiv.innerHTML = `<div class="pulse1"></div><div class="pulse2"></div>`;
const scannerMarker = new maplibregl.Marker({ element: scannerDiv }).setLngLat([0,0]).addTo(carte);

// Ligne et label
const scanLine = document.createElement("div"); scanLine.className = "scan-line"; document.body.appendChild(scanLine);
const cityLabel = document.createElement("div");
cityLabel.style.cssText = `
  position: fixed;
  background: rgba(255,0,0,0.9);
  color: #0ff;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: bold;
  z-index: 6;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s;
  font-family: 'Barrio', cursive;
  text-transform: uppercase;
  letter-spacing: 1px;
`;
document.body.appendChild(cityLabel);

// Animation scan ville par ville
function startCityScan() {
    scanNextCity();
    setInterval(scanNextCity, 4000);
}

function scanNextCity() {
    const city = chessCities[currentCity];

    carte.flyTo({
        center: [city.lng, city.lat],
        zoom: 12,
        pitch: 60,
        bearing: Math.random() * 360,
        duration: 2500,
        essential: true
    });

    scannerMarker.setLngLat([city.lng, city.lat]);

    setTimeout(() => {
        const point = carte.project([city.lng, city.lat]);
        scanLine.style.top = `${point.y}px`;
        cityLabel.innerHTML = `▸ SCANNING: ${city.name}`;
        cityLabel.style.left = `${point.x + 30}px`;
        cityLabel.style.top = `${point.y - 40}px`;
        cityLabel.style.opacity = 1;

        setTimeout(() => { cityLabel.style.opacity = 0; }, 2000);
    }, 1200);

    currentCity = (currentCity + 1) % chessCities.length;
}
