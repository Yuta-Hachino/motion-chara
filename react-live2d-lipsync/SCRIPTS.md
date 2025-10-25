# NPM Scripts Guide

このパッケージで利用可能な全てのNPMスクリプトの説明です。

## 🚀 Quick Start

Makefileを使用する場合（推奨）:

```bash
# ヘルプを表示
make help

# 開発開始
make install
make dev

# ビルド
make build

# 公開（パッチ）
make publish-patch
```

NPMスクリプトを直接使用する場合:

```bash
npm install
npm run dev
npm run build
npm run publish:patch
```

## 📦 開発用スクリプト

### `npm run dev`
開発モード。ファイル変更を監視して自動ビルドします。

```bash
npm run dev
```

### `npm run build`
プロダクション用にビルドします。

```bash
npm run build
```

### `npm run build:watch`
`npm run dev`と同じ。ウォッチモードでビルドします。

```bash
npm run build:watch
```

### `npm run clean`
ビルド出力ディレクトリ（`dist/`）を削除します。

```bash
npm run clean
```

### `npm run rebuild`
クリーン後に再ビルドします。

```bash
npm run rebuild
```

### `npm run typecheck`
TypeScriptの型チェックのみ実行（ビルドなし）。

```bash
npm run typecheck
```

### `npm run validate`
型チェックとビルドを両方実行します。公開前の検証に使用。

```bash
npm run validate
```

### `npm run test:build`
ビルドが成功するかテストします。

```bash
npm run test:build
```

## 🚀 公開用スクリプト

### `npm run publish:patch`
パッチバージョン（1.0.0 → 1.0.1）をインクリメントして公開します。

```bash
npm run publish:patch
```

**使用例**: バグ修正、小さな改善

### `npm run publish:minor`
マイナーバージョン（1.0.0 → 1.1.0）をインクリメントして公開します。

```bash
npm run publish:minor
```

**使用例**: 新機能追加（後方互換性あり）

### `npm run publish:major`
メジャーバージョン（1.0.0 → 2.0.0）をインクリメントして公開します。

```bash
npm run publish:major
```

**使用例**: 破壊的変更、APIの大幅変更

### `npm run publish:beta`
ベータ版として公開します（1.0.0 → 1.0.1-beta.0）。

```bash
npm run publish:beta
```

**インストール方法**:
```bash
npm install react-live2d-lipsync@beta
```

### `npm run publish:dry`
実際に公開せず、公開内容を確認します（ドライラン）。

```bash
npm run publish:dry
```

## 🔗 ローカルテスト用スクリプト

### `npm run pack:local`
`.tgz`ファイルを作成します。他のプロジェクトで手動インストール可能。

```bash
npm run pack:local
# 生成されたファイル: react-live2d-lipsync-1.0.0.tgz
```

**他プロジェクトでのインストール**:
```bash
npm install /path/to/react-live2d-lipsync-1.0.0.tgz
```

### `npm run install:local`
パッケージをグローバルにインストールします。

```bash
npm run install:local
```

### `npm run uninstall:local`
グローバルインストールを削除します。

```bash
npm run uninstall:local
```

### `npm run link:local`
npm linkを使ってローカルでパッケージをリンクします。

```bash
npm run link:local
```

**他プロジェクトでリンク**:
```bash
cd /path/to/your-app
npm link react-live2d-lipsync
```

### `npm run unlink:local`
npm linkを解除します。

```bash
npm run unlink:local
```

## 📊 情報確認スクリプト

### `npm run info`
公開されるファイルの一覧を表示します。

```bash
npm run info
```

## 🐙 GitHub インストール用スクリプト

NPMに公開せず、GitHubから直接インストールする場合のスクリプトです。

### `npm run prepare:github`
distをビルドしてGitに追加準備します。

```bash
npm run prepare:github
```

実行内容:
1. ビルド
2. distをgit addに追加
3. git statusで確認

### `npm run release:github`
ビルドしてdistをコミット・プッシュします。

```bash
npm run release:github
```

実行内容:
1. ビルド
2. distをgit add
3. コミット（"Update build files"）
4. プッシュ

### `npm run release:tag`
Gitタグを作成します。

```bash
npm run release:tag
# 例: git tag -a v1.0.0
```

### `npm run release:push`
コミットとタグをプッシュします。

```bash
npm run release:push
```

## 🔄 自動実行されるスクリプト

