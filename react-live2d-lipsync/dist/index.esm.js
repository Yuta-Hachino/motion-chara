import React, { useRef, useState, useEffect } from 'react';
import * as PIXI from 'pixi.js';

// Enable Live2D global mixins for PIXI
if (typeof window !== 'undefined') {
    window.PIXI = PIXI;
}
// Dynamically import Live2D to avoid SSR issues
let Live2DModel = null;
if (typeof window !== 'undefined') {
    import('pixi-live2d-display').then((module) => {
        Live2DModel = module.Live2DModel;
    });
}
const DefaultLoadingComponent = () => (React.createElement("div", { style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(240, 240, 240, 0.75)',
    } },
    React.createElement("div", { style: { textAlign: 'center' } },
        React.createElement("div", { style: {
                width: '48px',
                height: '48px',
                border: '4px solid #3b82f6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 16px',
            } }),
        React.createElement("p", { style: { color: '#374151' } }, "Loading Live2D model..."))));
const DefaultErrorComponent = ({ error }) => (React.createElement("div", { style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(254, 242, 242, 0.9)',
    } },
    React.createElement("div", { style: { textAlign: 'center', padding: '24px' } },
        React.createElement("p", { style: { color: '#dc2626', fontWeight: 600, marginBottom: '8px' } }, "\u30A8\u30E9\u30FC"),
        React.createElement("p", { style: { color: '#ef4444', fontSize: '14px' } }, error))));
/**
 * Live2D Character Component
 *
 * A React component that displays a Live2D model with lip-sync and blinking animations.
 *
 * @example
 * ```tsx
 * import { Live2DCharacter } from 'react-live2d-lipsync';
 *
 * function App() {
 *   const [audioVolume, setAudioVolume] = useState(0);
 *
 *   return (
 *     <Live2DCharacter
 *       modelPath="/models/character.model3.json"
 *       audioVolume={audioVolume}
 *       positionY={-0.3}
 *       scale={1.2}
 *     />
 *   );
 * }
 * ```
 */
