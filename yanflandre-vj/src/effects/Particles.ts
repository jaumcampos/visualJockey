import * as THREE from 'three';

export class ParticleSystem {
  public mesh: THREE.Points;
  private geometry: THREE.BufferGeometry;
  private material: THREE.PointsMaterial;
  private particleCount: number = 3000; // 3 mil partículas preenchem muito bem o espaço
  private velocities: Float32Array;

  constructor() {
    this.geometry = new THREE.BufferGeometry();

    // Arrays de alta performance (tipados) para armazenar posições e velocidades
    const positions = new Float32Array(this.particleCount * 3);
    this.velocities = new Float32Array(this.particleCount);

    for (let i = 0; i < this.particleCount * 3; i += 3) {
      // Espalha as partículas de forma ampla (X e Y)
      positions[i] = (Math.random() - 0.5) * 50;
      positions[i + 1] = (Math.random() - 0.5) * 50;
      // Espalha a profundidade do fundo até a câmera (Z)
      positions[i + 2] = (Math.random() - 0.5) * 50;

      // Velocidade individual base para cada partícula
      this.velocities[i / 3] = 0.05 + Math.random() * 0.15;
    }

    // Avisa a GPU sobre as posições iniciais
    this.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    // Material das partículas
    this.material = new THREE.PointsMaterial({
      color: 0xaa00ff, // Roxo elétrico brilhante
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      // AdditiveBlending faz com que as partículas brilhem muito mais quando se sobrepõem
      blending: THREE.AdditiveBlending,
    });

    // Junta tudo no objeto Points
    this.mesh = new THREE.Points(this.geometry, this.material);
  }

  public update(fluidBass: number, elapsedTime: number) {
    const positions = this.geometry.attributes.position.array as Float32Array;

    // ANTES: 1 + (fluidBass * 8)
    // AGORA: Um "empurrãozinho" suave na batida
    const pushSpeed = 1 + fluidBass * 2;

    // Rotação da nuvem bem mais relaxante
    this.mesh.rotation.z = elapsedTime * 0.03;

    for (let i = 0; i < this.particleCount * 3; i += 3) {
      positions[i + 2] += this.velocities[i / 3] * pushSpeed;

      // Movimento de espiral bem suave
      const angle = elapsedTime * this.velocities[i / 3] * 2;
      positions[i] += Math.cos(angle) * 0.01;
      positions[i + 1] += Math.sin(angle) * 0.01;

      if (positions[i + 2] > 15) {
        positions[i + 2] = -40;
        positions[i] = (Math.random() - 0.5) * 60;
        positions[i + 1] = (Math.random() - 0.5) * 60;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;

    // Partículas inflam sutilmente
    this.material.size = 0.04 + fluidBass * 0.08;
  }
}
