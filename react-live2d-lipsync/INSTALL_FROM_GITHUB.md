# GitHubから直接インストールする方法

NPMに公開せずに、GitHubリポジトリから直接パッケージをインストールできます。

**重要**: このパッケージはモノレポ構成で、`react-live2d-lipsync/` ディレクトリに配置されています。
package.jsonの `"directory": "react-live2d-lipsync"` 設定により、NPMが自動的に正しいディレクトリを認識します。

## 📦 インストール方法

### 方法1: 特定バージョン（タグ）を指定（推奨）

```bash
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

### 方法2: GitHub shorthand を使用（最新版）

```bash
npm install Yuta-Hachino/react-live2d-lipsync
```

### 方法3: GitHub URL から直接

```bash
npm install https://github.com/Yuta-Hachino/react-live2d-lipsync.git#v1.0.0
```

### 方法4: 特定のブランチを指定

```bash
npm install Yuta-Hachino/react-live2d-lipsync#develop
```

### 方法5: 特定のコミットを指定

```bash
npm install Yuta-Hachino/react-live2d-lipsync#abc1234
```

### 方法5: プライベートリポジトリの場合

```bash
# SSHを使用
npm install git+ssh://git@github.com:Yuta-Hachino/react-live2d-lipsync.git

# HTTPSとトークンを使用
npm install git+https://<token>@github.com/Yuta-Hachino/react-live2d-lipsync.git
```

## 📝 package.json での指定

### 基本

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync"
  }
}
```

### ブランチ指定

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#develop"
  }
}
```

### タグ指定

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#v1.2.3"
  }
}
```

### コミット指定

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#abc1234"
  }
}
```

### セマンティックバージョン指定

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#semver:^1.0.0"
  }
}
```

## 🔧 必要な設定

### 1. package.json の準備

GitHubからインストールする場合でも、package.jsonは必要です。
このパッケージは既に設定済みです。

### 2. ビルド済みファイルの用意

#### オプションA: distをコミットする（推奨）

```bash
# .gitignoreからdistを削除
# dist/をGitにコミット
git add dist/
git commit -m "Add built files"
git push
```

#### オプションB: postinstallスクリプトを使用

package.jsonに以下を追加:

```json
{
  "scripts": {
    "postinstall": "npm run build"
  }
}
```

⚠️ 注意: この方法はインストール時にビルドが実行されるため、時間がかかります。

### 3. Gitタグの作成（推奨）

バージョン管理のためにGitタグを作成:

```bash
# タグを作成
git tag v1.0.0

# タグをプッシュ
git push origin v1.0.0

# または全タグをプッシュ
git push --tags
```

## 🚀 推奨セットアップ

### ステップ1: distをコミット対象にする

```bash
# .gitignoreを編集
# dist/ の行を削除またはコメントアウト

# ビルド
npm run build

# distをコミット
git add dist/
git commit -m "Add built files for GitHub install"
git push
```

### ステップ2: タグを作成

```bash
git tag v1.0.0
git push origin v1.0.0
```

### ステップ3: インストール

```bash
# 他のプロジェクトで
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

## 📋 .gitignore の調整

GitHubから直接インストールする場合、以下のように.gitignoreを変更:

### 変更前（現在）

```gitignore
# Build output
dist/
```

### 変更後（GitHub install用）

```gitignore
# Build output (コメントアウト)
# dist/

# ただし、以下は除外
dist/**/*.map
```

または、distは含めるがソースマップは除外:

```gitignore
# Source maps only
dist/**/*.map
```

## 🔄 更新方法

### 最新版に更新

```bash
npm update react-live2d-lipsync
```

### 特定バージョンに更新

```bash
npm install Yuta-Hachino/react-live2d-lipsync#v1.2.0
```

### 強制再インストール

```bash
npm uninstall react-live2d-lipsync
npm install Yuta-Hachino/react-live2d-lipsync
```

## 💡 使用例

### Next.js プロジェクトでの使用

```bash
# インストール
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0

