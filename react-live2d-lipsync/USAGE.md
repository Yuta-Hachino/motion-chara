# Usage Guide - react-live2d-lipsync

## Quick Start Guide

### 1. Installation

```bash
npm install react-live2d-lipsync
```

### 2. Add Live2D SDK Scripts

Add these to your HTML (e.g., `public/index.html` or `app/layout.tsx` for Next.js):

```html
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>
<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
```

### 3. Basic Implementation

```tsx
import React, { useRef } from 'react';
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  return (
    <>
      <Live2DCharacter
        modelPath="/live2d/model.model3.json"
        audioVolume={audioVolume}
      />
      <audio ref={audioRef} src="/audio/speech.mp3" controls />
    </>
  );
}
```

## Common Use Cases

### File Upload for Audio

```tsx
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  if (audioRef.current) {
    audioRef.current.src = url;
    audioRef.current.play();
  }
};

return (
  <>
    <Live2DCharacter modelPath="/model.model3.json" audioVolume={audioVolume} />
    <input type="file" accept="audio/*" onChange={handleFileUpload} />
    <audio ref={audioRef} hidden />
  </>
);
```

### Text-to-Speech Integration

```tsx
const handleTTS = async (text: string) => {
  const response = await fetch('/api/tts', {
    method: 'POST',
    body: JSON.stringify({ text }),
    headers: { 'Content-Type': 'application/json' },
  });

  const { audioContent } = await response.json();

  // Convert base64 to audio blob
  const audioBlob = new Blob(
    [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
    { type: 'audio/mp3' }
  );

  const url = URL.createObjectURL(audioBlob);
  if (audioRef.current) {
    audioRef.current.src = url;
    audioRef.current.play();
  }
};
```

### Microphone Input (Real-time)

```tsx
import { useState, useRef, useEffect } from 'react';
import { Live2DCharacter, AudioAnalyzer } from 'react-live2d-lipsync';

function MicrophoneExample() {
  const [audioVolume, setAudioVolume] = useState(0);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream;

    const startMicrophone = async () => {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(mediaStream);

      analyzerRef.current = new AudioAnalyzer();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((a, b) => a + b, 0);
        const average = sum / dataArray.length;
        setAudioVolume(average / 255);
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    };

    startMicrophone();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return <Live2DCharacter modelPath="/model.model3.json" audioVolume={audioVolume} />;
}
```

## Customization Examples

### Adjust Character Position

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  positionY={-0.5}  // Move to top half
  positionX={0.2}   // Move slightly right
/>
```

### Change Size

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  scale={1.5}  // 150% size
  width={800}
  height={1200}
/>
```

### Custom Styling

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  className="my-character"
  style={{
    border: '4px solid #333',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
  }}
  backgroundColor={0x1a1a1a}  // Dark background
/>
```

### Disable Features

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  enableBlinking={false}  // No blinking
  enableLipSync={false}   // No lip-sync
/>
```

### Custom Blink Timing

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  blinkInterval={[5000, 10000]}  // Blink every 5-10 seconds
  blinkDuration={200}            // Slower blink (200ms)
/>
```

## Integration Patterns

### With State Management (Redux)

```tsx
import { useSelector } from 'react-redux';

function CharacterWithRedux() {
  const audioVolume = useSelector(state => state.audio.volume);
  const modelPath = useSelector(state => state.character.modelPath);

  return (
    <Live2DCharacter
      modelPath={modelPath}
      audioVolume={audioVolume}
    />
  );
}
```

### Multiple Characters

```tsx
function MultipleCharacters() {
  const audio1Ref = useRef<HTMLAudioElement>(null);
  const audio2Ref = useRef<HTMLAudioElement>(null);

  const { audioVolume: volume1 } = useLive2DAudio({ audioElement: audio1Ref.current });
  const { audioVolume: volume2 } = useLive2DAudio({ audioElement: audio2Ref.current });

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Live2DCharacter modelPath="/character1.model3.json" audioVolume={volume1} />
      <Live2DCharacter modelPath="/character2.model3.json" audioVolume={volume2} />

      <audio ref={audio1Ref} src="/audio1.mp3" />
      <audio ref={audio2Ref} src="/audio2.mp3" />
    </div>
  );
}
```

### Responsive Design

```tsx
import { useState, useEffect } from 'react';

function ResponsiveCharacter() {
  const [dimensions, setDimensions] = useState({ width: 640, height: 960 });

  useEffect(() => {
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      setDimensions({
        width: isMobile ? 320 : 640,
        height: isMobile ? 480 : 960,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <Live2DCharacter
      modelPath="/model.model3.json"
      audioVolume={audioVolume}
      width={dimensions.width}
      height={dimensions.height}
      scale={window.innerWidth < 768 ? 0.8 : 1.2}
    />
  );
}
```

## Performance Tips

1. **Lazy Loading**: Use dynamic imports for better initial load time

```tsx
const Live2DCharacter = dynamic(
  () => import('react-live2d-lipsync').then(mod => mod.Live2DCharacter),
  { ssr: false }
);
```

2. **Memory Management**: Clean up audio URLs

```tsx
useEffect(() => {
  return () => {
    if (audioRef.current?.src) {
      URL.revokeObjectURL(audioRef.current.src);
    }
  };
}, []);
```

3. **Debounce Controls**: Debounce slider updates

```tsx
import { useMemo } from 'react';
import { debounce } from 'lodash';

const debouncedSetPosition = useMemo(
  () => debounce(setPositionY, 100),
  []
);
```

## Troubleshooting

### Character not appearing?
- Check that Live2D SDK scripts are loaded
- Verify model path is correct
- Check browser console for errors

### Lip-sync not working?
- Ensure `audioVolume` is being updated
- Check that audio is actually playing
- Verify `enableLipSync` is `true`

### Performance issues?
- Reduce canvas size (width/height)
- Disable antialiasing
- Use only one character per page

## NPM Publishing

To publish this package to NPM:

```bash
cd react-live2d-lipsync

# Login to NPM
npm login

# Publish
npm publish
```

For scoped packages:

```bash
npm publish --access public
```
