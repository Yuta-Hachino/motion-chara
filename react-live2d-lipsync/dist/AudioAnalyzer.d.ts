import { AudioAnalyzerOptions } from './types';
export declare class AudioAnalyzer {
    private audioContext;
    private analyser;
    private dataArray;
    private source;
    private options;
    constructor(options?: AudioAnalyzerOptions);
    initialize(audioElement: HTMLAudioElement): void;
    getVolume(): number;
    cleanup(): void;
    isInitialized(): boolean;
}
//# sourceMappingURL=AudioAnalyzer.d.ts.map