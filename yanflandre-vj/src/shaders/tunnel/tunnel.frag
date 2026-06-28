uniform float uTime;
uniform float uAudioIntensity; 
uniform vec3 uColor;          
varying vec2 vUv;

void main() {
    vec2 p = vUv * 2.0 - 1.0;
    
    float radius = length(p);
    
    // SOFISTICAÇÃO: Adicionamos o "radius" na fórmula do ângulo para torcer o grid!
    float angle = atan(p.y, p.x) + radius * 2.0 - uTime * 0.5;

    // Distorção orgânica no túnel baseada no áudio fluido
    float tunnel = fract(radius * 3.0 - uTime * 2.0 + (sin(angle * 4.0) * uAudioIntensity * 0.3));

    float grid = smoothstep(0.4, 0.5, tunnel) - smoothstep(0.5, 0.6, tunnel);

    // Gradiente de profundidade (mais escuro no fundo)
    float depth = smoothstep(0.0, 1.0, radius);

    vec3 color = uColor * depth;
    color += uColor * uAudioIntensity;

    float glow = 0.02 / (radius + 0.1);
    color += uColor * glow * (1.0 + uAudioIntensity * 1.5);

    color *= grid;

    gl_FragColor = vec4(color, 1.0);
}