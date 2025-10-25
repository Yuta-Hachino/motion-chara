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

# 3. 開発サーバー起動
npm run dev

# 4. ブラウザで開く
open http://localhost:3000
```

**注意**:
- サンプルアプリはローカルパッケージ (`file:./react-live2d-lipsync`) を参照しています
- Google TTS APIキーはUI上で入力できます（環境変数の設定は不要）

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
- [GitHub Pages デモ](https://yuta-hachino.github.io/react-live2d-lipsync/) - オンラインデモ

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

### 背景のカスタマイズ

キャラクター表示エリアの背景は、通常のCSSで自由にカスタマイズできます：

```tsx
// 背景色を設定
<div style={{ backgroundColor: '#f3e5f5' }}>
  <Live2DCharacter modelPath="/model.model3.json" audioVolume={audioVolume} />
</div>

// 背景画像を設定
<div style={{
  backgroundImage: 'url(/background.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}}>
  <Live2DCharacter modelPath="/model.model3.json" audioVolume={audioVolume} />
</div>

// グラデーション背景
<div style={{
  background: 'linear-gradient(to bottom, #667eea, #764ba2)'
}}>
  <Live2DCharacter modelPath="/model.model3.json" audioVolume={audioVolume} />
</div>
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

### パッケージのリリース（完全自動化）

GitHubのActionsタブから、ボタン1つでリリース可能：

1. GitHubリポジトリの **Actions** タブを開く
2. **Auto Release** ワークフローを選択
3. **Run workflow** をクリック
4. バージョンタイプを選択（patch / minor / major）
5. **Run workflow** を実行

GitHub Actionsが自動的に：
1. ✅ バリデーション（型チェック、ビルド確認）
2. ✅ バージョンアップ（package.json更新、タグ作成）
3. ✅ パッケージビルド
4. ✅ distファイルをコミット
5. ✅ mainブランチとタグをプッシュ
6. ✅ GitHub Releaseを作成

**ローカルからのリリース（Makefileを使用）:**

```bash
cd react-live2d-lipsync

# パッチバージョン (1.0.0 → 1.0.1)
make release-patch

# マイナーバージョン (1.0.0 → 1.1.0)
make release-minor

# メジャーバージョン (1.0.0 → 2.0.0)
make release-major
```

**インストール:**

```bash
# 最新版
npm install Yuta-Hachino/react-live2d-lipsync

# 特定バージョン
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

### サンプルアプリのデプロイ（GitHub Pages）

`main` ブランチにプッシュすると、自動的にGitHub Pagesにデプロイされます:

```bash
git push origin main
```

デモサイト: https://yuta-hachino.github.io/react-live2d-lipsync/

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
