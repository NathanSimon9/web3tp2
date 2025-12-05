/**
 * NEXUS CHESS - Three.js 3D Chess Pieces Loader
 * Charge et affiche les pièces d'échecs 3D avec effets futuristes
 */

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OBJLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/loaders/MTLLoader.js';

console.log('🎮 NEXUS CHESS - Initialisation Three.js...');

// ==================== CONFIGURATION DES PIÈCES ====================
const pieces = [
  { 
    name: 'ROI', 
    containerId: 'piece-1', 
    objFile: 'roi.obj',
    mtlFile: 'roi.mtl',
    color: 0x00f0ff,
    emissive: 0x003344,
    scale: 0.035,
    yOffset: 0
  },
  { 
    name: 'REINE', 
    containerId: 'piece-2', 
    objFile: 'reine.obj',
    mtlFile: 'reine.mtl',
    color: 0xff69b4,
    emissive: 0x440022,
    scale: 0.035,
    yOffset: 0
  },
  { 
    name: 'FOU', 
    containerId: 'piece-3', 
    objFile: 'fou.obj',
    mtlFile: 'fou.mtl',
    color: 0x9370db,
    emissive: 0x220044,
    scale: 0.035,
    yOffset: 0
  },
  { 
    name: 'CHEVAL', 
    containerId: 'piece-4', 
    objFile: 'cheval.obj',
    mtlFile: 'cheval.mtl',
    color: 0x00ff9d,
    emissive: 0x004422,
    scale: 0.035,
    yOffset: 0
  },
  { 
    name: 'TOUR', 
    containerId: 'piece-5', 
    objFile: 'tour.obj',
    mtlFile: 'tour.mtl',
    color: 0xff6b35,
    emissive: 0x442200,
    scale: 0.035,
    yOffset: 0
  },
  { 
    name: 'PION', 
    containerId: 'piece-6', 
    objFile: 'pion.obj',
    mtlFile: 'pion.mtl',
    color: 0x3d9aff,
    emissive: 0x001144,
    scale: 0.035,
    yOffset: 0
  }
];

const pieceObjects = [];
const basePath = './assets/3d/';

// ==================== INITIALISATION ====================
window.addEventListener('DOMContentLoaded', () => {
  console.log('📦 Création des scènes 3D...');
  
  setTimeout(() => {
    pieces.forEach((piece, index) => {
      setTimeout(() => {
        createPieceScene(piece);
      }, index * 300);
    });
    
    setTimeout(() => {
      animate();
      console.log('✅ Animation démarrée');
    }, 2500);
  }, 800);
});

// ==================== TEXTURE DE FOND GRADIENT ====================
function createGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
  gradient.addColorStop(0, '#0a1628');
  gradient.addColorStop(0.5, '#061020');
  gradient.addColorStop(1, '#030810');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 512, 512);
  
  return new THREE.CanvasTexture(canvas);
}

