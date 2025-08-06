# 🧪 テストガイド

このガイドでは、Mermaid フローチャート エディターのテスト戦略、実行方法、新しいテストの書き方について説明します。

## 📊 テスト概要

### テストカバレッジ

現在のプロジェクトは **97.5%以上** の高いテストカバレッジを維持しています：

- **Lines**: 97.5%
- **Statements**: 97.5%
- **Functions**: 90%
- **Branches**: 90%

### テスト構成

```
__tests__/
├── components/           # コンポーネントテスト
│   ├── editor/          # エディター系コンポーネント
│   ├── flow/            # React Flow関連コンポーネント
│   ├── mermaid/         # Mermaidコード処理関連
│   ├── node/            # ノード操作関連
│   └── ui/              # UIコンポーネント
└── utils/               # ユーティリティ関数テスト
    └── mermaid/         # Mermaidパーサー・生成器
```

## 🚀 テスト実行

### 基本的なテスト実行

```bash
# 全テスト実行
pnpm test

# ウォッチモード（開発中推奨）
pnpm test:watch

# カバレッジレポート生成
pnpm test:coverage

# 特定のテストファイルのみ実行
pnpm test components/mermaid/editable-mermaid-highlight.test.tsx
```

### CI/CD での実行

```bash
# CI環境での実行（シングルラン）
pnpm test:run

# 型チェック
pnpm type-check

# リント
pnpm lint
```

## 🏗️ テスト技術スタック

### 主要ライブラリ

- **Vitest**: 高速なテストランナー
- **@testing-library/react**: React コンポーネントテスト
- **@testing-library/jest-dom**: DOM アサーション
- **jsdom**: ブラウザ環境のシミュレーション

### モッキング

```typescript
// PrismJSのモック例
vi.mock("prismjs", () => ({
  highlight: vi.fn(),
  languages: {
    mermaid: {},
  },
}));

// react-simple-code-editorのモック例
vi.mock("react-simple-code-editor", () => ({
  default: ({ value, onValueChange, placeholder, highlight }: any) => {
    // カスタムモックコンポーネント
  },
}));
```

## 📝 テストの書き方

### コンポーネントテストの基本構造

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { MyComponent } from "../../../components/MyComponent";

describe("MyComponent", () => {
  const defaultProps = {
    value: "test value",
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("基本機能", () => {
    test("コンポーネントが正しくレンダリングされる", () => {
      render(<MyComponent {...defaultProps} />);

      expect(screen.getByTestId("my-component")).toBeInTheDocument();
      expect(screen.getByDisplayValue(defaultProps.value)).toBeInTheDocument();
    });
  });

  describe("ユーザー操作", () => {
    test("値の変更時にonChangeが呼ばれる", () => {
      render(<MyComponent {...defaultProps} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "新しい値" } });

      expect(defaultProps.onChange).toHaveBeenCalledWith("新しい値");
    });
  });
});
```

### ユーティリティ関数テストの例

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

各コンポーネントの基本的な動作を確認：

- レンダリング
- プロパティの表示
- デフォルト値の動作

### 2. ユーザー操作テスト

ユーザーインタラクションをシミュレート：

- クリック、変更、キーボード操作
- フォーム送信
- ドラッグ&ドロップ

### 3. エラーハンドリングテスト

エラー状態の適切な処理を確認：

- 不正な入力値
- API エラー
- 境界値テスト

### 4. セキュリティテスト

XSS などのセキュリティ脆弱性を確認：

```typescript
test("悪意のあるコードが安全に処理される", () => {
  const maliciousCode = '<script>alert("XSS")</script>';
  const { container } = render(
    <EditableMermaidHighlight value={maliciousCode} onChange={vi.fn()} />
  );

  // スクリプトタグが実行されていないことを確認
  expect(container.querySelector("script")).toBeNull();
});
```

## 📋 テストチェックリスト

新しい機能を追加する際のテストチェックリスト：

### ✅ コンポーネントテスト

- [ ] 基本的なレンダリング
- [ ] プロパティの正しい表示
- [ ] ユーザー操作（クリック、入力、など）
- [ ] コールバック関数の呼び出し
- [ ] エラー状態の処理
- [ ] アクセシビリティ（aria-label、role など）

### ✅ ユーティリティ関数テスト

- [ ] 正常系の動作
- [ ] 異常系の処理
- [ ] 境界値テスト
- [ ] 型安全性

### ✅ 統合テスト

- [ ] コンポーネント間の連携
- [ ] データフローの確認
- [ ] 状態管理の動作

## 🔧 テスト環境設定

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

## 🐛 デバッグとトラブルシューティング

### よくある問題

**Q: テストが間欠的に失敗する**
A: 非同期処理の待機不足。`waitFor` や `findBy*` を使用

**Q: モックが効かない**
A: `vi.clearAllMocks()` を `beforeEach` で実行

**Q: DOM 操作テストが失敗する**
A: `screen.debug()` でDOMの状態を確認

### デバッグテクニック

```typescript
// DOM の状態を確認
screen.debug();

// 特定の要素のみ確認
screen.debug(screen.getByTestId("my-element"));

// 非同期処理の待機
await waitFor(() => {
  expect(screen.getByText("読み込み完了")).toBeInTheDocument();
});
```

## 📈 継続的改善

### カバレッジの向上

1. **未テスト箇所の特定**: カバレッジレポートで確認
2. **優先度付け**: 重要な機能から順次テスト追加
3. **リファクタリング**: テストしやすいコード構造に改善

### テスト品質の向上

- **定期的なレビュー**: テストコードの品質チェック
- **パフォーマンス**: テスト実行時間の最適化
- **メンテナンス性**: 読みやすく保守しやすいテスト

---

詳細な開発情報は [開発者ガイド](./DEVELOPMENT.md) をご覧ください。
