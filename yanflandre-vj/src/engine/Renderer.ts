import * as THREE from 'three';
import { scene } from './Scene';
import { camera } from './Camera';
import { BloomEffect } from '../effects/Bloom'; // <--- Importamos o Bloom

export const renderer = new THREE.WebGLRenderer({
  antialias: false, // Desligamos o antialias nativo ao usar post-processing pesado
  powerPreference: 'high-performance',
  alpha: false,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000);

// Criamos a instância do Bloom globalmente
export const bloom = new BloomEffect(renderer, scene, camera);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  bloom.resize(window.innerWidth, window.innerHeight); // Atualiza o bloom no resize
});

export function initRenderer(container: HTMLElement) {
  container.appendChild(renderer.domElement);
}

export function render() {
  // Trocamos renderer.render() por bloom.composer.render()
  bloom.composer.render();
}
