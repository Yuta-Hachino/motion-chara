#!/bin/bash

# Live2D リップシンクアプリ - Cloud Run デプロイスクリプト

set -e

# 設定
PROJECT_ID="gen-lang-client-0830629645"  # GCPプロジェクトIDに置き換えてください
REGION="asia-northeast1"  # 東京リージョン
SERVICE_NAME="live2d-lipsync"
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
