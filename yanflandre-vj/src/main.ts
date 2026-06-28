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
    nickObject.position.y = Math.sin(elapsedTime * 0.5) * 0.2; // Movimento mais lento
  }

  if (audioAnalyzer.isInitialized) {
    const frequencies = audioAnalyzer.getFrequencyData();
    // Frequência do Bumbo (Grave)
    const bass = frequencies[10];
    // Agora usamos o grave super fluido com Attack/Release!
    const fluidBass = audioAnalyzer.getFluidBass();

    // Normaliza a intensidade para 0.0 - 1.0 (para o shader)
    const normalizedBass = bass / 255.0;

    // 2. Atualiza o Túnel com o tempo e o áudio
    tunnelEffect.update(elapsedTime, fluidBass);
    bloom.pulse(fluidBass);

    particles.update(fluidBass, elapsedTime);

    if (nickObject) {
      // O Nick agora vai pulsar com a mesma classe e suavidade
      const scale = 1 + fluidBass * 0.15;
      nickObject.scale.set(scale, scale, scale); // Não precisa mais de lerp aqui, o valor já é fluido!

      // Tremor sutil focado apenas nos picos reais
      if (fluidBass > 0.6) {
        nickObject.rotation.z = (Math.random() - 0.5) * 0.03;
        nickObject.rotation.x = (Math.random() - 0.5) * 0.03;
      } else {
        nickObject.rotation.z = THREE.MathUtils.lerp(
          nickObject.rotation.z,
          0,
          0.1,
        );
        nickObject.rotation.x = THREE.MathUtils.lerp(
          nickObject.rotation.x,
          0,
          0.1,
        );
      }
    }
  }

  render();
  requestAnimationFrame(tick);
}

tick();
