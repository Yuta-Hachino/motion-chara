# GCP Cloud Run デプロイ手順

このドキュメントでは、Live2D リップシンクアプリを Google Cloud Run にデプロイする手順を説明します。

## 前提条件

1. Google Cloud Platform アカウント
2. gcloud CLI がインストールされていること
3. Google TTS API キーが有効であること

## 手順

### 1. Google Cloud SDK のインストール（未インストールの場合）

macOS:
```bash
brew install google-cloud-sdk
```

その他のOS:
https://cloud.google.com/sdk/docs/install

### 2. gcloud CLI の初期化

```bash
gcloud init
```

プロンプトに従って:
- Google アカウントでログイン
- プロジェクトを選択（または新規作成）
- デフォルトのリージョンを設定

### 3. プロジェクトIDの確認

```bash
gcloud config get-value project
```

このプロジェクトIDをメモしてください。

### 4. デプロイスクリプトの編集

`scripts/deploy.sh` ファイルを開き、以下を設定:

```bash
PROJECT_ID="your-gcp-project-id"  # ステップ3で確認したIDに置き換え
```

### 5. Google TTS API キーの設定

環境変数を設定:

```bash
export GOOGLE_TTS_API_KEY="AIzaSyAUo1cvV18sM66Zof3Z1UN79a1j1fOdyXc"
```

または、デプロイスクリプト内で直接設定することもできます。

### 6. デプロイの実行

```bash
./scripts/deploy.sh
```

このスクリプトは以下を自動的に実行します:
1. 必要なGCP APIの有効化
2. Dockerイメージのビルド
3. Google Container Registry へのプッシュ
4. Cloud Run へのデプロイ

### 7. デプロイ完了

デプロイが完了すると、サービスURLが表示されます:
```
https://live2d-lipsync-xxxxxxxxxx-an.a.run.app
```

このURLにアクセスしてアプリを確認できます。

## 手動デプロイ（詳細手順）

スクリプトを使わず手動でデプロイする場合:

### 1. GCP プロジェクトを設定

```bash
gcloud config set project YOUR_PROJECT_ID
```

### 2. APIを有効化

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Dockerイメージをビルド＆プッシュ

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/live2d-lipsync
```

### 4. Cloud Runにデプロイ

```bash
gcloud run deploy live2d-lipsync \
  --image gcr.io/YOUR_PROJECT_ID/live2d-lipsync \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 3000 \
  --memory 1Gi \
  --cpu 1 \
  --set-env-vars GOOGLE_TTS_API_KEY=YOUR_API_KEY
```

## トラブルシューティング

### ビルドエラー

Dockerfileの問題がある場合、ローカルでビルドをテスト:

```bash
docker build -t live2d-lipsync .
docker run -p 3000:3000 -e GOOGLE_TTS_API_KEY=YOUR_API_KEY live2d-lipsync
```

### メモリ不足

Cloud Runのメモリを増やす:

```bash
gcloud run services update live2d-lipsync \
  --memory 2Gi \
  --region asia-northeast1
```

### タイムアウト

リクエストタイムアウトを延長:

```bash
gcloud run services update live2d-lipsync \
  --timeout 600 \
  --region asia-northeast1
```

## コスト見積もり

Cloud Run の料金:
- リクエスト: 100万リクエストまで無料
- CPU: 月180,000 vCPU秒まで無料
- メモリ: 月360,000 GiB秒まで無料

通常の使用では、無料枠内で収まる可能性が高いです。

詳細: https://cloud.google.com/run/pricing

## 更新デプロイ

アプリを更新した後、再度デプロイ:

```bash
./scripts/deploy.sh
```

または:

```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/live2d-lipsync
gcloud run deploy live2d-lipsync \
  --image gcr.io/YOUR_PROJECT_ID/live2d-lipsync \
  --region asia-northeast1
```

## サービスの削除

不要になった場合:

```bash
gcloud run services delete live2d-lipsync --region asia-northeast1
```

Container Registryのイメージも削除:

```bash
gcloud container images delete gcr.io/YOUR_PROJECT_ID/live2d-lipsync
```