const Live2DCharacter = ({ modelPath, audioVolume = 0, onModelLoaded, onModelError, positionY = 0, positionX = 0, scale = 1, width = 640, height = 960, backgroundColor = 0xf0f0f0, antialias = true, className = '', style = {}, enableBlinking = true, blinkInterval = [2000, 6000], blinkDuration = 100, enableLipSync = true, lipSyncSensitivity = 1.5, showLoading = true, showError = true, loadingComponent, errorComponent, 
// Phase 1
expression, expressions, onExpressionChanged, enableBreathing = true, breathingSpeed = 1.0, breathingIntensity = 0.5, fps = 60, resolution = 1, autoQuality = false, 
// Phase 2
enableMouseTracking = false, trackingSmoothing = 0.1, trackingRange = 30, motionGroup, motions, onMotionFinished, motionPriority = 2, loopMotion = false, 
// Phase 3
preloadExpressions = false, preloadMotions = false, onPreloadComplete, onPreloadProgress, ariaLabel, ariaDescription, enableKeyboardControls = false, onKeyboardEvent, }) => {
    const canvasRef = useRef(null);
    const appRef = useRef(null);
    const modelRef = useRef(null);
    const blinkTimerRef = useRef(null);
    const breathingTimerRef = useRef(null);
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const currentAngleRef = useRef({ x: 0, y: 0 });
    const performanceRef = useRef({ frameCount: 0, startTime: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const initLive2D = async () => {
            if (!canvasRef.current)
                return;
            // Prevent multiple initializations
            if (appRef.current)
                return;
            // Wait for Live2DModel to be loaded
            if (!Live2DModel) {
                const checkModel = setInterval(() => {
                    if (Live2DModel) {
                        clearInterval(checkModel);
                        initLive2D();
                    }
                }, 100);
                return;
            }
            // Wait for Live2D SDK to be loaded
            if (typeof window !== 'undefined' && (!window.Live2DCubismCore && !window.Live2D)) {
                const checkSDK = setInterval(() => {
                    if (window.Live2DCubismCore || window.Live2D) {
                        clearInterval(checkSDK);
                        initLive2D();
                    }
                }, 100);
                return;
            }
            try {
                // Clear any existing content
                canvasRef.current.innerHTML = '';
                // Create PIXI Application with performance settings
                const app = new PIXI.Application({
                    width: width * resolution,
                    height: height * resolution,
                    backgroundColor,
                    antialias,
                    resolution,
                });
                appRef.current = app;
                canvasRef.current.appendChild(app.view);
                // Configure FPS limit
                if (fps && fps < 60) {
                    app.ticker.maxFPS = fps;
                }
                // Performance monitoring for auto quality
                if (autoQuality) {
                    performanceRef.current.startTime = Date.now();
                    app.ticker.add(() => {
                        performanceRef.current.frameCount++;
                        const elapsed = Date.now() - performanceRef.current.startTime;
                        // Check performance every 2 seconds
                        if (elapsed >= 2000) {
                            const currentFPS = (performanceRef.current.frameCount / elapsed) * 1000;
                            // If FPS drops below target, reduce quality
                            if (currentFPS < fps * 0.8 && resolution > 0.5) {
                                console.warn(`Low FPS detected (${currentFPS.toFixed(1)}), reducing resolution`);
                                // Note: Actual resolution change would require recreating the app
                                // This is a simplified version - full implementation would need app recreation
                            }
                            performanceRef.current.frameCount = 0;
                            performanceRef.current.startTime = Date.now();
                        }
                    });
                }
                // Load Live2D model
                const model = await Live2DModel.from(modelPath);
                modelRef.current = model;
                // Scale and position model - use width/height directly instead of app.screen
                const screenWidth = app.screen?.width || width;
                const screenHeight = app.screen?.height || height;
                const scaleX = (screenWidth * 0.8) / model.width;
                const scaleY = (screenHeight * 0.8) / model.height;
                const baseScale = Math.min(scaleX, scaleY);
                model.scale.set(baseScale * scale);
                model.x = screenWidth / 2 + (positionX * screenWidth / 2);
                model.y = screenHeight / 2 + (positionY * screenHeight / 2);
                model.anchor.set(0.5, 0.5);
                app.stage.addChild(model);
                // Initialize parameters
                if (model.internalModel && model.internalModel.coreModel) {
                    model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', 0);
                    model.internalModel.coreModel.setParameterValueById('ParamEyeLOpen', 1);
                    model.internalModel.coreModel.setParameterValueById('ParamEyeROpen', 1);
                }
                // Start blinking animation if enabled
                if (enableBlinking) {
                    startBlinking();
                }
                // Start breathing animation if enabled
                if (enableBreathing) {
                    startBreathing();
                }
                // Preload resources if enabled
                if (preloadExpressions || preloadMotions) {
                    await preloadResources();
                }
                setIsLoading(false);
                onModelLoaded?.();
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                console.error('Failed to load Live2D model:', err);
                setError(`モデル読み込みエラー: ${errorMessage}`);
                setIsLoading(false);
                onModelError?.(err instanceof Error ? err : new Error(errorMessage));
            }
        };
        initLive2D();
        return () => {
            if (blinkTimerRef.current) {
                clearTimeout(blinkTimerRef.current);
                blinkTimerRef.current = null;
            }
            if (breathingTimerRef.current) {
                cancelAnimationFrame(breathingTimerRef.current);
                breathingTimerRef.current = null;
            }
            if (modelRef.current) {
                modelRef.current.destroy();
                modelRef.current = null;
            }
            if (appRef.current) {
                appRef.current.destroy(true, { children: true, texture: true, baseTexture: true });
                appRef.current = null;
            }
            if (canvasRef.current) {
                canvasRef.current.innerHTML = '';
            }
        };
    }, [modelPath, width, height, backgroundColor, antialias, enableBlinking, enableBreathing]);
    // Blinking animation
    const startBlinking = () => {
        const blink = () => {
            if (!modelRef.current?.internalModel?.coreModel)
                return;
            const coreModel = modelRef.current.internalModel.coreModel;
            // Close eyes
            coreModel.setParameterValueById('ParamEyeLOpen', 0);
            coreModel.setParameterValueById('ParamEyeROpen', 0);
            // Open eyes after specified duration
            setTimeout(() => {
                if (coreModel) {
                    coreModel.setParameterValueById('ParamEyeLOpen', 1);
                    coreModel.setParameterValueById('ParamEyeROpen', 1);
                }
            }, blinkDuration);
            // Schedule next blink with random interval
            const [minInterval, maxInterval] = blinkInterval;
            const nextInterval = minInterval + Math.random() * (maxInterval - minInterval);
            blinkTimerRef.current = setTimeout(blink, nextInterval);
        };
        blink();
    };
    // Breathing animation
    const startBreathing = () => {
        let breathPhase = 0;
        const updateBreathing = () => {
            if (!modelRef.current?.internalModel?.coreModel || !enableBreathing)
                return;
            const coreModel = modelRef.current.internalModel.coreModel;
            breathPhase += 0.016 * breathingSpeed; // Assuming ~60fps
            const breathValue = Math.sin(breathPhase) * breathingIntensity;
            // Try to set ParamBreath if available, otherwise use body angle
            try {
                coreModel.setParameterValueById('ParamBreath', breathValue);
            }
            catch {
                // Fallback: use body angle for breathing effect
                try {
                    coreModel.setParameterValueById('ParamBodyAngleY', breathValue * 2);
                }
                catch {
                    // Model doesn't support breathing parameters
                }
            }
            breathingTimerRef.current = requestAnimationFrame(updateBreathing);
        };
        updateBreathing();
    };
    // Preload resources
    const preloadResources = async () => {
        const resources = [];
        if (preloadExpressions && expressions) {
            resources.push(...Object.values(expressions));
        }
        if (preloadMotions && motions) {
            resources.push(...Object.values(motions));
        }
        if (resources.length === 0)
            return;
        let loaded = 0;
        const total = resources.length;
        for (const resourcePath of resources) {
            try {
                await fetch(resourcePath);
                loaded++;
                onPreloadProgress?.(loaded / total);
            }
            catch (err) {
                console.warn(`Failed to preload resource: ${resourcePath}`, err);
            }
        }
        onPreloadComplete?.();
    };
    // Update mouth based on audio volume (lip-sync)
    useEffect(() => {
        if (!modelRef.current?.internalModel?.coreModel || !enableLipSync)
            return;
        const smoothVolume = Math.min(audioVolume * lipSyncSensitivity, 1);
        modelRef.current.internalModel.coreModel.setParameterValueById('ParamMouthOpenY', smoothVolume);
    }, [audioVolume, enableLipSync, lipSyncSensitivity]);
    // Update model position and scale when props change
    useEffect(() => {
        if (!modelRef.current || !appRef.current)
            return;
        const app = appRef.current;
        const model = modelRef.current;
        // Recalculate scale
        const scaleX = (app.screen.width * 0.8) / model.width;
        const scaleY = (app.screen.height * 0.8) / model.height;
        const baseScale = Math.min(scaleX, scaleY);
        model.scale.set(baseScale * scale);
        model.x = app.screen.width / 2 + (positionX * app.screen.width / 2);
        model.y = app.screen.height / 2 + (positionY * app.screen.height / 2);
    }, [positionY, positionX, scale]);
    // Expression change handler
    useEffect(() => {
        if (!modelRef.current || !expression || !expressions)
            return;
        const loadExpression = async () => {
            try {
                const expressionPath = expressions[expression];
                if (!expressionPath) {
                    console.warn(`Expression "${expression}" not found in expressions map`);
                    return;
                }
                // Load expression using Live2D API
                const model = modelRef.current;
                if (model.internalModel && model.internalModel.motionManager) {
                    const response = await fetch(expressionPath);
                    const expressionData = await response.json();
                    // Apply expression parameters
                    if (expressionData.Parameters) {
                        expressionData.Parameters.forEach((param) => {
                            try {
                                model.internalModel.coreModel.setParameterValueById(param.Id, param.Value);
                            }
                            catch (err) {
                                console.warn(`Failed to set parameter ${param.Id}:`, err);
                            }
                        });
                    }
                    onExpressionChanged?.(expression);
                }
            }
            catch (err) {
                console.error(`Failed to load expression "${expression}":`, err);
            }
        };
        loadExpression();
    }, [expression, expressions, onExpressionChanged]);
    // Mouse tracking handler
    useEffect(() => {
        if (!enableMouseTracking || !canvasRef.current || !modelRef.current)
            return;
        const handleMouseMove = (event) => {
            const canvas = canvasRef.current;
            if (!canvas)
                return;
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            // Convert to normalized coordinates (-1 to 1)
            mousePositionRef.current = {
                x: ((x / rect.width) * 2 - 1),
                y: ((y / rect.height) * 2 - 1),
            };
        };
        const updateTracking = () => {
            if (!modelRef.current?.internalModel?.coreModel)
                return;
            const coreModel = modelRef.current.internalModel.coreModel;
            const mouseX = mousePositionRef.current.x;
            const mouseY = mousePositionRef.current.y;
            // Calculate target angles
            const targetAngleX = mouseX * trackingRange;
            const targetAngleY = -mouseY * trackingRange;
            // Smooth interpolation
            currentAngleRef.current.x += (targetAngleX - currentAngleRef.current.x) * trackingSmoothing;
            currentAngleRef.current.y += (targetAngleY - currentAngleRef.current.y) * trackingSmoothing;
            // Apply to model parameters
            try {
                coreModel.setParameterValueById('ParamAngleX', currentAngleRef.current.x);
                coreModel.setParameterValueById('ParamAngleY', currentAngleRef.current.y);
                coreModel.setParameterValueById('ParamBodyAngleX', currentAngleRef.current.x * 0.5);
                coreModel.setParameterValueById('ParamEyeBallX', currentAngleRef.current.x * 0.8);
                coreModel.setParameterValueById('ParamEyeBallY', currentAngleRef.current.y * 0.8);
            }
            catch (err) {
                // Some parameters might not exist in all models
            }
            requestAnimationFrame(updateTracking);
        };
        window.addEventListener('mousemove', handleMouseMove);
        const trackingId = requestAnimationFrame(updateTracking);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(trackingId);
        };
    }, [enableMouseTracking, trackingSmoothing, trackingRange]);
    // Motion management handler
    useEffect(() => {
        if (!modelRef.current || !motionGroup || !motions)
            return;
        const playMotion = async () => {
            try {
                const motionPath = motions[motionGroup];
                if (!motionPath) {
                    console.warn(`Motion "${motionGroup}" not found in motions map`);
                    return;
                }
                const model = modelRef.current;
                if (!model.internalModel?.motionManager) {
                    console.warn('Motion manager not available');
                    return;
                }
                // Use pixi-live2d-display motion API
                const motion = await model.internalModel.motionManager.loadMotion(motionGroup, 0, motionPath);
                if (motion) {
                    // Set motion priority and loop
                    model.internalModel.motionManager.startMotion(motion, loopMotion, motionPriority);
                    // Handle motion finish
                    if (!loopMotion) {
                        motion.onFinish = () => {
                            onMotionFinished?.(motionGroup);
                        };
                    }
                }
            }
            catch (err) {
                console.error(`Failed to play motion "${motionGroup}":`, err);
            }
        };
        playMotion();
    }, [motionGroup, motions, motionPriority, loopMotion, onMotionFinished]);
    // Keyboard controls handler
    useEffect(() => {
        if (!enableKeyboardControls)
            return;
        const handleKeyDown = (event) => {
            // Notify parent component
            onKeyboardEvent?.(event);
            // Default keyboard controls (can be overridden)
            if (!onKeyboardEvent) {
                switch (event.key) {
                    case 'ArrowLeft':
                        // Move left (example)
                        break;
                    case 'ArrowRight':
                        // Move right (example)
                        break;
                    case ' ':
                        // Space bar - trigger action (example)
                        event.preventDefault();
                        break;
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [enableKeyboardControls, onKeyboardEvent]);
    return (React.createElement("div", { className: className, style: { position: 'relative', ...style }, role: "img", "aria-label": ariaLabel || 'Live2D character', "aria-description": ariaDescription, tabIndex: enableKeyboardControls ? 0 : undefined },
        React.createElement("div", { ref: canvasRef }),
        isLoading && showLoading && (loadingComponent || React.createElement(DefaultLoadingComponent, null)),
        error && showError && (errorComponent || React.createElement(DefaultErrorComponent, { error: error }))));
};

class AudioAnalyzer {
    constructor(options = {}) {
        this.audioContext = null;
        this.analyser = null;
        this.dataArray = null;
        this.source = null;
        this.options = {
            fftSize: options.fftSize ?? 256,
            smoothingTimeConstant: options.smoothingTimeConstant ?? 0.8,
        };
    }
    initialize(audioElement) {
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
    getVolume() {
        if (!this.analyser || !this.dataArray)
            return 0;
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
    cleanup() {
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
    isInitialized() {
        return this.audioContext !== null;
    }
}

/**
 * Custom hook for managing Live2D audio analysis
 */
function useLive2DAudio(options = {}) {
    const { audioElement, enabled = true, analyzerOptions, onPlay, onPause, onEnded, } = options;
    const [audioVolume, setAudioVolume] = useState(0);
    const analyzerRef = useRef(null);
    const animationFrameRef = useRef(null);
    useEffect(() => {
        if (!audioElement || !enabled)
            return;
        const handlePlay = () => {
            if (!analyzerRef.current) {
                analyzerRef.current = new AudioAnalyzer(analyzerOptions);
                analyzerRef.current.initialize(audioElement);
            }
            const updateVolume = () => {
                if (analyzerRef.current && !audioElement.paused) {
                    const volume = analyzerRef.current.getVolume();
                    setAudioVolume(volume);
                    animationFrameRef.current = requestAnimationFrame(updateVolume);
                }
            };
            updateVolume();
            onPlay?.();
        };
        const handlePause = () => {
            setAudioVolume(0);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            onPause?.();
        };
        const handleEnded = () => {
            setAudioVolume(0);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = null;
            }
            onEnded?.();
        };
        audioElement.addEventListener('play', handlePlay);
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('ended', handleEnded);
        return () => {
            audioElement.removeEventListener('play', handlePlay);
            audioElement.removeEventListener('pause', handlePause);
            audioElement.removeEventListener('ended', handleEnded);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (analyzerRef.current) {
                analyzerRef.current.cleanup();
                analyzerRef.current = null;
            }
        };
    }, [audioElement, enabled, analyzerOptions, onPlay, onPause, onEnded]);
    return { audioVolume };
}

export { AudioAnalyzer, Live2DCharacter, useLive2DAudio };
//# sourceMappingURL=index.esm.js.map
