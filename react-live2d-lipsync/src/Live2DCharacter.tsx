import React, { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DCharacterProps } from './types';

// Enable Live2D global mixins for PIXI
if (typeof window !== 'undefined') {
  (window as any).PIXI = PIXI;
}

// Dynamically import Live2D to avoid SSR issues
let Live2DModel: any = null;
if (typeof window !== 'undefined') {
  import('pixi-live2d-display').then((module) => {
    Live2DModel = module.Live2DModel;
  });
}

const DefaultLoadingComponent = () => (
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(240, 240, 240, 0.75)',
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #3b82f6',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 16px',
      }} />
      <p style={{ color: '#374151' }}>Loading Live2D model...</p>
    </div>
  </div>
);

const DefaultErrorComponent = ({ error }: { error: string }) => (
  <div style={{
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(254, 242, 242, 0.9)',
  }}>
    <div style={{ textAlign: 'center', padding: '24px' }}>
      <p style={{ color: '#dc2626', fontWeight: 600, marginBottom: '8px' }}>エラー</p>
      <p style={{ color: '#ef4444', fontSize: '14px' }}>{error}</p>
    </div>
  </div>
);

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
export const Live2DCharacter: React.FC<Live2DCharacterProps> = ({
  modelPath,
  audioVolume = 0,
  onModelLoaded,
  onModelError,
  positionY = 0,
  positionX = 0,
  scale = 1,
  width = 640,
  height = 960,
  backgroundColor = 0xf0f0f0,
  antialias = true,
  className = '',
  style = {},
  enableBlinking = true,
  blinkInterval = [2000, 6000],
  blinkDuration = 100,
  enableLipSync = true,
  lipSyncSensitivity = 1.5,
  showLoading = true,
  showError = true,
  loadingComponent,
  errorComponent,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<any>(null);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLive2D = async () => {
      if (!canvasRef.current) return;

      // Prevent multiple initializations
      if (appRef.current) return;

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
      if (typeof window !== 'undefined' && (!(window as any).Live2DCubismCore && !(window as any).Live2D)) {
        const checkSDK = setInterval(() => {
          if ((window as any).Live2DCubismCore || (window as any).Live2D) {
            clearInterval(checkSDK);
            initLive2D();
          }
        }, 100);
        return;
      }

      try {
        // Clear any existing content
        canvasRef.current.innerHTML = '';

        // Create PIXI Application
        const app = new PIXI.Application({
          width,
          height,
          backgroundColor,
          antialias,
        });

        appRef.current = app;
        canvasRef.current.appendChild(app.view as HTMLCanvasElement);

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

        setIsLoading(false);
        onModelLoaded?.();
      } catch (err) {
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
  }, [modelPath, width, height, backgroundColor, antialias, enableBlinking]);

  // Blinking animation
  const startBlinking = () => {
    const blink = () => {
      if (!modelRef.current?.internalModel?.coreModel) return;

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

  // Update mouth based on audio volume (lip-sync)
  useEffect(() => {
    if (!modelRef.current?.internalModel?.coreModel || !enableLipSync) return;

    const smoothVolume = Math.min(audioVolume * lipSyncSensitivity, 1);
    modelRef.current.internalModel.coreModel.setParameterValueById(
      'ParamMouthOpenY',
      smoothVolume
    );
  }, [audioVolume, enableLipSync, lipSyncSensitivity]);

  // Update model position and scale when props change
  useEffect(() => {
    if (!modelRef.current || !appRef.current) return;

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

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      <div ref={canvasRef} />

      {isLoading && showLoading && (
        loadingComponent || <DefaultLoadingComponent />
      )}

      {error && showError && (
        errorComponent || <DefaultErrorComponent error={error} />
      )}
    </div>
  );
};
