# react-live2d-lipsync

Live2Dキャラクターをリップシンクとまばたきアニメーション付きで表示するReactコンポーネントライブラリと、そのサンプルアプリケーション。

## 📦 プロジェクト構成

このリポジトリには2つのプロジェクトが含まれています：

### 1. react-live2d-lipsync (NPMパッケージ)

**場所**: [`/react-live2d-lipsync/`](./react-live2d-lipsync/)

Reactコンポーネントとして使用可能なLive2Dリップシンクライブラリです。

**特徴**:
- 🎭 Live2D Cubism 2/3モデル対応
- 🎤 リアルタイムリップシンク
- 👁️ 自動まばたき
- ⚙️ 豊富なカスタマイズオプション
- 📦 TypeScript完全対応

**インストール**:
```bash
# GitHubから直接インストール
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

**詳細**: [react-live2d-lipsync/README.md](./react-live2d-lipsync/README.md)

### 2. サンプルアプリケーション (Next.js)

**場所**: ルートディレクトリ（将来的に `/example/` に移動予定）

パッケージの使用例を示すNext.jsアプリケーションです。

**機能**:
- テキスト読み上げ（Google TTS）
- 音声ファイルアップロード
- リアルタイムリップシンク
- キャラクター位置・サイズ調整

## 🚀 クイックスタート

### パッケージを使用する

```bash
# 1. インストール
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0

# 2. 使用
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

### サンプルアプリを起動する

サンプルアプリは `react-live2d-lipsync` パッケージを実際に使用しています。

```bash
# 1. パッケージをビルド
cd react-live2d-lipsync
npm install
npm run build
cd ..

# 2. アプリの依存関係インストール（パッケージを含む）
npm install

# 3. 環境変数設定
cp .env.local.example .env.local
# .env.local を編集して GOOGLE_TTS_API_KEY を設定

# 4. 開発サーバー起動
npm run dev

# 5. ブラウザで開く
open http://localhost:3000
```

**重要**: `.env.local` には機密情報が含まれるため、Gitにコミットしないでください。

**注意**: サンプルアプリはローカルパッケージ (`file:./react-live2d-lipsync`) を参照しています。

## 📚 ドキュメント

### パッケージドキュメント

- [README](./react-live2d-lipsync/README.md) - パッケージ概要とAPI
- [QUICKSTART](./react-live2d-lipsync/QUICKSTART.md) - クイックスタートガイド
- [USAGE](./react-live2d-lipsync/USAGE.md) - 詳細な使用方法
- [SCRIPTS](./react-live2d-lipsync/SCRIPTS.md) - NPMスクリプト一覧
- [INSTALL_FROM_GITHUB](./react-live2d-lipsync/INSTALL_FROM_GITHUB.md) - GitHubインストール方法
- [GITHUB_RELEASE](./react-live2d-lipsync/GITHUB_RELEASE.md) - リリース手順

### サンプルアプリドキュメント

- [README_APP](./docs/README_APP.md) - アプリの詳細説明
- [GOOGLE_TTS_SETUP](./docs/GOOGLE_TTS_SETUP.md) - Google TTS API設定
- [DEPLOYMENT](./docs/DEPLOYMENT.md) - GCP Cloud Runへのデプロイ

## 🎯 使用例

### 基本的な使用

```tsx
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

function BasicExample() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { audioVolume } = useLive2DAudio({ audioElement: audioRef.current });

  return (
    <div>
      <Live2DCharacter
        modelPath="/live2d/model.model3.json"
        audioVolume={audioVolume}
        width={640}
        height={960}
      />
      <audio ref={audioRef} src="/speech.mp3" controls />
    </div>
  );
}
```

### カスタマイズ

```tsx
<Live2DCharacter
  modelPath="/model.model3.json"
  audioVolume={audioVolume}
  positionY={-0.3}          // 位置調整
  scale={1.2}               // サイズ調整
  enableBlinking={true}     // まばたき
  blinkInterval={[3000, 5000]}  // まばたき間隔
  lipSyncSensitivity={1.5}  // リップシンク感度
/>
```

## 🛠️ 開発

### パッケージ開発

```bash
cd react-live2d-lipsync

# 依存関係インストール
npm install

# 開発モード
npm run dev

# ビルド
npm run build

# ローカルテスト
npm run link:local
```

### サンプルアプリ開発

```bash
# ルートディレクトリで
npm install
npm run dev
```

## 🌐 デプロイ

### パッケージリリース（GitHub）

```bash
cd react-live2d-lipsync

# ビルド + コミット + プッシュ
make release-github

# タグ作成
make release-tag TAG=v1.0.0

# プッシュ
make release-push
```

### サンプルアプリデプロイ（GCP Cloud Run）

```bash
# 1. デプロイ用環境変数を設定
cp .env.deploy.example .env.deploy
# .env.deploy を編集して実際の値を設定

# 2. デプロイ実行
./scripts/deploy.sh
```

詳細: [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

**セキュリティ**: `.env.deploy` には機密情報が含まれるため、Gitにコミットしないでください。

## 📋 必要要件

### パッケージ

- React >= 18.0.0
- react-dom >= 18.0.0
- Node.js >= 18.0.0

### サンプルアプリ

- Next.js 14
- Google TTS API キー（オプション）

## 🎨 Live2D モデル

Live2Dモデルは以下のパラメータが必要です：

- `ParamMouthOpenY` - リップシンク用
- `ParamEyeLOpen` - 左目まばたき用
- `ParamEyeROpen` - 右目まばたき用

サンプルモデル：`public/live2d/lan/`

## 🔧 トラブルシューティング

### モデルが表示されない

1. Live2D SDKスクリプトが読み込まれているか確認
2. モデルパスが正しいか確認
3. ブラウザコンソールでエラーを確認

### リップシンクが動作しない

1. `audioVolume`プロパティが更新されているか確認
2. オーディオが実際に再生されているか確認
3. `enableLipSync={true}`が設定されているか確認

## 🤝 コントリビューション

プルリクエスト歓迎！

1. Fork する
2. Feature ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT

## 🙏 クレジット

- [Pixi.js](https://pixijs.com/)
- [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- [Live2D Cubism SDK](https://www.live2d.com/)

## 📞 お問い合わせ

- GitHub Issues: [https://github.com/Yuta-Hachino/react-live2d-lipsync/issues](https://github.com/Yuta-Hachino/react-live2d-lipsync/issues)
- Repository: [https://github.com/Yuta-Hachino/react-live2d-lipsync](https://github.com/Yuta-Hachino/react-live2d-lipsync)

---

Made with ❤️ by Yuta Hachino
