# react-live2d-lipsync - Package Summary

## 📦 パッケージ概要

Live2Dキャラクターをリップシンクとまばたきアニメーション付きで表示するReactコンポーネントライブラリです。

## 🎯 主な機能

### コンポーネント

1. **Live2DCharacter** - メインのLive2D表示コンポーネント
   - リップシンク対応
   - 自動まばたき
   - 位置・スケール調整
   - カスタマイズ可能なUI

2. **useLive2DAudio** - オーディオ分析用Reactフック
   - Web Audio APIを使用
   - リアルタイム音量検出
   - イベントコールバック対応

3. **AudioAnalyzer** - オーディオ分析クラス
   - FFT分析
   - 音量計算
   - カスタマイズ可能な設定

## 📁 パッケージ構造

```
react-live2d-lipsync/
├── src/
│   ├── index.ts                 # メインエクスポート
│   ├── types.ts                 # TypeScript型定義
│   ├── Live2DCharacter.tsx      # メインコンポーネント
│   ├── useLive2DAudio.ts        # オーディオフック
│   └── AudioAnalyzer.ts         # オーディオ分析クラス
├── dist/                        # ビルド出力
│   ├── index.js                 # CommonJS形式
│   ├── index.esm.js             # ES Module形式
│   ├── index.d.ts               # TypeScript定義
│   └── *.map                    # ソースマップ
├── examples/                    # 使用例
│   ├── basic-example.tsx
│   └── advanced-example.tsx
├── package.json                 # パッケージ設定
├── tsconfig.json                # TypeScript設定
├── rollup.config.js             # ビルド設定
├── README.md                    # ドキュメント
├── USAGE.md                     # 詳細な使用方法
└── .gitignore                   # Git除外設定
```

## 🚀 インストールと使用

### インストール

```bash
npm install react-live2d-lipsync
```

### 基本的な使用方法

```tsx
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  return (
    <>
      <Live2DCharacter
        modelPath="/models/character.model3.json"
        audioVolume={audioVolume}
      />
      <audio ref={audioRef} src="/audio.mp3" controls />
    </>
  );
}
```

## 🛠️ 主なProps

### Live2DCharacter

| Prop | 型 | デフォルト | 説明 |
|------|------|---------|-------------|
| `modelPath` | `string` | **必須** | Live2Dモデルファイルのパス |
| `audioVolume` | `number` | `0` | オーディオボリューム (0-1) |
| `positionY` | `number` | `0` | 垂直位置 (-1 to 1) |
| `positionX` | `number` | `0` | 水平位置 (-1 to 1) |
| `scale` | `number` | `1` | スケール倍率 |
| `width` | `number` | `640` | キャンバス幅 |
| `height` | `number` | `960` | キャンバス高さ |
| `enableBlinking` | `boolean` | `true` | まばたき有効化 |
| `enableLipSync` | `boolean` | `true` | リップシンク有効化 |
| `lipSyncSensitivity` | `number` | `1.5` | リップシンク感度 |

## 📝 オプション設定例

### 位置調整

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  positionY={-0.3}  // やや上
  positionX={0.1}   // やや右
  scale={1.2}       // 120%サイズ
/>
```

### まばたきカスタマイズ

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  enableBlinking={true}
  blinkInterval={[3000, 5000]}  // 3-5秒ごと
  blinkDuration={150}           // 150ms
/>
```

### スタイルカスタマイズ

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  className="my-character"
  style={{
    border: '2px solid #ddd',
    borderRadius: '8px',
  }}
  backgroundColor={0xffffff}
/>
```

## 🔧 ビルド

```bash
# 依存関係インストール
npm install

# ビルド
npm run build

# 開発モード（ウォッチ）
npm run dev
```

## 📤 NPM公開

```bash
# NPMログイン
npm login

# パッケージ公開
npm publish
```

スコープ付きパッケージの場合：

```bash
npm publish --access public
```

## 🔗 依存関係

### Peer Dependencies
- react >= 18.0.0
- react-dom >= 18.0.0

### Dependencies
- pixi.js ^6.5.10
- pixi-live2d-display ^0.4.0

### Dev Dependencies
- TypeScript
- Rollup (ビルドツール)
- @rollup/plugin-typescript
- @rollup/plugin-node-resolve
- @rollup/plugin-commonjs

## 🌐 ブラウザサポート

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ モバイルブラウザ

## 📋 要件

### Live2D SDKスクリプト

HTMLに以下を追加する必要があります：

```html
<!-- Cubism 2 SDK -->
<script src="https://cdn.jsdelivr.net/gh/dylanNew/live2d/webgl/Live2D/lib/live2d.min.js"></script>

<!-- Cubism 3+ SDK -->
<script src="https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"></script>
```

### モデル要件

Live2Dモデルには以下のパラメータが必要：
- `ParamMouthOpenY` - リップシンク用
- `ParamEyeLOpen` - 左目まばたき用
- `ParamEyeROpen` - 右目まばたき用

## 🎓 使用例

### テキスト読み上げとの統合

```tsx
const handleTTS = async (text: string) => {
  const response = await fetch('/api/tts', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
  const { audioContent } = await response.json();
  // ... audio playback
};
```

### ファイルアップロード

```tsx
const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && audioRef.current) {
    audioRef.current.src = URL.createObjectURL(file);
    audioRef.current.play();
  }
};
```

### マイク入力（リアルタイム）

```tsx
useEffect(() => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  // ... setup audio analysis
}, []);
```

## 📚 ドキュメント

- **README.md** - 基本ドキュメント、API リファレンス
- **USAGE.md** - 詳細な使用方法、統合パターン
- **examples/** - 実装例

## 🐛 トラブルシューティング

### モデルが表示されない
- Live2D SDKスクリプトが読み込まれているか確認
- モデルパスが正しいか確認
- ブラウザコンソールでエラーを確認

### リップシンクが動作しない
- `audioVolume`が更新されているか確認
- オーディオが実際に再生されているか確認
- `enableLipSync`が`true`か確認

## 📄 ライセンス

MIT

## 🤝 コントリビューション

Issue、Pull Request歓迎！

## 💡 今後の拡張案

- [ ] モーション再生機能
- [ ] 表情切り替え機能
- [ ] 視線追従機能
- [ ] タッチインタラクション
- [ ] パラメータアニメーション
- [ ] マルチモデル管理

## 📊 パッケージサイズ

- CommonJS: ~14KB
- ES Module: ~13KB
- TypeScript定義: ~4KB

Total: ~31KB (minified, excluding dependencies)
