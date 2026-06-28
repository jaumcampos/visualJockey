import * as THREE from 'three';
import tunnelVertexSource from '../shaders/tunnel/tunnel.vert';
import tunnelFragmentSource from '../shaders/tunnel/tunnel.frag';

export class TunnelEffect {
  public mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;

  constructor() {
    // Usamos um plano gigante que cobrirá o fundo da tela
    const geometry = new THREE.PlaneGeometry(100, 100);

    // Criamos o ShaderMaterial com os uniforms (variáveis que controlaremos via TS)
    this.material = new THREE.ShaderMaterial({
      vertexShader: tunnelVertexSource,
      fragmentShader: tunnelFragmentSource,
      uniforms: {
        uTime: { value: 0.0 },
        uAudioIntensity: { value: 0.0 },
        // Define sua cor roxa preferida (pode ser 0x8800ff para algo bem saturado)
        uColor: { value: new THREE.Color(0x6600cc) },
      },
      transparent: true,
      side: THREE.DoubleSide,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);

    // Posiciona o túnel bem atrás do seu Nick
    this.mesh.position.z = -5;
  }

  // Método para atualizar os valores do shader em tempo real
  public update(elapsedTime: number, audioIntensity: number) {
    this.material.uniforms.uTime.value = elapsedTime;
    this.material.uniforms.uAudioIntensity.value = THREE.MathUtils.lerp(
      this.material.uniforms.uAudioIntensity.value,
      audioIntensity,
      0.2,
    );
  }
}
