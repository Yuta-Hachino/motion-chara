# Google Text-to-Speech API セットアップ手順

現在の API キーでは Text-to-Speech API がブロックされています。以下の手順で設定してください。

## 手順

### 1. Google Cloud Console にアクセス
https://console.cloud.google.com/

### 2. プロジェクトを選択または作成
- 既存のプロジェクト（Project ID: 707553761857）を使用するか
- 新しいプロジェクトを作成

### 3. Cloud Text-to-Speech API を有効化
1. 左メニューから「APIとサービス」→「ライブラリ」を選択
2. 検索バーで「Cloud Text-to-Speech API」を検索
3. 「Cloud Text-to-Speech API」をクリック
4. 「有効にする」ボタンをクリック

### 4. 請求アカウントを設定（必須）
1. 左メニューから「お支払い」を選択
2. 請求アカウントをリンク（無料枠でも必要）
3. クレジットカード情報を登録

**注意:** Google Cloud では無料枠があります：
- 毎月 0～400万文字まで無料
- 400万文字以上は従量課金

### 5. 新しい API キーを作成（オプション）
1. 「APIとサービス」→「認証情報」を選択
2. 「認証情報を作成」→「APIキー」をクリック
3. 作成されたキーをコピー
4. キーを制限（推奨）:
   - 「APIキーを制限」をクリック
   - 「APIの制限」→「キーを制限」
   - 「Cloud Text-to-Speech API」のみを選択
   - 保存

### 6. .env.local ファイルを更新
```bash
GOOGLE_TTS_API_KEY=your_new_api_key_here
```

### 7. 開発サーバーを再起動
```bash
# 現在のサーバーを停止（Ctrl+C）
npm run dev
```

## 代替方法：音声ファイルアップロードを使用

Google TTS API を設定せずにテストする場合：
1. 音声ファイル（MP3/WAV/OGG）を用意
2. アプリの「音声ファイルアップロード」セクションでファイルを選択
3. Live2D モデルのリップシンクをテスト

## トラブルシューティング

### API が有効化されているか確認
```bash
curl "https://texttospeech.googleapis.com/v1/voices?key=YOUR_API_KEY"
```

成功すると利用可能な音声のリストが返されます。

### エラーが続く場合
- API キーに制限がかかっていないか確認
- プロジェクトで Text-to-Speech API が有効か確認
- 請求アカウントがリンクされているか確認
- 新しいブラウザタブで Google Cloud Console を開き、キャッシュをクリア
