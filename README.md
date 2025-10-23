# Live2D リップシンク & まばたきアプリ

Google Text-to-Speech または日本語テキスト入力を使用して、Live2D モデルをリアルタイムでリップシンク＋まばたきさせる Web アプリケーションです。

## 機能

- **テキスト入力**: 日本語テキストを入力し、Google TTS で音声を生成
- **音声ファイル対応**: MP3/WAV/OGG などの音声ファイルをアップロード
- **リアルタイムリップシンク**: Web Audio API で音量を解析し、Live2D モデルの口を動かす
- **自動まばたき**: 2〜6秒間隔でランダムにまばたき（100-120ms持続）
- **Live2D Cubism SDK**: pixi-live2d-display を使用した本格的なキャラクターアニメーション
- **Docker 対応**: コンテナ化された環境で簡単にデプロイ可能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Live2D**: pixi-live2d-display v0.4.0 + Pixi.js v7.4.2
- **音声解析**: Web Audio API (AnalyserNode)
- **TTS**: Google Cloud Text-to-Speech API
- **コンテナ**: Docker + Docker Compose

## セットアップ

### 前提条件

- Node.js 20以上
- Docker & Docker Compose（オプション）
- Google Cloud Text-to-Speech API キー

### 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成:

```bash
GOOGLE_TTS_API_KEY=your_api_key_here
```

### インストール & 実行

#### ローカル環境

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

#### Docker環境

```bash
# ビルド & 起動
docker-compose up --build

# バックグラウンド実行
docker-compose up -d

# 停止
docker-compose down
```

### Live2D モデルの配置

1. Live2D Cubism モデルを `public/models/` に配置
2. デフォルトパス: `/models/haru/haru_greeter_t03.model3.json`

例:
```
public/
└── models/
    └── haru/
        ├── haru_greeter_t03.model3.json
        ├── haru_greeter_t03.moc3
        ├── haru_greeter_t03.physics3.json
        └── textures/
            └── texture_00.png
```

## 使い方

1. **テキスト入力方式**:
   - テキストエリアに日本語を入力
   - 「音声を生成して再生」ボタンをクリック
   - Google TTS で音声が生成され、自動再生

2. **音声ファイル方式**:
   - 「音声ファイルアップロード」セクションでファイルを選択
   - 音声が自動再生され、リップシンク開始

3. **モデル選択**:
   - ドロップダウンから Live2D モデルを選択（カスタムモデル追加可能）

## 仕組み

### リップシンク

- Web Audio API の `AnalyserNode` で音声の周波数データを取得
- リアルタイムで音量（0-1の範囲）を計算
- Live2D の `ParamMouthOpenY` パラメータに反映

### まばたき

- 2〜6秒のランダム間隔でまばたきをトリガー
- `ParamEyeLOpen` と `ParamEyeROpen` を 0 に設定（閉じる）
- 100-120ms 後に 1 に戻す（開く）

## ファイル構成

```
motion-chara/
├── app/
│   ├── api/
│   │   └── tts/
│   │       └── route.ts         # Google TTS API エンドポイント
│   ├── page.tsx                 # メインページ UI
│   ├── layout.tsx               # アプリケーションレイアウト
│   └── globals.css              # グローバル CSS
├── components/
│   └── Live2DModel.tsx          # Live2D モデル描画コンポーネント
├── lib/
│   └── audioAnalyzer.ts         # 音声解析ユーティリティ
├── public/
│   └── models/                  # Live2D モデルファイル
├── Dockerfile                   # Docker イメージ定義
├── docker-compose.yml           # Docker Compose 設定
├── package.json
└── README.md
```

## API エンドポイント

### POST /api/tts

日本語テキストを音声に変換

**リクエスト:**
```json
{
  "text": "こんにちは"
}
```

**レスポンス:**
```json
{
  "audioContent": "base64_encoded_mp3_data"
}
```

## トラブルシューティング

### モデルが読み込まれない

- Live2D モデルのパスが正しいか確認
- `model3.json` ファイルと関連ファイル（.moc3, textures）が揃っているか確認

### 音声が再生されない

- Google TTS API キーが正しく設定されているか確認
- ブラウザのコンソールでエラーを確認

### リップシンクが動作しない

- ブラウザが Web Audio API をサポートしているか確認
- 音声が実際に再生されているか確認

## ライセンス

MIT

## クレジット

- [Live2D Cubism SDK for Web](https://www.live2d.com/en/download/cubism-sdk/)
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- [Google Cloud Text-to-Speech](https://cloud.google.com/text-to-speech)
