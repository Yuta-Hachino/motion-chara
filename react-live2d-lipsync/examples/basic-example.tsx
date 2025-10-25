/**
 * Basic Example
 *
 * This example shows the simplest way to use the Live2DCharacter component
 * with audio file playback.
 */

import React, { useRef } from 'react';
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

export default function BasicExample() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
      <h1>Basic Live2D Example</h1>

      <Live2DCharacter
        modelPath="/models/character.model3.json"
        audioVolume={audioVolume}
      />

      <audio ref={audioRef} src="/audio/sample.mp3" controls />
    </div>
  );
}
