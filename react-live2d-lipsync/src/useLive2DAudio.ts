import { useEffect, useRef, useState } from 'react';
import { AudioAnalyzer } from './AudioAnalyzer';
import { UseLive2DAudioOptions } from './types';

/**
 * Custom hook for managing Live2D audio analysis
 */
export function useLive2DAudio(options: UseLive2DAudioOptions = {}) {
  const {
    audioElement,
    enabled = true,
    analyzerOptions,
    onPlay,
    onPause,
    onEnded,
  } = options;

  const [audioVolume, setAudioVolume] = useState(0);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!audioElement || !enabled) return;

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
