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
   * Canvas background transparency (0-1)
   * 0 = fully transparent, 1 = fully opaque
   * @default 1
   */
  backgroundAlpha?: number;

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

  // ========== Phase 1: Expression & Performance ==========

  /**
   * Current expression name to display
   * @example 'neutral', 'happy', 'sad', 'angry'
   */
  expression?: string;

  /**
   * Expression file mappings
   * @example { happy: '/expressions/happy.exp3.json', sad: '/expressions/sad.exp3.json' }
   */
  expressions?: Record<string, string>;

  /**
   * Callback when expression changes
   */
  onExpressionChanged?: (expression: string) => void;

  /**
   * Enable breathing animation
   * @default true
   */
  enableBreathing?: boolean;

  /**
   * Breathing speed multiplier
   * @default 1.0
   */
  breathingSpeed?: number;

  /**
   * Breathing intensity (0-1)
   * @default 0.5
   */
  breathingIntensity?: number;

  /**
   * Target FPS for rendering
   * @default 60
   */
  fps?: number;

  /**
   * Resolution multiplier (lower = better performance)
   * @default 1
   */
  resolution?: number;

  /**
   * Enable automatic quality adjustment based on performance
   * @default false
   */
  autoQuality?: boolean;

  // ========== Phase 2: Mouse Tracking & Motions ==========

  /**
   * Enable mouse tracking (character follows cursor)
   * @default false
   */
  enableMouseTracking?: boolean;

  /**
   * Mouse tracking smoothing (0-1, higher = smoother but slower)
   * @default 0.1
   */
  trackingSmoothing?: number;

  /**
   * Mouse tracking range in degrees
   * @default 30
   */
  trackingRange?: number;

  /**
   * Current motion group to play
   * @example 'idle', 'greeting', 'happy'
   */
  motionGroup?: string;

  /**
   * Motion file mappings
   * @example { idle: '/motions/idle.motion3.json', greeting: '/motions/hello.motion3.json' }
   */
  motions?: Record<string, string>;

  /**
   * Callback when motion finishes playing
   */
  onMotionFinished?: (motionGroup: string) => void;

  /**
   * Motion priority (0-3, higher = more important)
   * @default 2
   */
  motionPriority?: number;

  /**
   * Loop motion playback
   * @default false
   */
  loopMotion?: boolean;

  // ========== Phase 3: Preload & Accessibility ==========

  /**
   * Preload expressions before displaying
   * @default false
   */
  preloadExpressions?: boolean;

  /**
   * Preload motions before displaying
   * @default false
   */
  preloadMotions?: boolean;

  /**
   * Callback when preloading completes
   */
  onPreloadComplete?: () => void;

  /**
   * Callback with preload progress (0-1)
   */
  onPreloadProgress?: (progress: number) => void;

  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;

  /**
   * ARIA description for accessibility
   */
  ariaDescription?: string;

  /**
   * Enable keyboard controls
   * @default false
   */
  enableKeyboardControls?: boolean;

  /**
   * Callback for keyboard events
   */
  onKeyboardEvent?: (event: KeyboardEvent) => void;
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
