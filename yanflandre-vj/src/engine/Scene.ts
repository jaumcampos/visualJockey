// src/engine/Scene.ts
import * as THREE from 'three';

export const scene = new THREE.Scene();

// Luz ambiente mais forte
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Luz Neon Magenta (Forte e vindo da direita)
const dirLight1 = new THREE.DirectionalLight(0xff00ff, 5);
dirLight1.position.set(5, 5, 5);
scene.add(dirLight1);

// Luz Ciano (Forte e vindo da esquerda)
const dirLight2 = new THREE.DirectionalLight(0x00ffff, 5);
dirLight2.position.set(-5, -5, 5);
scene.add(dirLight2);
