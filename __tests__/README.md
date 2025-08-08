# テストユーティリティの使用方法

## カスタムテストユーティリティ

プロジェクトでは、Yamada UIコンポーネントを正しくテストするためのカスタムテストユーティリティを提供しています。

### test-utils.tsx の使用

```tsx
// 従来の@testing-library/reactの代わりにカスタムrenderを使用
import { render, screen, fireEvent } from "../../test-utils";
import { describe, test, expect, vi, beforeEach } from "vitest";
```

### 主な機能

#### 1. UIProviderラッパー

- デフォルトでUIProviderでコンポーネントをラップします
- Yamada UIのテーマやコンテキストが正しく適用されます

```tsx
// デフォルトでUIProviderが適用される
render(<YourComponent />);

// UIProviderを無効にしたい場合
render(<YourComponent />, { withProvider: false });
```

#### 2. カスタムプロバイダー設定

```tsx
// UIProviderにカスタムプロパティを渡す
render(<YourComponent />, {
  providerProps: {
    theme: customTheme,
    colorMode: "dark",
  },
});
```

#### 3. user-eventの統合

```tsx
// userオブジェクトが自動的に利用可能
const { user } = render(<YourComponent />);
await user.click(screen.getByText("ボタン"));
```

### セットアップファイル

`__tests__/setup.ts` では以下のモックが設定されています：

- `window.matchMedia` - レスポンシブデザインのテスト用
- `ResizeObserver` - サイズ変更の監視用
- `IntersectionObserver` - 可視性の監視用

### 使用例

```tsx
import { render, screen, fireEvent } from "../../test-utils";
import { describe, test, expect, vi } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  test("正しく表示される", () => {
    render(<MyComponent />);

    expect(screen.getByText("期待するテキスト")).toBeInTheDocument();
  });

  test("クリックイベントが動作する", async () => {
    const handleClick = vi.fn();
    const { user } = render(<MyComponent onClick={handleClick} />);

    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### 既存のテストファイルの移行

1. インポートを変更：

```tsx
// 変更前
import { render, screen, fireEvent } from "@testing-library/react";

// 変更後
import { screen, fireEvent } from "@testing-library/react";
import { render } from "../../test-utils";
```

2. UIProviderが適用されることで、以前は失敗していたYamada UIコンポーネントのテストが正常に動作するようになります。

## 注意事項

- すべてのYamada UIコンポーネントをテストする際は、このカスタムrenderを使用してください
- プレーンなReactコンポーネント（UIライブラリを使用しない）の場合は、`withProvider: false`を指定できます
- テストが遅い場合は、必要に応じてUIProviderを無効にすることを検討してください