# package.json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#v1.0.0"
  }
}
```

```tsx
// app/page.tsx
import { Live2DCharacter, useLive2DAudio } from 'react-live2d-lipsync';

export default function Page() {
  // ... 使用方法は通常と同じ
}
```

## 🎯 ベストプラクティス

### 1. タグでバージョン管理

```bash
# 開発版
npm install Yuta-Hachino/react-live2d-lipsync#develop

# 本番版（タグ指定）
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

### 2. package.jsonで固定

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#v1.0.0"
  }
}
```

### 3. セマンティックバージョニング

```bash
git tag v1.0.0
git tag v1.0.1
git tag v1.1.0
```

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#semver:^1.0.0"
  }
}
```

## 🔐 プライベートリポジトリの場合

### SSHキーを使用

```bash
# SSH経由でインストール
npm install git+ssh://git@github.com:Yuta-Hachino/react-live2d-lipsync.git
```

### Personal Access Token を使用

```bash
# 環境変数に設定
export GITHUB_TOKEN=your_token_here

# インストール
npm install git+https://${GITHUB_TOKEN}@github.com/Yuta-Hachino/react-live2d-lipsync.git
```

### .npmrc に設定

```bash
# ~/.npmrc
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## 🐛 トラブルシューティング

### エラー: "Cannot find module"

**原因**: distディレクトリがコミットされていない

**解決**:
```bash
# リポジトリ側で
npm run build
git add dist/
git commit -m "Add built files"
git push
```

### エラー: "Not found"

**原因**: リポジトリ名またはユーザー名が間違っている

**解決**: URLを確認
```bash
# 正しいURL
npm install Yuta-Hachino/react-live2d-lipsync
# または
npm install https://github.com/Yuta-Hachino/react-live2d-lipsync.git
```

### エラー: "Permission denied"

**原因**: プライベートリポジトリで認証情報が不足

**解決**: SSH設定または Personal Access Token を使用

## 📦 代替方法: GitHub Packages

GitHub Packagesを使用する方法もあります:

### 1. package.json に追加

```json
{
  "name": "@Yuta-Hachino/react-live2d-lipsync",
  "publishConfig": {
    "registry": "https://npm.pkg.github.com"
  }
}
```

### 2. 公開

```bash
npm publish
```

### 3. インストール

```bash
# .npmrc に追加
@username:registry=https://npm.pkg.github.com

# インストール
npm install @Yuta-Hachino/react-live2d-lipsync
```

## 📊 比較: NPM vs GitHub vs GitHub Packages

| 方法 | メリット | デメリット |
|------|---------|----------|
| NPM公開 | ・簡単にインストール<br>・バージョン管理が容易<br>・CDNで利用可能 | ・公開審査が必要<br>・パッケージ名の競合 |
| GitHub直接 | ・NPM登録不要<br>・プライベート可能<br>・すぐに使える | ・distのコミット必要<br>・更新確認が手動 |
| GitHub Packages | ・GitHub統合<br>・プライベート管理<br>・組織で共有 | ・設定が複雑<br>・認証が必要 |

## 🎓 推奨フロー

### 開発段階

```bash
# 開発ブランチから直接インストール
npm install Yuta-Hachino/react-live2d-lipsync#develop
```

### ベータテスト

```bash
# ベータタグを作成
git tag v1.0.0-beta.1
git push origin v1.0.0-beta.1

# インストール
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0-beta.1
```

### 本番リリース

```bash
# リリースタグを作成
git tag v1.0.0
git push origin v1.0.0

# インストール
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0
```

---

## まとめ

GitHubから直接インストールする方法:

```bash
# 基本
npm install Yuta-Hachino/react-live2d-lipsync

# タグ指定（推奨）
npm install Yuta-Hachino/react-live2d-lipsync#v1.0.0

# package.json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/react-live2d-lipsync#v1.0.0"
  }
}
```

**重要**: distディレクトリをGitにコミットすること！
