"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { AudioAnalyzer } from "@/lib/audioAnalyzer";

const Live2DModelComponent = dynamic(
  () => import("@/components/Live2DModel"),
  { ssr: false }
);

export default function Home() {
  const [text, setText] = useState("");
  const [audioVolume, setAudioVolume] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelPath, setModelPath] = useState("/models/haru/haru_greeter_t03.model3.json");

  const audioRef = useRef<HTMLAudioElement>(null);
  const analyzerRef = useRef<AudioAnalyzer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleTextToSpeech = async () => {
    if (!text.trim()) {
      setError("テキストを入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS API request failed");
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => {
      if (!analyzerRef.current) {
        analyzerRef.current = new AudioAnalyzer();
        analyzerRef.current.initialize(audio);
      }

      const updateVolume = () => {
        if (analyzerRef.current && !audio.paused) {
          const volume = analyzerRef.current.getVolume();
          setAudioVolume(volume);
          animationFrameRef.current = requestAnimationFrame(updateVolume);
        }
      };

      updateVolume();
    };

    const handlePause = () => {
      setAudioVolume(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handlePause);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handlePause);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (analyzerRef.current) {
        analyzerRef.current.cleanup();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">
          Live2D リップシンク & まばたきアプリ
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Live2D Model Display */}
          <div className="flex justify-center">
            <Live2DModelComponent
              modelPath={modelPath}
              audioVolume={audioVolume}
            />
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
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
                <option value="/models/haru/haru_greeter_t03.model3.json">
                  Haru (デフォルト)
                </option>
              </select>
              <p className="mt-2 text-sm text-gray-600">
                Live2Dモデルを/public/modelsに配置してください
              </p>
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
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>テキストを入力して「音声を生成して再生」ボタンをクリック</li>
            <li>または音声ファイルをアップロードして再生</li>
            <li>Live2Dモデルが音声に合わせてリップシンクとまばたきを行います</li>
            <li>環境変数にGOOGLE_TTS_API_KEYを設定してください</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