// ==================== CRÉATION SCÈNE PIÈCE ====================
function createPieceScene(piece) {
  const container = document.getElementById(piece.containerId);
  
  if (!container) {
    console.error(`❌ Container ${piece.containerId} non trouvé`);
    return;
  }

  // Masquer le loading
  const loadingEl = container.querySelector('.viewer-loading');

  const width = container.clientWidth;
  const height = container.clientHeight;
  
  if (width === 0 || height === 0) {
    console.warn(`⚠️ Dimensions invalides pour ${piece.containerId}, retry...`);
    setTimeout(() => createPieceScene(piece), 500);
    return;
  }

  console.log(`📦 Création scène pour ${piece.name} (${width}x${height})`);

  // Scène
  const scene = new THREE.Scene();
  const bgTexture = createGradientTexture();
  scene.background = bgTexture;
  scene.fog = new THREE.FogExp2(0x030810, 0.08);

  // Caméra
  const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
  camera.position.set(0, 3, 7);
  camera.lookAt(0, 1, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;
  
  // Nettoyer le container et ajouter le canvas
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // ========== LUMIÈRES CINÉMATIQUES ==========
  // Lumière principale (clé)
  const keyLight = new THREE.DirectionalLight(piece.color, 2);
  keyLight.position.set(5, 8, 5);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.camera.near = 0.5;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.bias = -0.0001;
  scene.add(keyLight);

  // Lumière de remplissage
  const fillLight = new THREE.DirectionalLight(0x0066ff, 1);
  fillLight.position.set(-4, 4, -4);
  scene.add(fillLight);

  // Lumière de contour (rim light)
  const rimLight = new THREE.DirectionalLight(0xff6600, 1.5);
  rimLight.position.set(0, -3, -5);
  scene.add(rimLight);

  // Lumière ambiante
  const ambient = new THREE.AmbientLight(0x001530, 0.6);
  scene.add(ambient);

  // Point light pour l'effet de lueur
  const pointLight = new THREE.PointLight(piece.color, 1, 10);
  pointLight.position.set(0, 2, 2);
  scene.add(pointLight);

  // ========== PLATEFORME HOLOGRAPHIQUE ==========
  const platformGroup = new THREE.Group();
  
  // Disque principal
  const platformGeo = new THREE.CylinderGeometry(1.8, 1.8, 0.05, 64);
  const platformMat = new THREE.MeshStandardMaterial({
    color: piece.color,
    emissive: piece.color,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.4
  });
  const platform = new THREE.Mesh(platformGeo, platformMat);
  platform.position.y = -0.5;
  platform.receiveShadow = true;
  platformGroup.add(platform);

  // Anneaux concentriques
  for (let i = 0; i < 3; i++) {
    const ringGeo = new THREE.TorusGeometry(1.2 + i * 0.4, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: piece.color,
      transparent: true,
      opacity: 0.5 - i * 0.12
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.48 + i * 0.02;
    platformGroup.add(ring);
  }

  scene.add(platformGroup);

  // ========== PARTICULES AMBIANTES ==========
  const particlesGeo = new THREE.BufferGeometry();
  const particlesCount = 150;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  
  const color = new THREE.Color(piece.color);
  
  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 8;
    positions[i * 3 + 1] = Math.random() * 6 - 1;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    
    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }
  
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particlesMat = new THREE.PointsMaterial({
    size: 0.03,
    transparent: true,
    opacity: 0.6,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  const particles = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particles);

  // ========== GRILLE HOLOGRAPHIQUE AU SOL ==========
  const gridHelper = new THREE.GridHelper(6, 20, piece.color, piece.color);
  gridHelper.position.y = -0.5;
  gridHelper.material.opacity = 0.15;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // ========== CHARGER LE MODÈLE 3D ==========
  const pieceGroup = new THREE.Group();
  scene.add(pieceGroup);

  // Essayer de charger le modèle OBJ
  loadChessPiece(piece, pieceGroup, scene);

  // ========== DONNÉES D'ANIMATION ==========
  const speed = 0.003 + Math.random() * 0.002;
  const floatSpeed = 0.8 + Math.random() * 0.4;
  const floatAmplitude = 0.15 + Math.random() * 0.1;
  
  const pieceData = {
    group: pieceGroup,
    speed,
    floatSpeed,
    floatAmplitude,
    scene,
    camera,
    renderer,
    container,
    platformGroup,
    particles,
    pointLight,
    time: Math.random() * 100,
    name: piece.name,
    color: piece.color,
    baseY: 0.5
  };
  
  pieceObjects.push(pieceData);
  
  // Rendu initial
  renderer.render(scene, camera);
  console.log(`✅ ${piece.name} - Scène créée`);
}

// ==================== CHARGEMENT MODÈLE OBJ ====================
function loadChessPiece(piece, group, scene) {
  const mtlLoader = new MTLLoader();
  const objLoader = new OBJLoader();
  
  console.log(`🔄 Chargement de ${piece.name}...`);
  
  // Essayer de charger avec MTL d'abord
  mtlLoader.setPath(basePath);
  mtlLoader.load(
    piece.mtlFile,
    (materials) => {
      materials.preload();
      
      // Modifier les matériaux pour l'effet futuriste
      Object.values(materials.materials).forEach(mat => {
        mat.color = new THREE.Color(piece.color);
        mat.emissive = new THREE.Color(piece.emissive);
        mat.emissiveIntensity = 0.3;
        mat.metalness = 0.8;
        mat.roughness = 0.2;
      });
      
      objLoader.setMaterials(materials);
      objLoader.setPath(basePath);
      objLoader.load(
        piece.objFile,
        (object) => {
          setupLoadedModel(object, piece, group);
          console.log(`✅ ${piece.name} - Modèle OBJ chargé avec MTL`);
        },
        (xhr) => {
          const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
          console.log(`📊 ${piece.name}: ${percent}%`);
        },
        (error) => {
          console.warn(`⚠️ Erreur OBJ pour ${piece.name}, création d'une pièce procédurale`);
          createProceduralPiece(piece, group);
        }
      );
    },
    undefined,
    () => {
      // Si pas de MTL, charger juste l'OBJ
      console.log(`📦 Chargement OBJ sans MTL pour ${piece.name}`);
      objLoader.setPath(basePath);
      objLoader.load(
        piece.objFile,
        (object) => {
          // Appliquer un matériau personnalisé
          const material = new THREE.MeshStandardMaterial({
            color: piece.color,
            emissive: piece.emissive,
            emissiveIntensity: 0.3,
            metalness: 0.85,
            roughness: 0.15,
            envMapIntensity: 1
          });
          
          object.traverse((child) => {
            if (child.isMesh) {
              child.material = material;
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          setupLoadedModel(object, piece, group);
          console.log(`✅ ${piece.name} - Modèle OBJ chargé`);
        },
        undefined,
        (error) => {
          console.warn(`⚠️ Impossible de charger ${piece.name}, création procédurale`);
          createProceduralPiece(piece, group);
        }
      );
    }
  );
}

// ==================== CONFIGURATION DU MODÈLE CHARGÉ ====================
function setupLoadedModel(object, piece, group) {
  // Calculer la bounding box pour centrer et mettre à l'échelle
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  // Calculer l'échelle pour que la pièce fasse environ 2.5 unités de haut
  const targetHeight = 2.5;
  const scale = targetHeight / size.y;
  
  object.scale.set(scale, scale, scale);
  
  // Centrer l'objet
  object.position.x = -center.x * scale;
  object.position.z = -center.z * scale;
  object.position.y = -box.min.y * scale;
  
  // Appliquer le matériau futuriste à tous les meshes
  const material = new THREE.MeshStandardMaterial({
    color: piece.color,
    emissive: piece.emissive,
    emissiveIntensity: 0.25,
    metalness: 0.9,
    roughness: 0.1,
    envMapIntensity: 1.5
  });
  
  object.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  group.add(object);
}

// ==================== CRÉATION PIÈCE PROCÉDURALE ====================
function createProceduralPiece(piece, group) {
  console.log(`🔮 Création procédurale pour ${piece.name}`);
  
  const material = new THREE.MeshStandardMaterial({
    color: piece.color,
    emissive: piece.emissive,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1
  });
  
  let geometry;
  
  switch(piece.name) {
    case 'ROI':
      geometry = createKingGeometry();
      break;
    case 'REINE':
      geometry = createQueenGeometry();
      break;
    case 'FOU':
      geometry = createBishopGeometry();
      break;
    case 'CHEVAL':
      geometry = createKnightGeometry();
      break;
    case 'TOUR':
      geometry = createRookGeometry();
      break;
    case 'PION':
      geometry = createPawnGeometry();
      break;
    default:
      geometry = new THREE.BoxGeometry(1, 2, 1);
  }
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  group.add(mesh);
}

// ==================== GÉOMÉTRIES PROCÉDURALES ====================
function createKingGeometry() {
  const group = new THREE.Group();
  
  // Base
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.6, 0.7, 0.3, 32),
    new THREE.MeshStandardMaterial({ color: 0x00f0ff })
  );
  base.position.y = 0.15;
  group.add(base);
  
  // Corps
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.5, 1.4, 32),
    new THREE.MeshStandardMaterial({ color: 0x00f0ff })
  );
  body.position.y = 1;
  group.add(body);
  
  // Tête
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.4, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x00f0ff })
  );
  head.position.y = 1.9;
  group.add(head);
  
  // Croix
  const crossV = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.5, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  crossV.position.y = 2.4;
  group.add(crossV);
  
  const crossH = new THREE.Mesh(
    new THREE.BoxGeometry(0.3, 0.1, 0.1),
    new THREE.MeshStandardMaterial({ color: 0xffd700 })
  );
  crossH.position.y = 2.5;
  group.add(crossH);
  
  // Fusionner
  const mergedGeometry = new THREE.BufferGeometry();
  return createCylinderStack([0.7, 0.6, 0.5, 0.4, 0.35, 0.3, 0.35, 0.4], [0.3, 0.2, 0.3, 0.4, 0.5, 0.3, 0.2, 0.3]);
}

