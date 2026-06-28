import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export async function createNick(): Promise<THREE.Group> {
  const group = new THREE.Group();
  const loader = new FontLoader();

  // Trocamos para uma fonte um pouco mais reta
  const fontUrl =
    'https://unpkg.com/three@0.160.0/examples/fonts/optimer_bold.typeface.json';

  return new Promise((resolve) => {
    loader.load(fontUrl, (font) => {
      const geometry = new TextGeometry('YANFLANDRE', {
        // Caixa alta para mais impacto
        font: font,
        size: 1.2,
        depth: 0.4, // Um pouco mais profundo para destacar as laterais
        curveSegments: 4, // Menos segmentos = visual mais angular/agressivo
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 2,
      });

      geometry.computeBoundingBox();
      const xOffset =
        -0.5 * (geometry.boundingBox!.max.x - geometry.boundingBox!.min.x);
      const yOffset =
        -0.5 * (geometry.boundingBox!.max.y - geometry.boundingBox!.min.y);
      geometry.translate(xOffset, yOffset, 0);

      // Material 0: Frente do texto (Metal Escuro)
      const darkMetalFace = new THREE.MeshStandardMaterial({
        color: 0x111111, // Quase preto
        roughness: 0.2,
        metalness: 0.9,
      });

      // Material 1: Bordas e laterais (Neon Roxo Emissivo)
      const neonEdge = new THREE.MeshStandardMaterial({
        color: 0x4400aa,
        emissive: 0x6600cc, // Essa cor ignora as sombras e brilha sozinha
        emissiveIntensity: 1.5, // Faz o Bloom pegar apenas nas bordas
        roughness: 0.5,
        metalness: 0.1,
      });

      // Passamos um array: o Three.js sabe que o índice 0 é a frente e 1 são as laterais/chanfros
      const textMesh = new THREE.Mesh(geometry, [darkMetalFace, neonEdge]);
      group.add(textMesh);

      resolve(group);
    });
  });
}
