uniform float uTime;
uniform float uAudioIntensity;
varying vec2 vUv;

float random(float x) {
    return fract(sin(x) * 43758.5453);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float radius = length(uv);
    float angle = atan(uv.y, uv.x); 

    // --- 1. TRANSFORMAÇÃO DE ESPAÇO E ECLIPSE AJUSTADO ---
    float rawSine = sin(uTime * 0.05); 
    float viewMode = smoothstep(-0.4, 0.4, rawSine);
    float eclipse = smoothstep(0.6, 0.35, abs(rawSine));

    float depthRift = 1.0 / (radius + 0.05);
    float tunnelX = angle;
    float tunnelY = depthRift;
    float planeX = uv.x * 3.0; 
    float planeY = uv.y * 3.0;

    float a = mix(tunnelX, planeX, viewMode);
    float baseDepth = mix(tunnelY, planeY, viewMode);
    
    // --- 2. O MOVIMENTO PENDULAR (FRENTE E TRÁS LENTAMENTE) ---
    float d = baseDepth + sin(uTime * 0.05) * 16.0; 
    d += sin(a * 2.0 + uTime * 0.3) * 0.3;

    float structure = 0.0;
    float amplitude = 1.0;
    float fA = 3.0; 
    float fD = 3.5; 

    for(int i = 0; i < 4; i++) {
        float currentAngFreq = floor(fA);
        structure += sin(a * currentAngFreq + uTime * 0.2) * cos(d * fD) * amplitude;
        
        float nextA = a + 0.2 * sin(d * fD);
        float nextD = d + 0.2 * cos(a * currentAngFreq);
        a = nextA;
        d = nextD;

        fA *= 1.6;
        fD *= 1.8;
        amplitude *= 0.55;
    }

    float web = abs(structure);
    web = smoothstep(0.4, 0.05, web); 
    web *= (1.0 - eclipse);

    float colorShift = uTime * 0.15 + baseDepth * 0.2;
    vec3 colorBase = vec3(
        0.4 + 0.3 * sin(colorShift * 2.0),
        0.05 + 0.05 * sin(colorShift * 3.0),
        0.5 + 0.4 * sin(colorShift * 1.5 + 2.0)
    );

    vec3 finalColor = colorBase * web * 1.5;

    float pulse1 = sin(baseDepth * 10.0 + a * 4.0 - uTime * 8.0);
    float pulse2 = sin(baseDepth * 7.0 - a * 3.0 - uTime * 5.0);
    float energyBlobs = max(0.0, (pulse1 + pulse2) * 0.5);
    float audioPulse = energyBlobs * uAudioIntensity;

    finalColor += vec3(0.9, 0.2, 1.0) * audioPulse * web * 2.0;

    // --- 3. FUNDO DO ECLIPSE (PORTAL QUÂNTICO / BURACO NEGRO) ---
    // Cria uma distorção em espiral agressiva
    float vortexAngle = angle + uTime * 1.5 - radius * 4.0; 
    
    // Gera anéis e fios fractais que se cruzam e giram como uma mandala
    float fractalRings = sin(radius * 30.0 - uTime * 15.0 + sin(vortexAngle * 6.0) * 1.5);
    
    // Transforma as ondas em fios luminosos extremamente finos
    float vortexGlow = 0.02 / (abs(fractalRings) + 0.01); 
    
    // Ferve um plasma ao fundo para dar volume
    float plasma = sin(uv.x * 12.0 + uTime) * cos(uv.y * 12.0 - uTime);
    
    vec3 eclipseColor = vec3(0.02, 0.0, 0.05); // Base breu total
    
    // O vórtice explode em Rosa/Roxo reagindo violentamente ao áudio
    eclipseColor += vec3(0.9, 0.1, 0.8) * vortexGlow * (0.2 + uAudioIntensity * 2.5);
    
    // O plasma pulsa em Ciano/Azul
    eclipseColor += vec3(0.0, 0.5, 0.8) * abs(plasma) * (0.3 + uAudioIntensity);
    
    // O centro do Vórtice é um buraco negro infinito (apaga tudo no meio)
    eclipseColor *= smoothstep(0.15, 0.5, radius);
    
    // Injeta a complexidade na tela
    finalColor += eclipseColor * eclipse;
    // -----------------------------------------------------------

    // TROVÃO
    float timeStep = floor(uTime * 12.0);
    float snapAngle = (random(timeStep) * 2.0 - 1.0) * 3.14159;
    float slideAngle = uTime * 1.5 + sin(uTime * 0.5) * 2.0;
    float isSliding = step(0.6, random(floor(uTime * 0.33)));
    float boltPath = mix(snapAngle, slideAngle, isSliding);
    
    float jagged = sin(baseDepth * 30.0 - uTime * 40.0) * 0.3 + sin(baseDepth * 80.0) * 0.15;
    boltPath += jagged;
    
    float diff = abs(a - boltPath);
    float tunnelDiff = min(diff, 6.28318 - diff);
    diff = mix(tunnelDiff, diff, viewMode);
    
    float lightning = smoothstep(0.02, 0.005, diff);
    lightning *= (1.0 - eclipse); 
    
    float snapTrigger = step(0.85, random(timeStep + 100.0));
    float slideTrigger = smoothstep(0.2, 0.9, sin(uTime * 2.0)); 
    float flashTrigger = mix(snapTrigger, slideTrigger, isSliding) * uAudioIntensity;

    vec3 thunderColor = vec3(0.2, 0.6, 0.9) * lightning * flashTrigger * 1.2;
    finalColor += thunderColor * web;
    finalColor += vec3(0.05, 0.15, 0.25) * flashTrigger * uAudioIntensity * 0.05 * (1.0 - eclipse);

    // VINHETA MÓVEL
    float tunnelVignette = smoothstep(0.0, 0.6, radius);
    float planeVignette = smoothstep(1.5, 0.5, radius);
    float vignette = mix(tunnelVignette, planeVignette, viewMode);
    
    finalColor *= vignette;

    gl_FragColor = vec4(finalColor, 1.0);
}