function createQueenGeometry() {
  return createCylinderStack([0.65, 0.55, 0.45, 0.35, 0.3, 0.35, 0.4, 0.3], [0.3, 0.2, 0.3, 0.5, 0.4, 0.2, 0.3, 0.2]);
}

function createBishopGeometry() {
  return createCylinderStack([0.55, 0.45, 0.35, 0.25, 0.3, 0.2, 0.15], [0.25, 0.2, 0.4, 0.5, 0.3, 0.3, 0.2]);
}

function createKnightGeometry() {
  // Le cavalier est plus complexe, on fait une version simplifiée
  const geometry = new THREE.BufferGeometry();
  
  // Base + corps incliné
  const base = new THREE.CylinderGeometry(0.55, 0.6, 0.3, 32);
  const body = new THREE.CylinderGeometry(0.3, 0.45, 1.2, 32);
  const head = new THREE.BoxGeometry(0.5, 0.8, 0.3);
  
  return createCylinderStack([0.6, 0.5, 0.4, 0.35, 0.4, 0.35], [0.25, 0.2, 0.5, 0.5, 0.3, 0.3]);
}

function createRookGeometry() {
  return createCylinderStack([0.6, 0.55, 0.45, 0.45, 0.5, 0.5], [0.3, 0.2, 0.8, 0.3, 0.2, 0.3]);
}

