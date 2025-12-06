/**
 * ============================================
 * ZDOG.JS - Pièces d'échecs 3D avec Three.js
 * ============================================
 * Ce fichier charge les modèles OBJ/MTL des pièces d'échecs
 * Note: Fichier nommé zdog.js pour compatibilité avec les consignes
 */

import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

console.log('🎮 Initialisation des pièces 3D avec Three.js...');

// ==================== CONFIGURATION DES PIÈCES ====================
const pieces = [
  { file: 'roi', containerId: 'zdog-king', name: 'ROI' },
  { file: 'reine', containerId: 'zdog-queen', name: 'REINE' },
  { file: 'fou', containerId: 'zdog-bishop', name: 'FOU' },
  { file: 'cheval', containerId: 'zdog-knight', name: 'CAVALIER' },
  { file: 'tour', containerId: 'zdog-rook', name: 'TOUR' },
  { file: 'pion', containerId: 'zdog-pawn', name: 'PION' }
];

const pieceObjects = [];

// ==================== CRÉATION DU GRADIENT BACKGROUND ====================
function createGradientTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  gradient.addColorStop(0, '#001a33');
  gradient.addColorStop(0.5, '#001020');
  gradient.addColorStop(1, '#000510');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 256, 256);
  
  return new THREE.CanvasTexture(canvas);
}

// ==================== CRÉATION DE LA SCÈNE POUR CHAQUE PIÈCE ====================
function createPieceScene(piece) {
  const container = document.getElementById(piece.containerId);
  if (!container) {
    console.warn(`⚠️ Container ${piece.containerId} non trouvé`);
    return;
  }

  const width = container.clientWidth || 150;
  const height = container.clientHeight || 120;

  // Scène
  const scene = new THREE.Scene();
  scene.background = createGradientTexture();
  scene.fog = new THREE.Fog(0x001020, 5, 20);

  // Caméra
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.set(0, 3, 8);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  // ==================== ÉCLAIRAGE STYLE IRON MAN ====================
  const mainLight = new THREE.DirectionalLight(0x00ffff, 2.5);
  mainLight.position.set(5, 5, 5);
  mainLight.castShadow = true;
  scene.add(mainLight);

  const redLight = new THREE.PointLight(0xff3300, 1.5, 15);
  redLight.position.set(-3, 2, -3);
  scene.add(redLight);

  const blueLight = new THREE.DirectionalLight(0x0066ff, 1);
  blueLight.position.set(-3, 3, 3);
  scene.add(blueLight);

  const ambient = new THREE.AmbientLight(0x002040, 0.6);
  scene.add(ambient);

  const rimLight = new THREE.DirectionalLight(0xff6600, 0.8);
  rimLight.position.set(0, -2, -5);
  scene.add(rimLight);

  // ==================== PLATEFORME HOLOGRAPHIQUE ====================
  const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.08, 32);
  const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    emissive: 0x00ffff,
    emissiveIntensity: 0.3,
    metalness: 0.9,
    roughness: 0.1,
    transparent: true,
    opacity: 0.4
  });
  const platform = new THREE.Mesh(platformGeometry, platformMaterial);
  platform.position.y = -1.2;
  platform.receiveShadow = true;
  scene.add(platform);

  // ==================== ANNEAUX HOLOGRAPHIQUES ====================
  const rings = [];
  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(1.3 + i * 0.25, 0.015, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0.5 - i * 0.12
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.y = -1.2;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
    rings.push({ mesh: ring, offset: i * Math.PI / 3 });
  }

  // ==================== PARTICULES ====================
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 80;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 8;
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.04,
    transparent: true,
    opacity: 0.7,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // ==================== CHARGEMENT DU MODÈLE OBJ/MTL ====================
  const mtlLoader = new MTLLoader();
  mtlLoader.setPath('./assets/3d/');
  
  mtlLoader.load(piece.file + '.mtl', (materials) => {
    materials.preload();
    
    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('./assets/3d/');
    
    objLoader.load(piece.file + '.obj', (obj) => {
      const box = new THREE.Box3().setFromObject(obj);
      const center = new THREE.Vector3();
      box.getCenter(center);
      
      const pieceGroup = new THREE.Group();
      obj.position.sub(center);
      
      obj.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshStandardMaterial({
            color: 0x00ccff,
            metalness: 0.8,
            roughness: 0.2,
            emissive: 0x003344,
            emissiveIntensity: 0.3
          });
        }
      });
      
      pieceGroup.add(obj);
      pieceGroup.scale.set(0.5, 0.5, 0.5);
      scene.add(pieceGroup);
      
      const speed = 0.008 + Math.random() * 0.004;
      
      pieceObjects.push({
        group: pieceGroup,
        speed,
        baseSpeed: speed,
        floatSpeed: 0.002,
        floatAmplitude: 0.15,
        scene,
        camera,
        renderer,
        container,
        rings,
        particles,
        redLight,
        time: 0
      });
      
      console.log(`✅ Pièce ${piece.name} chargée`);
    });
  });
}

// ==================== ANIMATION ====================
function animate() {
  requestAnimationFrame(animate);
  
  pieceObjects.forEach((pieceData) => {
    pieceData.time += 0.016;
    
    pieceData.group.rotation.y += pieceData.speed;
    pieceData.group.position.y = Math.sin(pieceData.time * pieceData.floatSpeed * 60) * pieceData.floatAmplitude;
    
    pieceData.rings.forEach((ring) => {
      ring.mesh.rotation.z = pieceData.time * 0.8 + ring.offset;
      ring.mesh.scale.set(
        1 + Math.sin(pieceData.time * 2 + ring.offset) * 0.05,
        1 + Math.sin(pieceData.time * 2 + ring.offset) * 0.05,
        1
      );
    });
    
    pieceData.redLight.intensity = 1 + Math.sin(pieceData.time * 3) * 0.5;
    
    const positions = pieceData.particles.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(pieceData.time + i) * 0.002;
      if (positions[i + 1] > 4) positions[i + 1] = -4;
    }
    pieceData.particles.geometry.attributes.position.needsUpdate = true;
    pieceData.particles.rotation.y = pieceData.time * 0.15;
    
    pieceData.renderer.render(pieceData.scene, pieceData.camera);
  });
}

// ==================== HOVER EFFECTS ====================
function setupHoverEffects() {
  document.querySelectorAll('.piece-card').forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
      if (pieceObjects[index]) {
        pieceObjects[index].speed = pieceObjects[index].baseSpeed * 3;
      }
    });
    
    card.addEventListener('mouseleave', () => {
      if (pieceObjects[index]) {
        pieceObjects[index].speed = pieceObjects[index].baseSpeed;
      }
    });
  });
}

// ==================== RESIZE ====================
window.addEventListener('resize', () => {
  pieceObjects.forEach((pieceData) => {
    const container = pieceData.container;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    pieceData.camera.aspect = width / height;
    pieceData.camera.updateProjectionMatrix();
    pieceData.renderer.setSize(width, height);
  });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    pieces.forEach(piece => createPieceScene(piece));
    animate();
    setupHoverEffects();
    console.log('✅ Toutes les pièces 3D initialisées');
  }, 800);
});
