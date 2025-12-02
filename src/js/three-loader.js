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
    scene.background = new THREE.Color(0x2a2a2a);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 3, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(3, 5, 3);
    scene.add(dirLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const mtlLoader = new MTLLoader();
    mtlLoader.setPath('./assets/3d/');
    mtlLoader.load(piece.file + '.mtl', materials => {
        materials.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('./assets/3d/');
        objLoader.load(piece.file + '.obj', obj => {
            const box = new THREE.Box3().setFromObject(obj);
            const center = new THREE.Vector3();
            box.getCenter(center);

            const pieceGroup = new THREE.Group();
            obj.position.sub(center);
            pieceGroup.add(obj);
            pieceGroup.scale.set(0.6, 0.6, 0.6);
            scene.add(pieceGroup);

            const speed = 0.002 + Math.random() * 0.003;
            pieceObjects.push({ group: pieceGroup, speed, scene, camera, renderer, container });
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    pieceObjects.forEach(pieceData => {
        pieceData.group.rotation.y += pieceData.speed;
        pieceData.renderer.render(pieceData.scene, pieceData.camera);
    });
}

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
