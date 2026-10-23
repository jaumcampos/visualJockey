import * as THREE from 'three';
import './style.css';
import { initRenderer, render, bloom } from './engine/Renderer';
import { AudioAnalyzer } from './audio/AudioAnalyzer';
import { scene } from './engine/Scene';
import { ParticleSystem } from './effects/Particles';

import { createNick } from './objects/NickTest';
import { TunnelEffect } from './objects/Rings'; // <--- Importa o Túnel

const container = document.getElementById('canvas-container');
if (container) {
  initRenderer(container);
}

// 1. Inicializa o Túnel e adiciona à cena ANTES do nick
const tunnelEffect = new TunnelEffect();
scene.add(tunnelEffect.mesh);

const particles = new ParticleSystem();
scene.add(particles.mesh);

let nickObject: THREE.Group | null = null;
createNick().then((textGroup) => {
  nickObject = textGroup;
  scene.add(nickObject);
});

const audioAnalyzer = new AudioAnalyzer();

window.addEventListener(
  'click',
  () => {
    if (!audioAnalyzer.isInitialized) {
      audioAnalyzer.init();
    }
  },
  { once: true },
);

const clock = new THREE.Clock();

function tick() {
  const elapsedTime = clock.getElapsedTime();

  if (nickObject) {
    // Mantém a flutuação vertical suave e constante (respiração)
    nickObject.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
  }

  if (audioAnalyzer.isInitialized) {
    const frequencies = audioAnalyzer.getFrequencyData();
    // Frequência do Bumbo (Grave)
    const bass = frequencies[10];
    // O grave fluido com Attack/Release
    const fluidBass = audioAnalyzer.getFluidBass();

    // 2. Atualiza o Túnel e Partículas
    tunnelEffect.update(elapsedTime, fluidBass);
    bloom.pulse(fluidBass);
    particles.update(fluidBass, elapsedTime);

    if (nickObject) {
      // --- NICK: APENAS PULSO SUAVE, SEM TREMOR ---

      // 1. Escala (cresce e encolhe com classe)
      const scale = 1 + fluidBass * 0.15;
      nickObject.scale.set(scale, scale, scale);

      // Garante que a rotação fique 100% reta e estável
      nickObject.rotation.set(0, 0, 0);

      // 2. Neon Dinâmico (Faz o material roxo brilhar no bumbo!)
      const textMesh = nickObject.children[0] as THREE.Mesh;
      if (textMesh && textMesh.material) {
        // Sabemos que o material é um array onde o índice 1 é o Neon (borda)
        const materials = textMesh.material as THREE.MeshStandardMaterial[];
        if (materials.length > 1) {
          // Brilho base = 1.5, sobe no máximo até 3.5 com o grave da música
          materials[1].emissiveIntensity = 1.5 + fluidBass * 2.0;
        }
      }
    }
  }

  render();
  requestAnimationFrame(tick);
}

tick();
