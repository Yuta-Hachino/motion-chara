# GitHubリリース完全ガイド

NPMに公開せず、GitHubから直接インストール可能な形でリリースする方法。

## 🎯 概要

GitHubから直接インストール:
```bash
npm install Yuta-Hachino/motion-chara#v1.0.0
```

## 📋 準備（初回のみ）

### 1. .gitignore の確認

distディレクトリがコミット対象になっていることを確認:

```bash
cat .gitignore
# dist/ の行がコメントアウトされている
# # dist/
```

### 2. GitHubリポジトリの作成

```bash
# GitHubでリポジトリを作成後
git remote add origin https://github.com/Yuta-Hachino/motion-chara.git
git branch -M main
git push -u origin main
```

## 🚀 リリース手順

### 方法1: Makefileを使用（推奨）

#### ステップ1: ビルドとコミット

```bash
# ビルド、distをコミット、プッシュを一括実行
make release-github
```

#### ステップ2: タグ作成

```bash
# v1.0.0 タグを作成
make release-tag TAG=v1.0.0
```

#### ステップ3: プッシュ

```bash
# コミットとタグをプッシュ
make release-push
```

### 方法2: NPMスクリプトを使用

#### ステップ1: ビルドと準備

```bash
npm run prepare:github
```

これで以下が実行されます:
- ビルド
- distをgit addに追加
- git statusで確認

#### ステップ2: コミットとプッシュ

```bash
# オプションA: 自動コミット+プッシュ
npm run release:github

# オプションB: 手動
git commit -m "Release v1.0.0"
git push
```

#### ステップ3: タグ作成とプッシュ

```bash
# タグ作成
git tag -a v1.0.0 -m "Release v1.0.0"

# プッシュ
npm run release:push
```

### 方法3: 手動（詳細制御）

```bash
# 1. ビルド
npm run build

# 2. distを追加
git add dist/

# 3. コミット
git commit -m "Release v1.0.0: Add feature XYZ"

# 4. タグ作成
git tag -a v1.0.0 -m "Release v1.0.0"

# 5. プッシュ
git push origin main
git push origin v1.0.0
```

## 📦 インストール方法（ユーザー側）

### 最新版

```bash
npm install Yuta-Hachino/motion-chara
```

### 特定バージョン

```bash
npm install Yuta-Hachino/motion-chara#v1.0.0
```

### package.json に記載

```json
{
  "dependencies": {
    "react-live2d-lipsync": "github:Yuta-Hachino/motion-chara#v1.0.0"
  }
}
```

## 🔄 更新リリースのワークフロー

### パッチ更新（1.0.0 → 1.0.1）

バグ修正の場合:

```bash
# 1. コード修正
# ... ファイルを編集 ...

# 2. ビルド + コミット + プッシュ
make release-github

# 3. タグ作成
make release-tag TAG=v1.0.1

# 4. プッシュ
make release-push
```

### マイナー更新（1.0.1 → 1.1.0）

新機能追加の場合:

```bash
# 1. 新機能実装
# ... ファイルを編集 ...

# 2. リリース
make release-github
make release-tag TAG=v1.1.0
make release-push
```

### メジャー更新（1.1.0 → 2.0.0）

破壊的変更の場合:

```bash
# 1. 大きな変更を実装
# ... ファイルを編集 ...

# 2. リリース
make release-github
make release-tag TAG=v2.0.0
make release-push
```

## 🎓 ベータ版リリース

### ベータタグの作成

```bash
# ベータブランチで作業
git checkout -b beta

# 開発
# ...

# リリース
make release-github
make release-tag TAG=v1.0.0-beta.1
make release-push
```

### インストール

```bash
npm install Yuta-Hachino/motion-chara#v1.0.0-beta.1
```

## 📝 タグ命名規則

### セマンティックバージョニング

- **v1.0.0** - 初回リリース
- **v1.0.1** - パッチ（バグ修正）
- **v1.1.0** - マイナー（新機能）
- **v2.0.0** - メジャー（破壊的変更）

### プレリリース

- **v1.0.0-alpha.1** - アルファ版
- **v1.0.0-beta.1** - ベータ版
- **v1.0.0-rc.1** - リリース候補

## 🔍 確認コマンド

### ローカルのタグを確認

```bash
git tag
```

### リモートのタグを確認

```bash
git ls-remote --tags origin
```

### 特定タグの詳細

```bash
git show v1.0.0
```

### distがコミットされているか確認

```bash
git ls-files dist/
```

## 🐛 トラブルシューティング

### エラー: "Cannot find module"

**原因**: distがコミットされていない

**解決**:
```bash
npm run build
git add dist/
git commit -m "Add dist files"
git push
```

### タグが既に存在する

**解決**:
```bash
# ローカルのタグを削除
git tag -d v1.0.0

# リモートのタグを削除
git push origin :refs/tags/v1.0.0

# 新しいタグを作成
make release-tag TAG=v1.0.0
make release-push
```

### distが更新されない

**解決**:
```bash
# クリーンビルド
make rebuild
git add dist/
git commit -m "Update dist files"
git push
```

## 📊 完全なリリースチェックリスト

### 初回リリース

- [ ] コードが完成している
- [ ] ビルドが成功する (`make build`)
- [ ] 型チェックが通る (`make typecheck`)
- [ ] ローカルテストが完了 (`make link`)
- [ ] .gitignore でdistがコミット対象
- [ ] GitHubリポジトリが作成済み
- [ ] `make release-github` 実行
- [ ] `make release-tag TAG=v1.0.0` 実行
- [ ] `make release-push` 実行
- [ ] GitHubでタグを確認
- [ ] テストインストール: `npm install username/repo#v1.0.0`

### 更新リリース

- [ ] 変更内容を実装
- [ ] ビルド成功 (`make build`)
- [ ] 型チェック成功 (`make typecheck`)
- [ ] ローカルテスト完了
- [ ] CHANGELOG.md 更新（推奨）
- [ ] `make release-github` 実行
- [ ] 適切なバージョンタグ作成
- [ ] `make release-push` 実行
- [ ] GitHubでタグ確認
- [ ] テストインストール

## 🎯 推奨ワークフロー

### 日常開発

```bash
# 開発ブランチで作業
git checkout -b feature/new-feature

# 開発
make dev

# テスト
make link
cd /path/to/test-app
npm link react-live2d-lipsync
```

### リリース準備

```bash
# メインブランチにマージ
git checkout main
git merge feature/new-feature

# 検証
make validate

# リリース
make release-github
```

### バージョンタグ

```bash
# セマンティックバージョニングに従う
make release-tag TAG=v1.1.0
make release-push
```

## 📚 関連ドキュメント

- [INSTALL_FROM_GITHUB.md](./INSTALL_FROM_GITHUB.md) - GitHubインストールの詳細
- [SCRIPTS.md](./SCRIPTS.md) - 全スクリプトの説明
- [QUICKSTART.md](./QUICKSTART.md) - クイックスタートガイド

## 💡 ヒント

1. **常にタグを使用**: ユーザーが特定バージョンをインストールできるように
2. **セマンティックバージョニング**: 変更の種類に応じて適切にバージョンアップ
3. **CHANGELOG**: 変更履歴を記録すると親切
4. **GitHub Releases**: タグと一緒にリリースノートも作成
5. **CI/CD**: GitHub Actionsで自動ビルドも可能

## 🚀 次のステップ

リリース後:
1. README.mdにインストール方法を明記
2. サンプルプロジェクトを作成
3. GitHub Releasesでリリースノート作成
4. ドキュメントサイトを作成（オプション）
5. コミュニティに紹介

Happy releasing! 🎉
