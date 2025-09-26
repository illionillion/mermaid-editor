help:
	@echo "VRT（ビジュアルリグレッションテスト）用コマンド一覧:"
	@echo "  make vrt-build   # サービスをビルドして起動（初回や依存更新時に推奨）"
	@echo "  make vrt-up      # サービスをビルドせずに起動（既存イメージ利用）"
	@echo "  make vrt-test    # VRTテストを実行"
	@echo "  make vrt-update  # スナップショットを意図的に更新（UI変更時など）"
	@echo "  make vrt-down    # サービス停止"
	@echo ""
	@echo "ルール管理用コマンド（実験的機能）:"
	@echo "  make add-rule    # copilot-instructions.mdに新しいルールを追加"

vrt-build:
	docker compose -f compose.vrt.yml up -d --build

vrt-up:
	docker compose -f compose.vrt.yml up -d

vrt-test:
	docker exec mermaid-editor-vrt pnpm test:vrt

vrt-update:
	docker exec mermaid-editor-vrt pnpm test:vrt -u

vrt-down:
	docker compose -f compose.vrt.yml down

# ルール管理（実験的機能）
add-rule:
	@echo "現在は手動でルールを追加してください："
	@echo ".github/copilot-instructions.md の <!-- AUTO_RULES_START --> セクション内"
	@echo "将来的にはスクリプト化予定です"
