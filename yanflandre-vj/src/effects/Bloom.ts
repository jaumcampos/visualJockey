import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export class BloomEffect {
  public composer: EffectComposer;
  public bloomPass: UnrealBloomPass;

  constructor(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  ) {
    this.composer = new EffectComposer(renderer);

    const renderPass = new RenderPass(scene, camera);
    this.composer.addPass(renderPass);

    const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // Diminuímos a força e o raio para não borrar a tela inteira
    this.bloomPass = new UnrealBloomPass(resolution, 0.6, 0.2, 0.85);

    // Threshold mais alto: apenas cores bem claras vão emitir brilho agora
    this.bloomPass.threshold = 0.4;
    this.bloomPass.strength = 0.6;
    this.bloomPass.radius = 0.2;

    this.composer.addPass(this.bloomPass);
  }

  public resize(width: number, height: number) {
    this.composer.setSize(width, height);
  }

  public pulse(audioIntensity: number) {
    // O brilho no bumbo forte agora vai no máximo até ~1.4, mantendo a nitidez
    const targetStrength = 0.6 + audioIntensity * 0.8;
    this.bloomPass.strength = THREE.MathUtils.lerp(
      this.bloomPass.strength,
      targetStrength,
      0.2,
    );
  }
}
