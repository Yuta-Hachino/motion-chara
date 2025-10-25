# react-live2d-lipsync

A React component library for displaying Live2D models with lip-sync and blinking animations.

## Features

- 🎭 **Live2D Integration** - Display Live2D Cubism 2 and 3 models
- 🎤 **Lip-Sync Animation** - Real-time mouth movements synced to audio
- 👁️ **Automatic Blinking** - Natural blinking animations
- ⚙️ **Highly Configurable** - Extensive customization options
- 📦 **TypeScript Support** - Full type definitions included
- 🪝 **React Hooks** - Custom hooks for audio analysis
- 🎨 **Customizable UI** - Custom loading and error components

## Installation

### From NPM (When published)

```bash
npm install react-live2d-lipsync
```

### From GitHub (Without NPM publishing)

```bash
# Latest version
npm install Yuta-Hachino/react-live2d-lipsync

# Specific version (tag)
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0

# In package.json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#v1.0.0"
  }
}
```

See [INSTALL_FROM_GITHUB.md](./INSTALL_FROM_GITHUB.md) for detailed instructions.

### Peer Dependencies

This package requires the following peer dependencies:

```bash
npm install react react-dom
```

### Live2D SDK Setup

You need to include the Live2D Cubism SDK in your HTML file. Add these script tags to your `index.html` or layout:

```html
<!-- Live2D Cubism 2 SDK -->
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>

<!-- Live2D Cubism 3+ SDK -->
<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
```

## Basic Usage

```tsx
import React, { useState } from 'react';
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

function App() {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  return (
    <div>
      <Live2DCharacter
        modelPath="/models/character.model3.json"
        audioVolume={audioVolume}
        width={640}
        height={960}
      />

      <audio ref={audioRef} src="/audio/speech.mp3" controls />
    </div>
  );
}
```

## Advanced Usage

### Custom Position and Scale

```tsx
<Live2DCharacter
  modelPath="/models/character.model3.json"
  audioVolume={audioVolume}
  positionY={-0.3}  // Move up slightly
  positionX={0.1}   // Move right slightly
  scale={1.2}       // Scale to 120%
/>
```

### Custom Blinking Settings

```tsx
<Live2DCharacter
  modelPath="/models/character.model3.json"
  audioVolume={audioVolume}
  enableBlinking={true}
  blinkInterval={[3000, 5000]}  // Blink every 3-5 seconds
  blinkDuration={150}           // Blink lasts 150ms
/>
```

### Custom Loading and Error Components

```tsx
<Live2DCharacter
  modelPath="/models/character.model3.json"
  audioVolume={audioVolume}
  loadingComponent={
    <div>Loading your character...</div>
  }
  errorComponent={
    <div>Failed to load character</div>
  }
/>
```

### Using Audio Hook with Options

```tsx
const { audioVolume } = useLive2DAudio({
  audioElement: audioRef.current,
  enabled: true,
  analyzerOptions: {
    fftSize: 512,
    smoothingTimeConstant: 0.9,
  },
  onPlay: () => console.log('Audio started'),
  onPause: () => console.log('Audio paused'),
  onEnded: () => console.log('Audio ended'),
});
```

## API Reference

### Live2DCharacter Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelPath` | `string` | **required** | Path to the Live2D model file |
| `audioVolume` | `number` | `0` | Audio volume (0-1) for lip-sync |
| `onModelLoaded` | `() => void` | - | Callback when model loads |
| `onModelError` | `(error: Error) => void` | - | Callback on load error |
| `positionY` | `number` | `0` | Vertical position (-1 to 1) |
| `positionX` | `number` | `0` | Horizontal position (-1 to 1) |
| `scale` | `number` | `1` | Scale multiplier |
| `width` | `number` | `640` | Canvas width in pixels |
| `height` | `number` | `960` | Canvas height in pixels |
| `backgroundColor` | `number` | `0xf0f0f0` | Background color (hex) |
| `antialias` | `boolean` | `true` | Enable antialiasing |
| `className` | `string` | `''` | CSS class name |
| `style` | `React.CSSProperties` | `{}` | Inline styles |
| `enableBlinking` | `boolean` | `true` | Enable blinking animation |
| `blinkInterval` | `[number, number]` | `[2000, 6000]` | Blink interval range (ms) |
| `blinkDuration` | `number` | `100` | Blink duration (ms) |
| `enableLipSync` | `boolean` | `true` | Enable lip-sync animation |
| `lipSyncSensitivity` | `number` | `1.5` | Lip-sync sensitivity multiplier |
| `showLoading` | `boolean` | `true` | Show loading indicator |
| `showError` | `boolean` | `true` | Show error messages |
| `loadingComponent` | `React.ReactNode` | - | Custom loading component |
| `errorComponent` | `React.ReactNode` | - | Custom error component |

