/**
 * Advanced Example
 *
 * This example demonstrates:
 * - Text-to-Speech integration
 * - Custom position and scale controls
 * - Custom styling
 * - Error handling
 */

import React, { useState, useRef } from 'react';
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

export default function AdvancedExample() {
  const [text, setText] = useState('こんにちは！Live2Dキャラクターです。');
  const [positionY, setPositionY] = useState(-0.3);
  const [scale, setScale] = useState(1.2);
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({
    audioElement: audioRef.current,
    onPlay: () => console.log('Audio started'),
    onEnded: () => console.log('Audio ended'),
  });

  const handleTextToSpeech = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error('TTS API request failed');

      const { audioContent } = await response.json();
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
        { type: 'audio/mp3' }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('TTS error:', error);
      alert('音声生成に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '2rem', padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Character Display */}
      <div style={{ flex: 1 }}>
        <Live2DCharacter
          modelPath="/models/character.model3.json"
          audioVolume={audioVolume}
          positionY={positionY}
          scale={scale}
          width={640}
          height={960}
          backgroundColor={0xffffff}
          enableBlinking={true}
          blinkInterval={[2000, 5000]}
          lipSyncSensitivity={1.5}
          onModelLoaded={() => console.log('Model loaded')}
          onModelError={(error) => console.error('Model error:', error)}
          style={{
            border: '2px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        />
      </div>

      {/* Control Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h2>Live2D Control Panel</h2>

        {/* Text Input */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            テキスト入力
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="日本語テキストを入力..."
            rows={4}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #ddd',
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'inherit',
            }}
          />
          <button
            onClick={handleTextToSpeech}
            disabled={isLoading || !text.trim()}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#ccc' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? '音声生成中...' : '音声を生成して再生'}
          </button>
        </div>

        {/* Position Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            縦位置: {positionY.toFixed(2)}
          </label>
          <input
            type="range"
            min="-1"
            max="1"
            step="0.05"
            value={positionY}
            onChange={(e) => setPositionY(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>上</span>
            <span>中央</span>
            <span>下</span>
          </div>
        </div>

        {/* Scale Control */}
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
            サイズ: {scale.toFixed(2)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666' }}>
            <span>小</span>
            <span>通常</span>
            <span>大</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          onClick={() => {
            setPositionY(-0.3);
            setScale(1.2);
          }}
          style={{
            padding: '0.5rem',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          デフォルトに戻す
        </button>

        {/* Audio Element */}
        <audio ref={audioRef} style={{ width: '100%' }} />
      </div>
    </div>
  );
}
