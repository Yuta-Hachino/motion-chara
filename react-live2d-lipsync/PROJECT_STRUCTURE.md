# プロジェクト構成について

このリポジトリは以下の2つで構成されています：

## 📦 メインパッケージ: react-live2d-lipsync

NPMパッケージとして配布可能なReactコンポーネントライブラリ

**場所**: `/react-live2d-lipsync/`

**インストール方法**:
```bash
# GitHubから直接インストール
npm install Yuta-Hachino/motion-chara#v1.0.0

# または、このディレクトリをサブパッケージとして
cd react-live2d-lipsync
npm install
npm run build
```

## 🎯 サンプルアプリ（計画）

パッケージの使用例を示すNext.jsアプリケーション

**場所**: `/example/` (将来的に移動予定)

**現在の状態**:
- ルートディレクトリに Next.js アプリが配置されている
- 今後 `/example/` ディレクトリに移動予定

## 🔄 推奨プロジェクト構成（将来）

```
motion-chara/
├── react-live2d-lipsync/      # NPMパッケージ（メイン）
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── README.md
│
├── example/                   # サンプルアプリ
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── README.md                  # プロジェクト全体のREADME
```

## 📝 移行手順（TODO）

1. 現在のNext.jsアプリを `/example/` に移動
2. `/example/` でパッケージを参照するように設定
3. ルートREADMEを更新してプロジェクト全体の説明を記載
