export class AudioAnalyzer {
  private context: AudioContext;
  private analyzer: AnalyserNode;
  private dataArray: Uint8Array;
  public isInitialized: boolean = false;

  // Variável para guardar o estado fluido do grave
  private smoothedBass: number = 0;

  constructor() {
    this.context = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    this.analyzer = this.context.createAnalyser();
    this.analyzer.fftSize = 2048;
    const bufferLength = this.analyzer.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);
  }

  public async init(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      const source = this.context.createMediaStreamSource(stream);
      source.connect(this.analyzer);

      if (this.context.state === 'suspended') {
        await this.context.resume();
      }

      this.isInitialized = true;
      console.log('🎙️ Áudio conectado e fluido!');
    } catch (error) {
      console.error('Erro no áudio:', error);
    }
  }

  public getFrequencyData(): Uint8Array {
    if (this.isInitialized) {
      // O "as any" resolve o erro chato do ArrayBufferLike do TypeScript
      this.analyzer.getByteFrequencyData(this.dataArray as any);
    }
    return this.dataArray;
  }

  // NOVA FUNÇÃO: O segredo da fluidez profissional
  public getFluidBass(): number {
    if (!this.isInitialized) return 0;

    this.analyzer.getByteFrequencyData(this.dataArray as any);
    const rawBass = this.dataArray[10] / 255.0; // Normalizado de 0 a 1

    // Lógica de Attack (sobe rápido) e Release (cai devagar)
    const attack = 0.5; // 50% de velocidade para subir
    const release = 0.05; // 5% de velocidade para cair (cria o rastro suave)

    const lerpFactor = rawBass > this.smoothedBass ? attack : release;
    this.smoothedBass += (rawBass - this.smoothedBass) * lerpFactor;

    return this.smoothedBass;
  }
}
