help:
	@echo "VRT（ビジュアルリグレッションテスト）用コマンド一覧:"
	@echo "  make vrt-build   # サービスをビルドして起動（初回や依存更新時に推奨）"
	@echo "  make vrt-up      # サービスをビルドせずに起動（既存イメージ利用）"
	@echo "  make vrt-test    # VRTテストを実行"
	@echo "  make vrt-update  # スナップショットを意図的に更新（UI変更時など）"
	@echo "  make vrt-down    # サービス停止"

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
