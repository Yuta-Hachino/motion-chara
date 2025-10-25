#!/bin/bash

# Docker コンテナを使った Cloud Run デプロイスクリプト

set -e

# .env.deploy ファイルがあれば読み込む
if [ -f .env.deploy ]; then
  echo "📄 .env.deploy から環境変数を読み込みます..."
  export $(cat .env.deploy | grep -v '^#' | grep -v '^$' | xargs)
fi

# 環境変数のチェック
if [ -z "$PROJECT_ID" ]; then
  echo "❌ エラー: PROJECT_ID 環境変数が設定されていません"
  echo ""
  echo "設定方法:"
  echo "1. .env.deploy ファイルを作成（推奨）:"
  echo "   cp .env.deploy.example .env.deploy"
  echo "   # .env.deploy を編集して実際の値を設定"
  echo ""
  echo "2. または環境変数を直接設定:"
  echo "   export PROJECT_ID=\"your-gcp-project-id\""
  exit 1
fi

if [ -z "$GOOGLE_TTS_API_KEY" ]; then
  echo "❌ エラー: GOOGLE_TTS_API_KEY 環境変数が設定されていません"
  echo ""
  echo "設定方法:"
  echo "1. .env.deploy ファイルを作成（推奨）:"
  echo "   cp .env.deploy.example .env.deploy"
  echo "   # .env.deploy を編集して実際の値を設定"
  echo ""
  echo "2. または環境変数を直接設定:"
  echo "   export GOOGLE_TTS_API_KEY=\"your-api-key\""
  exit 1
fi

# 設定
REGION="${REGION:-asia-northeast1}"
SERVICE_NAME="${SERVICE_NAME:-live2d-lipsync}"

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
