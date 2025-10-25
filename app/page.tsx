"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useLive2DAudio } from "react-live2d-lipsync";

// Live2DCharacterをdynamic importでSSRを無効化
const Live2DCharacter = dynamic(
  () => import("react-live2d-lipsync").then((mod) => mod.Live2DCharacter),
  { ssr: false }
);

export default function Home() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelPath, setModelPath] = useState(`${basePath}/live2d/lan/lan.model3.json`);
  const [positionY, setPositionY] = useState(-0.3);
  const [modelScale, setModelScale] = useState(1.0);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("#f3e5f5");

  // v1.1.0 新機能の状態
  const [enableBreathing, setEnableBreathing] = useState(true);
  const [breathingSpeed, setBreathingSpeed] = useState(1.0);
  const [breathingIntensity, setBreathingIntensity] = useState(0.5);
  const [enableMouseTracking, setEnableMouseTracking] = useState(false);
  const [trackingSmoothing, setTrackingSmoothing] = useState(0.1);
  const [trackingRange, setTrackingRange] = useState(30);
  const [fps, setFps] = useState(60);
  const [resolution, setResolution] = useState(1);
  const [autoQuality, setAutoQuality] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // パッケージのuseLive2DAudioフックを使用
  const { audioVolume } = useLive2DAudio({
    audioElement: audioRef.current,
  });

  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      setError("テキストを入力してください");
      return;
    }

    if (!apiKey.trim()) {
      setError("Google TTS API キーを入力してください");
      setShowApiKeyInput(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            input: { text },
            voice: {
              languageCode: "ja-JP",
              name: "ja-JP-Neural2-B",
              ssmlGender: "FEMALE",
            },
            audioConfig: {
              audioEncoding: "MP3",
              speakingRate: 1.0,
              pitch: 0.0,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "TTS API request failed");
      }

      const { audioContent } = await response.json();
      const audioBlob = new Blob(
        [Uint8Array.from(atob(audioContent), (c) => c.charCodeAt(0))],
        { type: "audio/mp3" }
      );

      const audioUrl = URL.createObjectURL(audioBlob);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("TTS error:", err);
      setError(`音声生成エラー: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const audioUrl = URL.createObjectURL(file);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setBackgroundImage(imageUrl);
  };

  const clearBackgroundImage = () => {
    if (backgroundImage) {
      URL.revokeObjectURL(backgroundImage);
    }
    setBackgroundImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          Live2D リップシンク & まばたきアプリ
        </h1>

        <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            📦 <strong>このアプリは react-live2d-lipsync パッケージを使用しています</strong>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            パッケージのインストール: <code className="bg-blue-100 px-2 py-1 rounded">npm install Yuta-Hachino/react-live2d-lipsync#v1.1.0</code>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live2D Model Display */}
          <div
            className="flex justify-center rounded-lg overflow-hidden shadow-lg"
            style={{
              backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            <Live2DCharacter
              modelPath={modelPath}
              audioVolume={audioVolume}
              positionY={positionY}
              scale={modelScale}
              width={640}
              height={960}
              enableBlinking={true}
              enableLipSync={true}
              lipSyncSensitivity={1.5}
              // v1.1.0 新機能
              enableBreathing={enableBreathing}
              breathingSpeed={breathingSpeed}
              breathingIntensity={breathingIntensity}
              enableMouseTracking={enableMouseTracking}
              trackingSmoothing={trackingSmoothing}
              trackingRange={trackingRange}
              fps={fps}
              resolution={resolution}
              autoQuality={autoQuality}
              ariaLabel="Live2D キャラクター - 音声に合わせてリップシンクとまばたきを行います"
            />
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            {/* API Key Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  API設定
                </h2>
                <button
                  onClick={() => setShowApiKeyInput(!showApiKeyInput)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showApiKeyInput ? "非表示" : "表示"}
                </button>
              </div>
              {showApiKeyInput && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google TTS API キー
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-gray-600">
                    APIキーは{" "}
                    <a
                      href="https://console.cloud.google.com/apis/credentials"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Google Cloud Console
                    </a>{" "}
                    から取得できます。ブラウザに保存されず、安全です。
                  </p>
                </div>
              )}
              {!showApiKeyInput && !apiKey && (
                <p className="text-sm text-orange-600">
                  テキスト読み上げ機能を使用するには、APIキーを設定してください
                </p>
              )}
            </div>

            {/* Text Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                テキスト入力
              </h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="日本語テキストを入力してください..."
                className="w-full h-32 p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
              />
              <button
                onClick={handleTextToSpeech}
                disabled={isLoading || !text.trim()}
                className="mt-4 w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                {isLoading ? "音声生成中..." : "音声を生成して再生"}
              </button>
            </div>

            {/* Audio File Upload Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                音声ファイルアップロード
              </h2>
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioFileUpload}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              />
              <p className="mt-2 text-sm text-gray-600">
                MP3, WAV, OGGなどの音声ファイルをアップロード
              </p>
            </div>

            {/* Model Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                モデル選択
              </h2>
              <select
                value={modelPath}
                onChange={(e) => setModelPath(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option value={`${basePath}/live2d/lan/lan.model3.json`}>
                  Lan (デフォルト)
                </option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Live2Dモデルを/public/live2dに配置してください
              </p>
            </div>

            {/* Position & Scale Controls */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                モデル調整
              </h2>

              {/* Position Y Slider */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  縦位置: {positionY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.05"
                  value={positionY}
                  onChange={(e) => setPositionY(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>上</span>
                  <span>中央</span>
                  <span>下</span>
                </div>
              </div>

              {/* Scale Slider */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  サイズ: {modelScale.toFixed(2)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={modelScale}
                  onChange={(e) => setModelScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>小</span>
                  <span>通常</span>
                  <span>大</span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setPositionY(-0.3);
                  setModelScale(1.0);
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                デフォルトに戻す
              </button>
            </div>

            {/* Background Settings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                背景設定
              </h2>

              {/* Background Color */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  背景色
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="h-10 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    placeholder="#f3e5f5"
                  />
                </div>
              </div>

              {/* Background Image Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  背景画像
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBackgroundImageUpload}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                />
                {backgroundImage && (
                  <button
                    onClick={clearBackgroundImage}
                    className="mt-2 w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    背景画像をクリア
                  </button>
                )}
                <p className="mt-2 text-xs text-gray-600">
                  JPG, PNG, GIFなどの画像ファイルをアップロード
                </p>
              </div>

              {/* Reset Background */}
              <button
                onClick={() => {
                  clearBackgroundImage();
                  setBackgroundColor("#f3e5f5");
                }}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
              >
                背景をリセット
              </button>
            </div>

            {/* NEW: Breathing Animation Settings (v1.1.0) */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg shadow-lg p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  💨 呼吸アニメーション
                </h2>
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">v1.1.0</span>
              </div>

              {/* Enable Breathing Toggle */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableBreathing}
                    onChange={(e) => setEnableBreathing(e.target.checked)}
                    className="mr-2 h-5 w-5 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">呼吸を有効化</span>
                </label>
              </div>

              {enableBreathing && (
                <>
                  {/* Breathing Speed */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      呼吸速度: {breathingSpeed.toFixed(1)}x
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={breathingSpeed}
                      onChange={(e) => setBreathingSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Breathing Intensity */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      呼吸強度: {breathingIntensity.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={breathingIntensity}
                      onChange={(e) => setBreathingIntensity(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            {/* NEW: Mouse Tracking Settings (v1.1.0) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  🖱️ マウストラッキング
                </h2>
                <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">v1.1.0</span>
              </div>

              {/* Enable Mouse Tracking Toggle */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableMouseTracking}
                    onChange={(e) => setEnableMouseTracking(e.target.checked)}
                    className="mr-2 h-5 w-5 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">マウストラッキングを有効化</span>
                </label>
                <p className="mt-1 text-xs text-gray-600">キャラクターがカーソルを追いかけます</p>
              </div>

              {enableMouseTracking && (
                <>
                  {/* Tracking Smoothing */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      スムージング: {trackingSmoothing.toFixed(2)}
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.5"
                      step="0.01"
                      value={trackingSmoothing}
                      onChange={(e) => setTrackingSmoothing(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>滑らか</span>
                      <span>反応速い</span>
                    </div>
                  </div>

                  {/* Tracking Range */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      追従範囲: {trackingRange}°
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="60"
                      step="5"
                      value={trackingRange}
                      onChange={(e) => setTrackingRange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </>
              )}
            </div>

            {/* NEW: Performance Settings (v1.1.0) */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg shadow-lg p-6 border-2 border-orange-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  ⚡ パフォーマンス設定
                </h2>
                <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">v1.1.0</span>
              </div>

              {/* FPS Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FPS制限: {fps}
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  step="15"
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>省電力</span>
                  <span>滑らか</span>
                </div>
              </div>

              {/* Resolution Control */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  解像度: {(resolution * 100).toFixed(0)}%
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.1"
                  value={resolution}
                  onChange={(e) => setResolution(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>軽量</span>
                  <span>高品質</span>
                </div>
              </div>

              {/* Auto Quality */}
              <div className="mb-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoQuality}
                    onChange={(e) => setAutoQuality(e.target.checked)}
                    className="mr-2 h-5 w-5 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">自動品質調整</span>
                </label>
                <p className="mt-1 text-xs text-gray-600">パフォーマンスに応じて自動で品質を調整</p>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4">
                <p className="text-red-700 font-semibold">{error}</p>
              </div>
            )}

            {/* Audio Element */}
            <audio ref={audioRef} className="hidden" />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">使い方</h2>
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>
              <strong>テキスト読み上げを使う場合:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                <li>API設定セクションで「表示」をクリック</li>
                <li>Google TTS APIキーを入力（<a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Cloud Consoleから取得</a>）</li>
                <li>テキストを入力して「音声を生成して再生」ボタンをクリック</li>
              </ul>
            </li>
            <li>
              <strong>音声ファイルを使う場合:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                <li>音声ファイル（MP3/WAV/OGG）をアップロードして再生</li>
                <li>APIキー不要で簡単に試せます</li>
              </ul>
            </li>
            <li>
              <strong>カスタマイズ:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                <li>モデル調整: キャラクターの位置とサイズを調整</li>
                <li>背景設定: 背景色や背景画像を自由に設定</li>
                <li>モデル選択: 異なるLive2Dモデルを選択（追加可能）</li>
              </ul>
            </li>
            <li>Live2Dモデルが音声に合わせてリップシンクとまばたきを行います</li>
          </ol>
        </div>

        {/* Package Info */}
        <div className="mt-8 bg-gray-50 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">パッケージ情報</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>パッケージ名:</strong> react-live2d-lipsync</p>
            <p><strong>バージョン:</strong> 1.1.0</p>
            <p><strong>リポジトリ:</strong> <a href="https://github.com/Yuta-Hachino/react-live2d-lipsync" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Yuta-Hachino/react-live2d-lipsync</a></p>
            <p><strong>インストール:</strong> <code className="bg-gray-200 px-2 py-1 rounded text-xs">npm install Yuta-Hachino/react-live2d-lipsync#v1.1.0</code></p>
            <p className="mt-2"><strong>新機能 (v1.1.0):</strong> 呼吸アニメーション、マウストラッキング、パフォーマンス最適化</p>
          </div>
        </div>
      </div>
    </div>
  );
}
