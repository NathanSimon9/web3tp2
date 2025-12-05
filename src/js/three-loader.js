import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

const pieces = [
    { file: 'roi', containerId: 'piece-1' },
    { file: 'reine', containerId: 'piece-2' },
    { file: 'fou', containerId: 'piece-3' },
    { file: 'cheval', containerId: 'piece-4' },
    { file: 'tour', containerId: 'piece-5' },
    { file: 'pion', containerId: 'piece-6' }
];

const pieceObjects = [];

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        pieces.forEach(piece => createPieceScene(piece));
        animate();
    }, 100);
});

function createPieceScene(piece) {
    const container = document.getElementById(piece.containerId);
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const scene = new THREE.Scene();
    
    // Arrière-plan avec gradient futuriste
    const bgTexture = createGradientTexture();
    scene.background = bgTexture;
    
    // Fog pour effet de profondeur
    scene.fog = new THREE.Fog(0x001020, 5, 15);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Éclairage principal (cyan)
    const mainLight = new THREE.DirectionalLight(0x00ffff, 2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    // Éclairage d'appoint (bleu)
    const fillLight = new THREE.DirectionalLight(0x0080ff, 1);
    fillLight.position.set(-3, 3, -3);
    scene.add(fillLight);

    // Éclairage ambiant
    const ambient = new THREE.AmbientLight(0x002040, 0.8);
    scene.add(ambient);
    
    // Rim light (rouge/orange)
    const rimLight = new THREE.DirectionalLight(0xff6600, 0.8);
    rimLight.position.set(0, -2, -5);
    scene.add(rimLight);

    // Plateforme holographique
    const platformGeometry = new THREE.CylinderGeometry(1.5, 1.5, 0.1, 32);
    const platformMaterial = new THREE.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 0.3,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.3
    });
    const platform = new THREE.Mesh(platformGeometry, platformMaterial);
    platform.position.y = -1;
    platform.receiveShadow = true;
    scene.add(platform);
    
    // Anneaux holographiques
    const rings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(1.2 + i * 0.3, 0.02, 16, 100);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: 0.4 - i * 0.1
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.y = -1;
        ring.rotation.x = Math.PI / 2;
        scene.add(ring);
        rings.push({ mesh: ring, offset: i * Math.PI / 3 });
    }

    // Particules ambiantes
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 100;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00ffff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Chargement de la pièce 3D
    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('./assets/3d/');
    mtlLoader.load(piece.file + '.mtl', materials => {
        materials.preload();
        
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./assets/3d/');
        objLoader.load(piece.file + '.obj', obj => {
            // Centrer l'objet
            const box = new THREE.Box3().setFromObject(obj);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const pieceGroup = new THREE.Group();
            obj.position.sub(center);
            
            // Améliorer les matériaux
            obj.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Ajouter des propriétés métalliques
                    if (child.material) {
                        child.material.metalness = 0.7;
                        child.material.roughness = 0.3;
                        child.material.emissive = new THREE.Color(0x001020);
                        child.material.emissiveIntensity = 0.2;
                    }
                }
            });
            
            pieceGroup.add(obj);
            pieceGroup.scale.set(0.6, 0.6, 0.6);
            scene.add(pieceGroup);

            const speed = 0.003 + Math.random() * 0.002;
            const floatSpeed = 0.001 + Math.random() * 0.001;
            const floatAmplitude = 0.1 + Math.random() * 0.1;
            
            pieceObjects.push({ 
                group: pieceGroup, 
                speed, 
                floatSpeed,
                floatAmplitude,
                scene, 
                camera, 
                renderer, 
                container,
                rings,
                particles,
                time: 0
            });
        });
    });
}

function createGradientTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, '#001530');
    gradient.addColorStop(0.5, '#001020');
    gradient.addColorStop(1, '#000510');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

function animate() {
    requestAnimationFrame(animate);
    
    pieceObjects.forEach(pieceData => {
        pieceData.time += 0.01;
        
        // Rotation de la pièce
        pieceData.group.rotation.y += pieceData.speed;
        
        // Effet de flottement
        pieceData.group.position.y = Math.sin(pieceData.time * pieceData.floatSpeed) * pieceData.floatAmplitude;
        
        // Animation des anneaux
        pieceData.rings.forEach((ring, index) => {
            ring.mesh.rotation.z = pieceData.time * 0.5 + ring.offset;
            ring.mesh.scale.set(
                1 + Math.sin(pieceData.time * 2 + ring.offset) * 0.05,
                1 + Math.sin(pieceData.time * 2 + ring.offset) * 0.05,
                1
            );
        });
        
        // Animation des particules
        const positions = pieceData.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(pieceData.time + i) * 0.001;
            
            // Réinitialiser les particules qui sortent
            if (positions[i + 1] > 5) {
                positions[i + 1] = -5;
            }
        }
        pieceData.particles.geometry.attributes.position.needsUpdate = true;
        pieceData.particles.rotation.y = pieceData.time * 0.1;
        
        pieceData.renderer.render(pieceData.scene, pieceData.camera);
    });
}

// Gestion du redimensionnement
window.addEventListener('resize', () => {
    pieceObjects.forEach(pieceData => {
        const container = pieceData.container;
        const width = container.clientWidth;
        const height = container.clientHeight;
        pieceData.camera.aspect = width / height;
        pieceData.camera.updateProjectionMatrix();
        pieceData.renderer.setSize(width, height);
    });
});

// Interaction hover sur les cartes
document.querySelectorAll('.piece-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const viewer = card.querySelector('.piece-viewer');
        if (viewer) {
            const pieceId = viewer.id;
            const pieceData = pieceObjects.find(p => p.container.id === pieceId);
            if (pieceData) {
                pieceData.speed *= 2; // Accélérer la rotation au survol
            }
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const viewer = card.querySelector('.piece-viewer');
        if (viewer) {
            const pieceId = viewer.id;
            const pieceData = pieceObjects.find(p => p.container.id === pieceId);
            if (pieceData) {
                pieceData.speed /= 2; // Revenir à la vitesse normale
            }
        }
    });
});

console.log('🎮 Visualisation 3D des pièces initialisée');