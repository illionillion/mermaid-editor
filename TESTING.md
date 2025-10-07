# 🧪 テストガイド

このガイドでは、プロジェクトのテスト戦略と実践的なベストプラクティスについて説明します。

## 📊 テスト構成

### ディレクトリ構造

```
features/
├── er-diagram/
│   └── __tests__/           # ER図機能のテスト
└── flowchart/
    └── __tests__/           # フローチャート機能のテスト

__tests__/
├── components/              # 共通UIコンポーネントテスト
├── setup.ts                # テストセットアップ
└── test-utils.tsx          # テストユーティリティ
```

## 🚀 テスト実行

```bash
# 全テスト実行
pnpm test:run

# ウォッチモード（開発中推奨）
pnpm test:watch

# カバレッジレポート
pnpm test:coverage

# 特定ファイルのみ実行
pnpm test:run features/er-diagram/__tests__/import-mermaid-to-er.test.ts
```

## 📝 テストの書き方

### 基本構造

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";

describe("ComponentName", () => {
  const defaultProps = { value: "test", onChange: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("基本的なレンダリング", () => {
    render(<Component {...defaultProps} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("ユーザー操作", () => {
    render(<Component {...defaultProps} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "新しい値" } });
    expect(defaultProps.onChange).toHaveBeenCalledWith("新しい値");
  });
});
```

### モッキング

```typescript
// 外部ライブラリのモック
vi.mock("prismjs", () => ({
  highlight: vi.fn(),
  languages: { mermaid: {} },
}));

// React コンポーネントのモック
vi.mock("react-simple-code-editor", () => ({
  default: ({ value, onValueChange }: any) => (
    <textarea
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
    />
  ),
}));
```

### ユーティリティ関数テスト

```typescript
import { describe, test, expect } from "vitest";
import { parseMermaidCode } from "../../../utils/mermaid/parse-mermaid-code";

describe("parseMermaidCode", () => {
  test("基本的なフローチャートをパースできる", () => {
    const code = `
      flowchart TD
        A[開始] --> B[終了]
    `;

    const result = parseMermaidCode(code);

    expect(result.nodes).toHaveLength(2);
    expect(result.edges).toHaveLength(1);
    expect(result.nodes[0]).toMatchObject({
      id: "A",
      label: "開始",
      shapeType: "rectangle",
    });
  });

  test("不正なコードでエラーが発生する", () => {
    const invalidCode = "invalid mermaid code";
    expect(() => parseMermaidCode(invalidCode)).toThrow();
  });
});
```

## 🎯 テストパターン

### 1. 基本機能テスト

レンダリング、プロパティ表示、デフォルト値の動作確認

### 2. ユーザー操作テスト

クリック、変更、キーボード操作、フォーム送信、ドラッグ&ドロップ

### 3. エラーハンドリングテスト

不正な入力値、APIエラー、境界値テスト

### 4. セキュリティテスト

```typescript
test("悪意のあるコードが安全に処理される", () => {
  const maliciousCode = '<script>alert("XSS")</script>';
  const { container } = render(
    <EditableMermaidHighlight value={maliciousCode} onChange={vi.fn()} />
  );
  expect(container.querySelector("script")).toBeNull();
});
```

## 📋 テストチェックリスト

### ✅ コンポーネントテスト

- [ ] 基本的なレンダリング
- [ ] プロパティの正しい表示
- [ ] ユーザー操作（クリック、入力等）
- [ ] コールバック関数の呼び出し
- [ ] エラー状態の処理
- [ ] アクセシビリティ（aria-label、role等）

### ✅ ユーティリティ関数テスト

- [ ] 正常系の動作
- [ ] 異常系の処理
- [ ] 境界値テスト
- [ ] 型安全性

## 🎯 実践的ベストプラクティス

### 修正前のテスト検証

コード修正前に既存テストが修正内容をカバーしているか確認。不足していればテストケース追加。

```bash
# 1. 対象テスト確認 → 2. カバレッジ確認 → 3. 必要に応じてテスト追加 → 4. 実装修正
pnpm test:run __tests__/components/ui/component-name.test.ts
pnpm test:run features/feature-name/__tests__/target.test.ts
```

### CI安定性対策

UIアニメーション待機には `findByRole` を使用：

```typescript
// ❌ CI失敗の可能性
const item = screen.getByRole("menuitem");

// ✅ アニメーション完了を待機
const item = await screen.findByRole("menuitem");
```

### テスト設計

- **正常系**: 基本的な動作確認
- **異常系**: エラーハンドリング
- **境界値**: 空文字、null、極値
- **エッジケース**: 特殊パターン
- **国際化**: 日本語入力対応

### 効率的テスト実行

変更ファイル関連のテストのみ実行して開発速度向上：

```bash
# 全体実行は避ける
pnpm test:run features/specific/__tests__/target.test.ts
```

## 🔧 環境設定

### vitest.config.ts

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.config.*", "coverage/**"],
    },
  },
});
```

### vitest.setup.ts

```typescript
import "@testing-library/jest-dom";

// グローバルなモックやセットアップ
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## 🐛 トラブルシューティング

### よくある問題

- **間欠的失敗**: `waitFor` や `findBy*` を使用
- **モック効かない**: `vi.clearAllMocks()` を `beforeEach` で実行
- **DOM操作失敗**: `screen.debug()` で状態確認

### デバッグ

```typescript
// DOM確認
screen.debug();

// 特定要素のみ確認
screen.debug(screen.getByTestId("my-element"));

// 非同期待機
await waitFor(() => {
  expect(screen.getByText("完了")).toBeInTheDocument();
});
```

## 📈 継続的改善

### カバレッジ向上

1. **未テスト箇所の特定**: カバレッジレポートで確認
2. **優先度付け**: 重要な機能から順次テスト追加
3. **リファクタリング**: テストしやすいコード構造に改善

### テスト品質向上

- **定期的なレビュー**: テストコードの品質チェック
- **パフォーマンス**: テスト実行時間の最適化
- **メンテナンス性**: 読みやすく保守しやすいテスト

---

詳細な開発情報は [開発者ガイド](./DEVELOPMENT.md) をご覧ください。
