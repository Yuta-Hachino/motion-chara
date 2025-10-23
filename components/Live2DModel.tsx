"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";

// Enable Live2D global mixins for PIXI
if (typeof window !== "undefined") {
  (window as any).PIXI = PIXI;
}

interface Live2DModelProps {
  modelPath: string;
  audioVolume: number; // 0-1 range
  onModelLoaded?: () => void;
}

export default function Live2DModelComponent({
  modelPath,
  audioVolume,
  onModelLoaded,
}: Live2DModelProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initLive2D = async () => {
      if (!canvasRef.current) return;

      try {
        // Create PIXI Application
        const app = new PIXI.Application({
          width: 640,
          height: 960,
          backgroundColor: 0xf0f0f0,
          antialias: true,
        });

        await app.init();
        appRef.current = app;
        canvasRef.current.appendChild(app.view as HTMLCanvasElement);

        // Load Live2D model
        const model = await Live2DModel.from(modelPath);
        modelRef.current = model;

        // Scale and position model
        const scaleX = app.screen.width * 0.8 / model.width;
        const scaleY = app.screen.height * 0.8 / model.height;
        const scale = Math.min(scaleX, scaleY);

        model.scale.set(scale);
        model.x = app.screen.width / 2;
        model.y = app.screen.height / 2;
        model.anchor.set(0.5, 0.5);

        app.stage.addChild(model);

        // Initialize parameters
        if (model.internalModel && model.internalModel.coreModel) {
          model.internalModel.coreModel.setParameterValueById("ParamMouthOpenY", 0);
          model.internalModel.coreModel.setParameterValueById("ParamEyeLOpen", 1);
          model.internalModel.coreModel.setParameterValueById("ParamEyeROpen", 1);
        }

        // Start blinking animation
        startBlinking();

        setIsLoading(false);
        onModelLoaded?.();
      } catch (err) {
        console.error("Failed to load Live2D model:", err);
        setError(`モデル読み込みエラー: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    initLive2D();

    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
      if (appRef.current) {
        appRef.current.destroy(true);
      }
    };
  }, [modelPath, onModelLoaded]);

  // Blinking animation (2-6 seconds interval)
  const startBlinking = () => {
    const blink = () => {
      if (!modelRef.current?.internalModel?.coreModel) return;

      const coreModel = modelRef.current.internalModel.coreModel;

      // Close eyes
      coreModel.setParameterValueById("ParamEyeLOpen", 0);
      coreModel.setParameterValueById("ParamEyeROpen", 0);

      // Open eyes after 100-120ms
      setTimeout(() => {
        if (coreModel) {
          coreModel.setParameterValueById("ParamEyeLOpen", 1);
          coreModel.setParameterValueById("ParamEyeROpen", 1);
        }
      }, 100 + Math.random() * 20);

      // Schedule next blink
      blinkTimerRef.current = setTimeout(blink, 2000 + Math.random() * 4000);
    };

    blink();
  };

  // Update mouth based on audio volume
  useEffect(() => {
    if (!modelRef.current?.internalModel?.coreModel) return;

    const smoothVolume = Math.min(audioVolume * 1.5, 1); // Amplify a bit
    modelRef.current.internalModel.coreModel.setParameterValueById(
      "ParamMouthOpenY",
      smoothVolume
    );
  }, [audioVolume]);

  return (
    <div className="relative">
      <div ref={canvasRef} className="border-4 border-gray-300 rounded-lg shadow-lg" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-700">Loading Live2D model...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90">
          <div className="text-center p-6">
            <p className="text-red-600 font-semibold mb-2">エラー</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
