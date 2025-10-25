import { AudioAnalyzerOptions } from './types';

export class AudioAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private dataArray: Uint8Array<ArrayBuffer> | null = null;
  private source: MediaElementAudioSourceNode | null = null;
  private options: Required<AudioAnalyzerOptions>;

  constructor(options: AudioAnalyzerOptions = {}) {
    this.options = {
      fftSize: options.fftSize ?? 256,
      smoothingTimeConstant: options.smoothingTimeConstant ?? 0.8,
    };
  }

  initialize(audioElement: HTMLAudioElement): void {
    if (this.audioContext) {
      return; // Already initialized
    }

    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = this.options.fftSize;
    this.analyser.smoothingTimeConstant = this.options.smoothingTimeConstant;

    const bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(bufferLength);

    this.source = this.audioContext.createMediaElementSource(audioElement);
    this.source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  getVolume(): number {
    if (!this.analyser || !this.dataArray) return 0;

    this.analyser.getByteFrequencyData(this.dataArray);

    // Calculate average volume with emphasis on lower frequencies (speech range)
    let sum = 0;
    const speechRange = Math.floor(this.dataArray.length * 0.3); // Focus on lower 30%

    for (let i = 0; i < speechRange; i++) {
      sum += this.dataArray[i];
    }
    const average = sum / speechRange;

    // Normalize to 0-1 range
    return average / 255;
  }

  cleanup(): void {
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.dataArray = null;
  }

  isInitialized(): boolean {
    return this.audioContext !== null;
  }
}
