# Cloud Run クイックデプロイ手順（gcloud CLI なし）

gcloud CLI がインストールされていない場合の、ブラウザから直接デプロイする手順です。

## 方法1: Cloud Console UIからデプロイ（最も簡単）

### 1. Google Cloud Console にアクセス

https://console.cloud.google.com/

プロジェクト: `gen-lang-client-0830629645` を選択

### 2. Cloud Shell を開く

画面右上の「Cloud Shell をアクティブにする」ボタン（ターミナルアイコン）をクリック

### 3. プロジェクトディレクトリをアップロード

Cloud Shell で以下を実行:

```bash
# 1. 作業ディレクトリを作成
mkdir -p ~/live2d-lipsync
cd ~/live2d-lipsync
```

次に、Cloud Shell の「その他」メニュー（3点リーダー）→「ファイルをアップロード」から、
以下のファイルをアップロード:

- すべての `.js`, `.ts`, `.tsx` ファイル
- `package.json`, `package-lock.json`
- `Dockerfile`, `.dockerignore`
- `next.config.js`, `tsconfig.json`
- `tailwind.config.ts`, `postcss.config.js`
- `app/`, `components/`, `lib/`, `public/` フォルダ全体

**または、GitHubリポジトリを使用する場合:**

```bash
# リポジトリをクローン（GitHubにプッシュ済みの場合）
git clone YOUR_GITHUB_REPO_URL
cd YOUR_REPO_NAME
```

### 4. 環境変数を設定

```bash
export PROJECT_ID="gen-lang-client-0830629645"
export REGION="asia-northeast1"
export SERVICE_NAME="live2d-lipsync"
export GOOGLE_TTS_API_KEY="AIzaSyAUo1cvV18sM66Zof3Z1UN79a1j1fOdyXc"
```

### 5. 必要なAPIを有効化

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 6. Dockerイメージをビルド

```bash
gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME}
```

ビルドには5-10分かかります。

### 7. Cloud Runにデプロイ

```bash
gcloud run deploy ${SERVICE_NAME} \
  --image gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars GOOGLE_TTS_API_KEY=${GOOGLE_TTS_API_KEY}
```

### 8. デプロイ完了

サービスURLが表示されます。例:
```
https://live2d-lipsync-xxxxxxxxx-an.a.run.app
```

このURLにアクセスしてアプリを確認！

## 方法2: ローカルからCloud Shellを使う

### 1. ローカルでプロジェクトを圧縮

```bash
cd /Users/user/dev/motion-chara
tar -czf live2d-lipsync.tar.gz \
  --exclude=node_modules \
  --exclude=.next \
  --exclude=.git \
  .
```

### 2. Cloud Console で Cloud Shell を開く

https://console.cloud.google.com/ にアクセスし、Cloud Shell を起動

### 3. ファイルをアップロード

Cloud Shell の「ファイルをアップロード」から `live2d-lipsync.tar.gz` をアップロード

### 4. 解凍してデプロイ

```bash
mkdir live2d-lipsync
cd live2d-lipsync
tar -xzf ../live2d-lipsync.tar.gz

# 環境変数設定
export PROJECT_ID="gen-lang-client-0830629645"
export GOOGLE_TTS_API_KEY="AIzaSyAUo1cvV18sM66Zof3Z1UN79a1j1fOdyXc"

# デプロイ
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## 方法3: GitHub ActionsでCI/CDセットアップ（推奨）

リポジトリに以下のファイルを作成: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

env:
  PROJECT_ID: gen-lang-client-0830629645
  SERVICE_NAME: live2d-lipsync
  REGION: asia-northeast1

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
      with:
        project_id: ${{ env.PROJECT_ID }}
        service_account_key: ${{ secrets.GCP_SA_KEY }}

    - name: Build and Push
      run: |
        gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

    - name: Deploy to Cloud Run
      run: |
        gcloud run deploy $SERVICE_NAME \
          --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
          --region $REGION \
          --platform managed \
          --allow-unauthenticated \
          --set-env-vars GOOGLE_TTS_API_KEY=${{ secrets.GOOGLE_TTS_API_KEY }}
```

GitHubリポジトリのSettings → Secrets に以下を追加:
- `GCP_SA_KEY`: サービスアカウントキー（JSON）
- `GOOGLE_TTS_API_KEY`: TTSのAPIキー

## トラブルシューティング

### Cloud Shellでディスク容量不足

```bash
# 不要なファイルを削除
gcloud builds list --limit=5
gcloud builds cancel BUILD_ID
```

### メモリエラー

Cloud Runのメモリを増やす:

```bash
gcloud run services update live2d-lipsync \
  --memory 2Gi \
  --region asia-northeast1
```

### ビルドタイムアウト

Cloud Buildのタイムアウトを延長:

```bash
gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME} \
  --timeout=20m
```

## 確認コマンド

デプロイ状態を確認:

```bash
gcloud run services describe live2d-lipsync --region asia-northeast1
```

ログを確認:

```bash
gcloud run services logs read live2d-lipsync --region asia-northeast1
```

サービスURLを取得:

```bash
gcloud run services describe live2d-lipsync \
  --region asia-northeast1 \
  --format 'value(status.url)'
```