### `prepublishOnly`
`npm publish`実行時に自動的に実行されます。
- distディレクトリをクリーン
- 再ビルド

### `preversion`
バージョン更新前に自動実行されます。
- 型チェック
- ビルド

### `postversion`
バージョン更新後に自動実行されます。
- Gitにコミット
- タグをプッシュ

## 💡 実際のワークフロー例

### 初回開発セットアップ

```bash
# 依存関係インストール
npm install

# 開発モード起動
npm run dev
```

### ローカルテスト

```bash
# パッケージをビルド
npm run build

# 他のプロジェクトでテスト（方法1: pack）
npm run pack:local
# → 他プロジェクトで: npm install /path/to/react-live2d-lipsync-1.0.0.tgz

# または（方法2: link）
npm run link:local
# → 他プロジェクトで: npm link react-live2d-lipsync
```

### 公開前チェック

```bash
# 型チェック + ビルド
npm run validate

# 公開内容確認（ドライラン）
npm run publish:dry

# パッケージ情報確認
npm run info
```

### NPMに公開（パッチバージョン）

```bash
# バグ修正後、パッチバージョンで公開
npm run publish:patch

# 自動的に以下が実行される:
# 1. 型チェック + ビルド (preversion)
# 2. バージョン番号更新 (1.0.0 → 1.0.1)
# 3. クリーン + 再ビルド (prepublishOnly)
# 4. NPMに公開
# 5. Gitコミット + タグプッシュ (postversion)
```

### ベータ版公開

```bash
# ベータ版として公開
npm run publish:beta

# ユーザーはこうインストール:
# npm install react-live2d-lipsync@beta
```

### 新機能追加後の公開（マイナーバージョン）

```bash
npm run publish:minor
# 1.0.1 → 1.1.0
```

### 破壊的変更後の公開（メジャーバージョン）

```bash
npm run publish:major
# 1.1.0 → 2.0.0
```

## 🐛 トラブルシューティング

### ビルドエラーが発生する

```bash
# クリーンビルド
npm run rebuild

# 型チェック
npm run typecheck
```

### 公開前に内容を確認したい

```bash
# ドライラン
npm run publish:dry

# 公開ファイル一覧
npm run info
```

### ローカルテストがうまくいかない

```bash
# linkを解除してやり直し
npm run unlink:local
npm run link:local

# または
npm run pack:local
# 生成された.tgzファイルを直接インストール
```

## 📋 スクリプト一覧（クイックリファレンス）

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発モード（ウォッチ） |
| `npm run build` | ビルド |
| `npm run clean` | distディレクトリ削除 |
| `npm run rebuild` | クリーン + ビルド |
| `npm run typecheck` | 型チェック |
| `npm run validate` | 型チェック + ビルド |
| `npm run publish:patch` | パッチ公開 (1.0.0→1.0.1) |
| `npm run publish:minor` | マイナー公開 (1.0.0→1.1.0) |
| `npm run publish:major` | メジャー公開 (1.0.0→2.0.0) |
| `npm run publish:beta` | ベータ公開 |
| `npm run publish:dry` | 公開テスト（実行なし） |
| `npm run pack:local` | .tgz作成 |
| `npm run link:local` | ローカルリンク |
| `npm run info` | 公開ファイル一覧 |

## 🔐 初回公開時の準備

### 1. NPMアカウント作成

https://www.npmjs.com/ でアカウント作成

### 2. ログイン

```bash
npm login
```

### 3. package.json の更新

```json
{
  "name": "react-live2d-lipsync",  // パッケージ名（ユニークであること）
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourYuta-Hachino/motion-chara"
  }
}
```

### 4. 公開

```bash
# 初回公開
npm run publish:patch

# スコープ付きパッケージの場合
npm publish --access public
```

## 🎓 ベストプラクティス

1. **公開前は必ず validate を実行**
   ```bash
   npm run validate
   ```

2. **ドライランで確認**
   ```bash
   npm run publish:dry
   ```

3. **セマンティックバージョニングを守る**
   - パッチ: バグ修正
   - マイナー: 新機能（後方互換）
   - メジャー: 破壊的変更

4. **ベータ版でテスト**
   ```bash
   npm run publish:beta
   # テスト後
   npm run publish:minor
   ```

5. **ローカルテストを忘れずに**
   ```bash
   npm run link:local
   # 他プロジェクトでテスト
   ```
