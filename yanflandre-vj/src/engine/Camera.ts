import * as THREE from 'three';

export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

// Posiciona a câmera um pouco para trás para podermos ver o "palco"
camera.position.z = 12;
