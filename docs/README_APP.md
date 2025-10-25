# Live2D リップシンク & まばたきアプリ

Live2D モデルをリアルタイムでリップシンク＋まばたきさせる Web アプリケーションです。

## 🌐 オンラインデモ

**GitHub Pages**: https://yuta-hachino.github.io/react-live2d-lipsync/

オンラインデモでは、Google TTS APIキーをUI上で入力して使用できます。

## 機能

- **テキスト読み上げ**: 日本語テキストを入力し、Google TTS で音声を生成
- **音声ファイル対応**: MP3/WAV/OGG などの音声ファイルをアップロード
- **リアルタイムリップシンク**: Web Audio API で音量を解析し、Live2D モデルの口を動かす
- **自動まばたき**: 2〜6秒間隔でランダムにまばたき（100-120ms持続）
- **Live2D Cubism SDK**: pixi-live2d-display を使用した本格的なキャラクターアニメーション
- **背景カスタマイズ**: 背景色や背景画像をUI上で自由に設定可能
- **GitHub Pages対応**: 静的サイトとして公開可能

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Live2D**: pixi-live2d-display v0.4.0 + Pixi.js v7.4.2
- **音声解析**: Web Audio API (AnalyserNode)
- **TTS**: Google Cloud Text-to-Speech API（クライアントサイドから直接呼び出し）
- **デプロイ**: GitHub Actions + GitHub Pages

## セットアップ

### 前提条件

- Node.js 18以上
- Google Cloud Text-to-Speech API キー（オプション、音声ファイルのみ使う場合は不要）

### インストール & 実行

```bash
# react-live2d-lipsyncパッケージをビルド
cd react-live2d-lipsync
npm install
npm run build
cd ..

# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く

**注意**: APIキーは環境変数ではなく、UI上で入力します。

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

### 基本機能

1. **API設定** (テキスト読み上げを使う場合):
   - 「API設定」セクションの「表示」をクリック
   - Google TTS API キーを入力
   - APIキーは[Google Cloud Console](https://console.cloud.google.com/apis/credentials)から取得

2. **テキスト読み上げ**:
   - テキストエリアに日本語を入力
   - 「音声を生成して再生」ボタンをクリック
   - Google TTS で音声が生成され、Live2Dキャラクターがリップシンク

3. **音声ファイルアップロード**:
   - 「音声ファイルアップロード」セクションでMP3/WAV/OGGファイルを選択
   - 音声が自動再生され、リップシンク開始
   - APIキー不要

### カスタマイズ機能

4. **モデル選択**:
   - ドロップダウンから Live2D モデルを選択
   - カスタムモデルは `/public/live2d/` に配置

5. **モデル調整**:
   - **縦位置**: スライダーでキャラクターの縦位置を調整 (-1.0 〜 1.0)
   - **サイズ**: スライダーでキャラクターのサイズを調整 (0.5x 〜 2.0x)
   - **デフォルトに戻す**: ボタンで初期設定にリセット

6. **背景設定**:
   - **背景色**: カラーピッカーまたはHexコード入力で色を選択
   - **背景画像**: JPG/PNG/GIF画像をアップロード
   - **背景画像をクリア**: アップロードした画像を削除
   - **背景をリセット**: デフォルトのパープル系グラデーションに戻す

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
