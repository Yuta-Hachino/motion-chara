#!/bin/bash

# Live2D リップシンクアプリ - Cloud Run デプロイスクリプト

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
REGION="${REGION:-asia-northeast1}"  # デフォルトは東京リージョン
SERVICE_NAME="${SERVICE_NAME:-live2d-lipsync}"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "🚀 Live2D リップシンクアプリをCloud Runにデプロイします"
echo ""

# 1. GCPプロジェクトを設定
echo "📝 GCPプロジェクトを設定: ${PROJECT_ID}"
gcloud config set project ${PROJECT_ID}

# 2. 必要なAPIを有効化
echo "🔧 必要なAPIを有効化..."
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  containerregistry.googleapis.com

# 3. Dockerイメージをビルド
echo "🏗️  Dockerイメージをビルド..."
gcloud builds submit --tag ${IMAGE_NAME}

# 4. Cloud Runにデプロイ
echo "☁️  Cloud Runにデプロイ..."
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --timeout 300 \
  --max-instances 10 \
  --set-env-vars GOOGLE_TTS_API_KEY=${GOOGLE_TTS_API_KEY}

echo ""
echo "✅ デプロイ完了！"
echo ""
echo "🌐 サービスURL:"
gcloud run services describe ${SERVICE_NAME} --region ${REGION} --format 'value(status.url)'
