# Quick Start Guide

このガイドでは、`react-live2d-lipsync` パッケージの開発から公開までの流れを簡潔に説明します。

## 🎯 目次

1. [開発環境セットアップ](#開発環境セットアップ)
2. [開発モード](#開発モード)
3. [ローカルテスト](#ローカルテスト)
4. [ビルド](#ビルド)
5. [公開](#公開)

---

## 開発環境セットアップ

### 1. 依存関係のインストール

```bash
# Makefileを使用
make install

# または npm直接
npm install
```

### 2. 型チェック

```bash
# Makefileを使用
make typecheck

# または npm直接
npm run typecheck
```

---

## 開発モード

### ウォッチモードで開発

```bash
# Makefileを使用
make dev

# または npm直接
npm run dev
```

ファイルの変更を監視して自動的に再ビルドされます。

---

## ローカルテスト

### 方法1: npm link を使用

```bash
# このパッケージでリンクを作成
make link
# または
npm run link:local

# テストしたいプロジェクトで
cd /path/to/your-app
npm link react-live2d-lipsync

# テスト後、リンクを解除
npm unlink react-live2d-lipsync

# このパッケージでも解除
make unlink
# または
npm run unlink:local
```

### 方法2: .tgz パッケージを使用

```bash
# .tgz パッケージを作成
make pack
# または
npm run pack:local

# 生成されたファイル: react-live2d-lipsync-1.0.0.tgz

# テストしたいプロジェクトで
cd /path/to/your-app
npm install /path/to/react-live2d-lipsync/react-live2d-lipsync-1.0.0.tgz

# 使用例
import { Live2DCharacter } from 'react-live2d-lipsync';
```

---

## ビルド

### 通常のビルド

```bash
# Makefileを使用
make build

# または npm直接
npm run build
```

### クリーンビルド

```bash
# Makefileを使用
make rebuild

# または npm直接
npm run rebuild
```

### ビルドの検証

```bash
# Makefileを使用
make validate

# または npm直接
npm run validate
```

これは以下を実行します:
1. TypeScript型チェック
2. ビルド

---

## 公開

### 公開前の準備

#### 1. NPMログイン

```bash
npm login
```

#### 2. package.json の確認

以下の項目を確認・更新してください:

```json
{
  "name": "react-live2d-lipsync",
  "version": "1.0.0",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourYuta-Hachino/react-live2d-lipsync"
  }
}
```

#### 3. ドライラン（テスト公開）

```bash
# Makefileを使用
make publish-dry

# または npm直接
npm run publish:dry
```

公開される内容を確認できます。

#### 4. パッケージ情報の確認

```bash
# Makefileを使用
make info

# または npm直接
npm run info
```

---

### 実際の公開

#### パッチバージョン（1.0.0 → 1.0.1）

バグ修正など、小さな変更の場合:

```bash
# Makefileを使用
make publish-patch

# または npm直接
npm run publish:patch
```

#### マイナーバージョン（1.0.0 → 1.1.0）

新機能追加（後方互換性あり）の場合:

```bash
# Makefileを使用
make publish-minor

# または npm直接
npm run publish:minor
```

#### メジャーバージョン（1.0.0 → 2.0.0）

破壊的変更の場合:

```bash
# Makefileを使用
make publish-major

# または npm直接
npm run publish:major
```

#### ベータ版

```bash
# Makefileを使用
make publish-beta

# または npm直接
npm run publish:beta
```

ベータ版のインストール方法:
```bash
npm install react-live2d-lipsync@beta
```

---

## 📋 よく使うコマンド一覧

| 操作 | Makefile | NPM Script |
|------|----------|------------|
| ヘルプ | `make help` | - |
| インストール | `make install` | `npm install` |
| 開発モード | `make dev` | `npm run dev` |
| ビルド | `make build` | `npm run build` |
| 再ビルド | `make rebuild` | `npm run rebuild` |
| 型チェック | `make typecheck` | `npm run typecheck` |
| 検証 | `make validate` | `npm run validate` |
| ローカルリンク | `make link` | `npm run link:local` |
| パッケージ作成 | `make pack` | `npm run pack:local` |
| パッケージ情報 | `make info` | `npm run info` |
| ドライラン | `make publish-dry` | `npm run publish:dry` |
| パッチ公開 | `make publish-patch` | `npm run publish:patch` |
| マイナー公開 | `make publish-minor` | `npm run publish:minor` |
| メジャー公開 | `make publish-major` | `npm run publish:major` |
| ベータ公開 | `make publish-beta` | `npm run publish:beta` |

---

## 🔄 典型的なワークフロー

### 開発フロー

```bash
# 1. セットアップ
make install

# 2. 開発開始
make dev

# 3. コード変更
# ... ファイルを編集 ...

# 4. 型チェック
make typecheck

# 5. ローカルテスト
make link
cd /path/to/test-app
npm link react-live2d-lipsync
# ... テスト ...

# 6. ビルド確認
make validate
```

### 公開フロー

```bash
# 1. 最終確認
make validate

# 2. ドライラン
make publish-dry

# 3. パッケージ情報確認
make info

# 4. 公開（パッチの例）
make publish-patch
```

---

## 🐛 トラブルシューティング

### ビルドエラー

```bash
# クリーンビルド
make rebuild
```

### 型エラー

```bash
# 型チェックのみ実行
make typecheck
```

### ローカルテストがうまくいかない

```bash
# リンクを解除して再度リンク
make unlink
make link

# または .tgz を使用
make pack
cd /path/to/test-app
npm install /path/to/react-live2d-lipsync/react-live2d-lipsync-*.tgz
```

---

## 📚 関連ドキュメント

- [README.md](./README.md) - パッケージの概要とAPI
- [SCRIPTS.md](./SCRIPTS.md) - 全スクリプトの詳細
- [USAGE.md](./USAGE.md) - 使用方法とサンプル
- [PACKAGE_SUMMARY.md](./PACKAGE_SUMMARY.md) - パッケージ構造

---

## 💡 ヒント

1. **Makefileを使うと便利**: `make help` で全コマンドを確認できます
2. **公開前は必ず検証**: `make validate` と `make publish-dry` を実行
3. **ローカルテストを忘れずに**: `make link` または `make pack` でテスト
4. **セマンティックバージョニング**: 適切なバージョンアップを選択
   - パッチ: バグ修正
   - マイナー: 新機能（互換性あり）
   - メジャー: 破壊的変更

---

## 🎓 次のステップ

パッケージの開発が完了したら:

1. GitHubリポジトリにプッシュ
2. READMEを充実させる
3. サンプルアプリを作成
4. npm publish で公開
5. ブログやSNSで紹介

Happy coding! 🚀
