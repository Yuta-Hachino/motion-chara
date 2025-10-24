#!/bin/bash

# Docker コンテナを使った Cloud Run デプロイスクリプト

set -e

PROJECT_ID="gen-lang-client-0830629645"
REGION="asia-northeast1"
SERVICE_NAME="live2d-lipsync"
GOOGLE_TTS_API_KEY="AIzaSyAUo1cvV18sM66Zof3Z1UN79a1j1fOdyXc"

echo "🐳 Docker コンテナを使って Cloud Run にデプロイします"
echo ""

# 1. デプロイ用Dockerイメージをビルド
echo "📦 デプロイ用コンテナをビルド中..."
docker build -f Dockerfile.deploy -t live2d-deploy .

# 2. gcloud認証（ブラウザでログイン）
echo ""
echo "🔐 Google Cloud にログインします..."
echo "ブラウザが開くので、Google アカウントでログインしてください"
docker run --rm -it \
  -v ~/.config/gcloud:/root/.config/gcloud \
  live2d-deploy \
  gcloud auth login

# 3. プロジェクトを設定
echo ""
echo "📝 プロジェクトを設定中..."
docker run --rm \
  -v ~/.config/gcloud:/root/.config/gcloud \
  live2d-deploy \
  gcloud config set project ${PROJECT_ID}

# 4. 必要なAPIを有効化
echo ""
echo "🔧 必要な API を有効化中..."
docker run --rm \
  -v ~/.config/gcloud:/root/.config/gcloud \
  live2d-deploy \
  gcloud services enable cloudbuild.googleapis.com run.googleapis.com containerregistry.googleapis.com

# 5. アプリケーションをビルド＆デプロイ
echo ""
echo "🏗️  アプリケーションをビルドしてデプロイ中..."
echo "（この処理には5-10分かかります）"

docker run --rm \
  -v ~/.config/gcloud:/root/.config/gcloud \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -w /workspace \
  live2d-deploy \
  sh -c "
    echo '🏗️  Cloud Build でイメージをビルド...'
    gcloud builds submit --tag gcr.io/${PROJECT_ID}/${SERVICE_NAME}

    echo '☁️  Cloud Run にデプロイ...'
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
  "

# 6. サービスURLを取得
echo ""
echo "✅ デプロイ完了！"
echo ""
echo "🌐 サービス URL:"
docker run --rm \
  -v ~/.config/gcloud:/root/.config/gcloud \
  live2d-deploy \
  gcloud run services describe ${SERVICE_NAME} \
    --region ${REGION} \
    --format 'value(status.url)'

echo ""
echo "🎉 ブラウザで上記URLにアクセスしてください！"