### useLive2DAudio Hook

```tsx
const { audioVolume } = useLive2DAudio(options);
```

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `audioElement` | `HTMLAudioElement \| null` | - | Audio element to analyze |
| `enabled` | `boolean` | `true` | Enable audio analysis |
| `analyzerOptions` | `AudioAnalyzerOptions` | - | Analyzer configuration |
| `onPlay` | `() => void` | - | Callback on play |
| `onPause` | `() => void` | - | Callback on pause |
| `onEnded` | `() => void` | - | Callback on end |

**Returns:**

- `audioVolume`: `number` - Current audio volume (0-1)

### AudioAnalyzer Class

```tsx
import { AudioAnalyzer } from 'react-live2d-lipsync';

const analyzer = new AudioAnalyzer({
  fftSize: 256,
  smoothingTimeConstant: 0.8,
});

analyzer.initialize(audioElement);
const volume = analyzer.getVolume();
analyzer.cleanup();
```

## Complete Example with Text-to-Speech

```tsx
import React, { useState, useRef } from 'react';
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

function App() {
  const [text, setText] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  const handleSpeak = async () => {
    // Call your TTS API
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const { audioContent } = await response.json();
    const audioBlob = new Blob(
      [Uint8Array.from(atob(audioContent), c => c.charCodeAt(0))],
      { type: 'audio/mp3' }
    );

    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem' }}>
      <Live2DCharacter
        modelPath="/models/character.model3.json"
        audioVolume={audioVolume}
        positionY={-0.3}
        scale={1.2}
      />

      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text..."
          rows={4}
        />
        <button onClick={handleSpeak}>Speak</button>
        <audio ref={audioRef} hidden />
      </div>
    </div>
  );
}

export default App;
```

## Next.js Setup

For Next.js applications, you'll need to handle client-side rendering:

### 1. Add SDK scripts to `app/layout.tsx`:

```tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <Script
          src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Use dynamic import in your page:

```tsx
'use client';

import dynamic from 'next/dynamic';

const Live2DCharacter = dynamic(
  () => import('react-live2d-lipsync').then(mod => mod.Live2DCharacter),
  { ssr: false }
);

export default function Page() {
  // Your component code
}
```

## Browser Support

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Supported

## Model Requirements

Your Live2D models must include the following parameters for full functionality:

- `ParamMouthOpenY` - For lip-sync
- `ParamEyeLOpen` - For left eye blinking
- `ParamEyeROpen` - For right eye blinking

## Troubleshooting

### Model not loading

1. Ensure Live2D SDK scripts are loaded before the component
2. Check that the model path is correct and accessible
3. Verify the model format is compatible (Cubism 2 or 3)

### Lip-sync not working

1. Ensure `audioVolume` prop is being updated
2. Check that `enableLipSync` is `true`
3. Verify the audio is actually playing

### Build errors

If you encounter build errors with Pixi.js or Live2D libraries, try:

```js
// next.config.js
module.exports = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};
```

## Development Scripts

This package includes comprehensive NPM scripts for development, testing, and publishing:

```bash
# Development
npm run dev              # Watch mode
npm run build            # Build package
npm run rebuild          # Clean and rebuild
npm run typecheck        # Type checking only
npm run validate         # Type check + build

# Publishing
npm run publish:patch    # Publish patch version (1.0.0 → 1.0.1)
npm run publish:minor    # Publish minor version (1.0.0 → 1.1.0)
npm run publish:major    # Publish major version (1.0.0 → 2.0.0)
npm run publish:beta     # Publish beta version
npm run publish:dry      # Dry run (test without publishing)

# Local Testing
npm run pack:local       # Create .tgz package
npm run link:local       # Create local symlink
npm run info             # Show package info
```

For detailed script documentation, see [SCRIPTS.md](./SCRIPTS.md).

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Credits

- Built with [Pixi.js](https://pixijs.com/)
- Uses [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- Live2D Cubism SDK by [Live2D Inc.](https://www.live2d.com/)
