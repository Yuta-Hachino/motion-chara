.PHONY: help install dev build clean rebuild typecheck validate test publish-patch publish-minor publish-major publish-beta publish-dry pack link unlink info prepare-github release-tag release-push release-github release-patch release-minor release-major

# デフォルトターゲット: ヘルプを表示
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  make install          - Install dependencies"
	@echo "  make dev              - Start development mode (watch)"
	@echo "  make build            - Build the package"
	@echo "  make clean            - Clean build output"
	@echo "  make rebuild          - Clean and rebuild"
	@echo "  make typecheck        - Run TypeScript type checking"
	@echo "  make validate         - Type check and build"
	@echo "  make test             - Test build"
	@echo ""
	@echo "Publishing:"
	@echo "  make publish-patch    - Publish patch version (1.0.0 → 1.0.1)"
	@echo "  make publish-minor    - Publish minor version (1.0.0 → 1.1.0)"
	@echo "  make publish-major    - Publish major version (1.0.0 → 2.0.0)"
	@echo "  make publish-beta     - Publish beta version"
	@echo "  make publish-dry      - Dry run (test without publishing)"
	@echo ""
	@echo "Local Testing:"
	@echo "  make pack             - Create .tgz package"
	@echo "  make link             - Create local symlink"
	@echo "  make unlink           - Remove local symlink"
	@echo "  make info             - Show package info"
	@echo ""
	@echo "GitHub Release:"
	@echo "  make prepare-github   - Prepare dist for GitHub install"
	@echo "  make release-github   - Build, commit dist, and push"
	@echo "  make release-tag      - Create Git tag (usage: make release-tag TAG=v1.0.0)"
	@echo "  make release-push     - Push commits and tags"
	@echo ""
	@echo "Automated Release (All-in-one):"
	@echo "  make release-patch    - Auto release patch version (1.0.0 → 1.0.1)"
	@echo "  make release-minor    - Auto release minor version (1.0.0 → 1.1.0)"
	@echo "  make release-major    - Auto release major version (1.0.0 → 2.0.0)"
	@echo ""

# 依存関係のインストール
install:
	npm install

# 開発モード
dev:
	npm run dev

# ビルド
build:
	npm run build

# クリーン
clean:
	npm run clean

# 再ビルド
rebuild:
	npm run rebuild

# 型チェック
typecheck:
	npm run typecheck

# バリデーション
validate:
	npm run validate

# テスト
test:
	npm run test:build

# パッチ公開
publish-patch:
	npm run publish:patch

# マイナー公開
publish-minor:
	npm run publish:minor

# メジャー公開
publish-major:
	npm run publish:major

# ベータ公開
publish-beta:
	npm run publish:beta

# ドライラン
publish-dry:
	npm run publish:dry

# パック
pack:
	npm run pack:local

# リンク
link:
	npm run link:local

# アンリンク
unlink:
	npm run unlink:local

# 情報表示
info:
	npm run info

# GitHub リリース準備
prepare-github:
	npm run prepare:github

# GitHub リリース（ビルド + コミット + プッシュ）
release-github:
	npm run release:github

# タグ作成
release-tag:
	@if [ -z "$(TAG)" ]; then \
		echo "Error: TAG is required. Usage: make release-tag TAG=v1.0.0"; \
		exit 1; \
	fi
	git tag -a $(TAG) -m "Release $(TAG)"
	@echo "Tag $(TAG) created. Run 'make release-push' to push."

# プッシュ
release-push:
	npm run release:push

# 自動リリース: パッチ (1.0.0 → 1.0.1)
release-patch:
	@echo "🚀 Starting automated patch release..."
	@echo ""
	@echo "Step 1/5: Running validation..."
	npm run validate
	@echo ""
	@echo "Step 2/5: Bumping patch version..."
	npm version patch
	@echo ""
	@echo "Step 3/5: Building package..."
	npm run build
	@echo ""
	@echo "Step 4/5: Committing dist files..."
	git add dist/
	git diff --staged --quiet || git commit -m "build: update dist files for $$(node -p "require('./package.json').version")"
	@echo ""
	@echo "Step 5/5: Pushing to GitHub..."
	git push --follow-tags
	@echo ""
	@echo "✅ Release complete! GitHub Actions will create the release."
	@echo "Version: $$(node -p "require('./package.json').version")"

# 自動リリース: マイナー (1.0.0 → 1.1.0)
release-minor:
	@echo "🚀 Starting automated minor release..."
	@echo ""
	@echo "Step 1/5: Running validation..."
	npm run validate
	@echo ""
	@echo "Step 2/5: Bumping minor version..."
	npm version minor
	@echo ""
	@echo "Step 3/5: Building package..."
	npm run build
	@echo ""
	@echo "Step 4/5: Committing dist files..."
	git add dist/
	git diff --staged --quiet || git commit -m "build: update dist files for $$(node -p "require('./package.json').version")"
	@echo ""
	@echo "Step 5/5: Pushing to GitHub..."
	git push --follow-tags
	@echo ""
	@echo "✅ Release complete! GitHub Actions will create the release."
	@echo "Version: $$(node -p "require('./package.json').version")"

# 自動リリース: メジャー (1.0.0 → 2.0.0)
release-major:
	@echo "🚀 Starting automated major release..."
	@echo ""
	@echo "Step 1/5: Running validation..."
	npm run validate
	@echo ""
	@echo "Step 2/5: Bumping major version..."
	npm version major
	@echo ""
	@echo "Step 3/5: Building package..."
	npm run build
	@echo ""
	@echo "Step 4/5: Committing dist files..."
	git add dist/
	git diff --staged --quiet || git commit -m "build: update dist files for $$(node -p "require('./package.json').version")"
	@echo ""
	@echo "Step 5/5: Pushing to GitHub..."
	git push --follow-tags
	@echo ""
	@echo "✅ Release complete! GitHub Actions will create the release."
	@echo "Version: $$(node -p "require('./package.json').version")"