function createPawnGeometry() {
  return createCylinderStack([0.45, 0.35, 0.25, 0.3, 0.25], [0.2, 0.2, 0.5, 0.3, 0.3]);
}

function createCylinderStack(radii, heights) {
  const geometries = [];
  let y = 0;
  
  for (let i = 0; i < radii.length; i++) {
    const topRadius = i < radii.length - 1 ? radii[i + 1] * 0.9 : radii[i] * 0.5;
    const geo = new THREE.CylinderGeometry(topRadius, radii[i], heights[i], 32);
    geo.translate(0, y + heights[i] / 2, 0);
    geometries.push(geo);
    y += heights[i];
  }
  
  // Ajouter une sphère au sommet
  const sphereGeo = new THREE.SphereGeometry(radii[radii.length - 1] * 0.6, 32, 32);
  sphereGeo.translate(0, y + radii[radii.length - 1] * 0.3, 0);
  geometries.push(sphereGeo);
  
  // Fusionner les géométries
  const merged = mergeBufferGeometries(geometries);
  return merged || geometries[0];
}

function mergeBufferGeometries(geometries) {
  // Simple merge - pour une vraie fusion, utiliser BufferGeometryUtils
  // Ici on retourne juste la première géométrie pour simplifier
  if (geometries.length === 0) return null;
  
  // Créer une géométrie composite basique
  let totalVertices = 0;
  let totalIndices = 0;
  
  geometries.forEach(geo => {
    totalVertices += geo.attributes.position.count;
    if (geo.index) totalIndices += geo.index.count;
  });
  
  // Pour simplifier, on retourne la géométrie la plus significative
  return geometries.reduce((a, b) => 
    a.attributes.position.count > b.attributes.position.count ? a : b
  );
}

// ==================== ANIMATION ====================
function animate() {
  requestAnimationFrame(animate);
  
  pieceObjects.forEach(pieceData => {
    if (!pieceData.renderer || !pieceData.scene || !pieceData.camera) return;
    
    pieceData.time += 0.016;
    
    // Rotation de la pièce
    pieceData.group.rotation.y += pieceData.speed;
    
    // Flottement
    pieceData.group.position.y = pieceData.baseY + 
      Math.sin(pieceData.time * pieceData.floatSpeed) * pieceData.floatAmplitude;
    
    // Animation de la plateforme
    if (pieceData.platformGroup) {
      pieceData.platformGroup.rotation.y -= pieceData.speed * 0.5;
      
      // Animation des anneaux
      pieceData.platformGroup.children.forEach((child, index) => {
        if (index > 0) { // Skip le disque principal
          child.rotation.z = pieceData.time * 0.3 * (index % 2 === 0 ? 1 : -1);
        }
      });
    }
    
    // Animation des particules
    if (pieceData.particles) {
      const positions = pieceData.particles.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += Math.sin(pieceData.time + i) * 0.002;
        if (positions[i + 1] > 5) positions[i + 1] = -1;
      }
      pieceData.particles.geometry.attributes.position.needsUpdate = true;
      pieceData.particles.rotation.y = pieceData.time * 0.05;
    }
    
    // Animation de la point light
    if (pieceData.pointLight) {
      pieceData.pointLight.intensity = 1 + Math.sin(pieceData.time * 2) * 0.3;
    }
    
    // Rendu
    pieceData.renderer.render(pieceData.scene, pieceData.camera);
  });
}

// ==================== RESIZE ====================
window.addEventListener('resize', () => {
  pieceObjects.forEach(pieceData => {
    const container = pieceData.container;
    if (!container) return;
    
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    if (width > 0 && height > 0) {
      pieceData.camera.aspect = width / height;
      pieceData.camera.updateProjectionMatrix();
      pieceData.renderer.setSize(width, height);
    }
  });
});

// ==================== INTERACTION HOVER ====================
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.piece-card').forEach(card => {
      const viewer = card.querySelector('.piece-viewer');
      if (!viewer) return;
      
      card.addEventListener('mouseenter', () => {
        const pieceData = pieceObjects.find(p => p.container && p.container.id === viewer.id);
        if (pieceData) {
          pieceData.speed *= 3;
          pieceData.group.scale.set(1.1, 1.1, 1.1);
        }
      });
      
      card.addEventListener('mouseleave', () => {
        const pieceData = pieceObjects.find(p => p.container && p.container.id === viewer.id);
        if (pieceData) {
          pieceData.speed /= 3;
          pieceData.group.scale.set(1, 1, 1);
        }
      });
    });
  }, 3000);
});

console.log('✅ Three.js module chargé - Pièces d\'échecs 3D');
