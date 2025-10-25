export interface Live2DCharacterProps {
  /**
   * Path to the Live2D model file (.model3.json or .model.json)
   */
  modelPath: string;

  /**
   * Audio volume (0-1 range) for lip-sync animation
   * @default 0
   */
  audioVolume?: number;

  /**
   * Callback when model is successfully loaded
   */
  onModelLoaded?: () => void;

  /**
   * Callback when model fails to load
   */
  onModelError?: (error: Error) => void;

  /**
   * Vertical position offset (-1 to 1)
   * -1: top, 0: center, 1: bottom
   * @default 0
   */
  positionY?: number;

  /**
   * Horizontal position offset (-1 to 1)
   * -1: left, 0: center, 1: right
   * @default 0
   */
  positionX?: number;

  /**
   * Scale multiplier
   * @default 1
   */
  scale?: number;

  /**
   * Canvas width in pixels
   * @default 640
   */
  width?: number;

  /**
   * Canvas height in pixels
   * @default 960
   */
  height?: number;

  /**
   * Canvas background color (hex number)
   * @default 0xf0f0f0
   */
  backgroundColor?: number;

  /**
   * Enable antialiasing
   * @default true
   */
  antialias?: boolean;

  /**
   * Custom CSS class name for the container
   */
  className?: string;

  /**
   * Custom CSS styles for the container
   */
  style?: React.CSSProperties;

  /**
   * Enable automatic blinking animation
   * @default true
   */
  enableBlinking?: boolean;

  /**
   * Blinking interval range in milliseconds [min, max]
   * @default [2000, 6000]
   */
  blinkInterval?: [number, number];

  /**
   * Blinking duration in milliseconds
   * @default 100
   */
  blinkDuration?: number;

  /**
   * Enable lip-sync animation
   * @default true
   */
  enableLipSync?: boolean;

  /**
   * Lip-sync sensitivity multiplier
   * @default 1.5
   */
  lipSyncSensitivity?: number;

  /**
   * Show loading indicator
   * @default true
   */
  showLoading?: boolean;

  /**
   * Show error messages
   * @default true
   */
  showError?: boolean;

  /**
   * Custom loading component
   */
  loadingComponent?: React.ReactNode;

  /**
   * Custom error component
   */
  errorComponent?: React.ReactNode;
}

export interface AudioAnalyzerOptions {
  /**
   * FFT size for frequency analysis
   * @default 256
   */
  fftSize?: number;

  /**
   * Smoothing time constant
   * @default 0.8
   */
  smoothingTimeConstant?: number;
}

export interface UseLive2DAudioOptions {
  /**
   * Audio element to analyze
   */
  audioElement?: HTMLAudioElement | null;

  /**
   * Enable automatic audio analysis
   * @default true
   */
  enabled?: boolean;

  /**
   * Audio analyzer options
   */
  analyzerOptions?: AudioAnalyzerOptions;

  /**
   * Callback when audio starts playing
   */
  onPlay?: () => void;

  /**
   * Callback when audio is paused
   */
  onPause?: () => void;

  /**
   * Callback when audio ends
   */
  onEnded?: () => void;
}
