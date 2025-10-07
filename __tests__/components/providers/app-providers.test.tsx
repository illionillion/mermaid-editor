import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { AppProviders } from "@/components/providers/app-providers";

/**
 * AppProvidersコンポーネントのテストスイート
 * @description プロバイダー包装、テーマ適用、ReactFlow統合を検証
 */
describe("AppProviders", () => {
  // UIProviderをモック
  vi.mock("@yamada-ui/react", () => ({
    UIProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="ui-provider">{children}</div>
    ),
  }));

  // ReactFlowProviderをモック
  vi.mock("@xyflow/react", () => ({
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="react-flow-provider">{children}</div>
    ),
  }));

  describe("基本表示", () => {
    test("子要素が正しくレンダリングされる", () => {
      render(
        <AppProviders>
          <div data-testid="test-child">テスト子要素</div>
        </AppProviders>
      );

      expect(screen.getByTestId("test-child")).toBeInTheDocument();
      expect(screen.getByText("テスト子要素")).toBeInTheDocument();
    });

    test("UIProviderが適用される", () => {
      render(
        <AppProviders>
          <div data-testid="test-child">テスト内容</div>
        </AppProviders>
      );

      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
    });

    test("ReactFlowProviderが適用される", () => {
      render(
        <AppProviders>
          <div data-testid="test-child">テスト内容</div>
        </AppProviders>
      );

      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();
    });
  });

  describe("プロバイダーの入れ子構造", () => {
    test("UIProviderがReactFlowProviderを包む構造になっている", () => {
      render(
        <AppProviders>
          <div data-testid="test-child">テスト内容</div>
        </AppProviders>
      );

      const uiProvider = screen.getByTestId("ui-provider");
      const reactFlowProvider = screen.getByTestId("react-flow-provider");

      // UIProviderがReactFlowProviderを包んでいることを確認
      expect(uiProvider).toContainElement(reactFlowProvider);
      expect(reactFlowProvider).toContainElement(screen.getByTestId("test-child"));
    });

    test("プロバイダーの階層構造が正しい", () => {
      render(
        <AppProviders>
          <div data-testid="test-child">テスト内容</div>
        </AppProviders>
      );

      const testChild = screen.getByTestId("test-child");
      const reactFlowProvider = screen.getByTestId("react-flow-provider");
      const uiProvider = screen.getByTestId("ui-provider");

      // 期待する階層: UIProvider > ReactFlowProvider > children
      expect(reactFlowProvider.parentElement).toBe(uiProvider);
      expect(testChild.parentElement).toBe(reactFlowProvider);
    });
  });

  describe("複数の子要素", () => {
    test("複数の子要素が全て表示される", () => {
      render(
        <AppProviders>
          <div data-testid="child-1">子要素1</div>
          <div data-testid="child-2">子要素2</div>
          <div data-testid="child-3">子要素3</div>
        </AppProviders>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    test("Reactコンポーネントも正しくレンダリングされる", () => {
      const TestComponent = ({ title }: { title: string }) => (
        <div data-testid="test-component">{title}</div>
      );

      render(
        <AppProviders>
          <TestComponent title="テストコンポーネント" />
          <span data-testid="span-element">スパン要素</span>
        </AppProviders>
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.getByText("テストコンポーネント")).toBeInTheDocument();
      expect(screen.getByTestId("span-element")).toBeInTheDocument();
    });
  });

  describe("エラーハンドリング", () => {
    test("子要素がnullでもエラーにならない", () => {
      expect(() => render(<AppProviders>{null}</AppProviders>)).not.toThrow();

      // プロバイダーは正常に動作する
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();
    });

    test("子要素がundefinedでもエラーにならない", () => {
      expect(() => render(<AppProviders>{undefined}</AppProviders>)).not.toThrow();

      // プロバイダーは正常に動作する
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();
    });

    test("空文字列の子要素でもエラーにならない", () => {
      const emptyString = "";
      expect(() => render(<AppProviders>{emptyString}</AppProviders>)).not.toThrow();

      // プロバイダーは正常に動作する
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();
    });
  });

  describe("動的な子要素", () => {
    test("条件付きレンダリングが正常に動作する", () => {
      const showContent = true;
      const hideContent = false;

      render(
        <AppProviders>
          {showContent && <div data-testid="visible-content">表示内容</div>}
          {hideContent && <div data-testid="hidden-content">非表示内容</div>}
        </AppProviders>
      );

      expect(screen.getByTestId("visible-content")).toBeInTheDocument();
      expect(screen.queryByTestId("hidden-content")).not.toBeInTheDocument();
    });

    test("配列による子要素レンダリングが動作する", () => {
      const items = ["アイテム1", "アイテム2", "アイテム3"];

      render(
        <AppProviders>
          {items.map((item, index) => (
            <div key={index} data-testid={`item-${index}`}>
              {item}
            </div>
          ))}
        </AppProviders>
      );

      expect(screen.getByTestId("item-0")).toBeInTheDocument();
      expect(screen.getByTestId("item-1")).toBeInTheDocument();
      expect(screen.getByTestId("item-2")).toBeInTheDocument();
      expect(screen.getByText("アイテム1")).toBeInTheDocument();
      expect(screen.getByText("アイテム2")).toBeInTheDocument();
      expect(screen.getByText("アイテム3")).toBeInTheDocument();
    });
  });

  describe("再レンダリング", () => {
    test("子要素の変更が正しく反映される", () => {
      const { rerender } = render(
        <AppProviders>
          <div data-testid="dynamic-content">初期内容</div>
        </AppProviders>
      );

      expect(screen.getByText("初期内容")).toBeInTheDocument();

      rerender(
        <AppProviders>
          <div data-testid="dynamic-content">更新内容</div>
        </AppProviders>
      );

      expect(screen.getByText("更新内容")).toBeInTheDocument();
      expect(screen.queryByText("初期内容")).not.toBeInTheDocument();
    });

    test("子要素の追加・削除が正しく反映される", () => {
      const { rerender } = render(
        <AppProviders>
          <div data-testid="content-1">内容1</div>
        </AppProviders>
      );

      expect(screen.getByTestId("content-1")).toBeInTheDocument();

      rerender(
        <AppProviders>
          <div data-testid="content-1">内容1</div>
          <div data-testid="content-2">内容2</div>
        </AppProviders>
      );

      expect(screen.getByTestId("content-1")).toBeInTheDocument();
      expect(screen.getByTestId("content-2")).toBeInTheDocument();

      rerender(
        <AppProviders>
          <div data-testid="content-2">内容2</div>
        </AppProviders>
      );

      expect(screen.queryByTestId("content-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("content-2")).toBeInTheDocument();
    });
  });

  describe("実際のアプリケーション統合", () => {
    test("FlowEditorとの統合を想定", () => {
      const MockFlowEditor = () => (
        <div data-testid="flow-editor">
          <div data-testid="react-flow">ReactFlow本体</div>
          <div data-testid="flow-controls">フロー操作</div>
        </div>
      );

      render(
        <AppProviders>
          <MockFlowEditor />
        </AppProviders>
      );

      // プロバイダーが適用されている
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();

      // FlowEditorが正常に表示されている
      expect(screen.getByTestId("flow-editor")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow")).toBeInTheDocument();
      expect(screen.getByTestId("flow-controls")).toBeInTheDocument();
    });

    test("ERDiagramEditorとの統合を想定", () => {
      const MockERDiagramEditor = () => (
        <div data-testid="er-diagram-editor">
          <div data-testid="er-react-flow">ERダイアグラム</div>
          <div data-testid="er-controls">ER操作</div>
        </div>
      );

      render(
        <AppProviders>
          <MockERDiagramEditor />
        </AppProviders>
      );

      // 同じプロバイダーがER図でも使用できる
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();

      expect(screen.getByTestId("er-diagram-editor")).toBeInTheDocument();
      expect(screen.getByTestId("er-react-flow")).toBeInTheDocument();
      expect(screen.getByTestId("er-controls")).toBeInTheDocument();
    });

    test("アプリケーション全体のレイアウトとの統合を想定", () => {
      const MockApp = () => (
        <div data-testid="app">
          <header data-testid="app-header">ヘッダー</header>
          <main data-testid="app-main">
            <div data-testid="editor-area">エディター領域</div>
          </main>
          <footer data-testid="app-footer">フッター</footer>
        </div>
      );

      render(
        <AppProviders>
          <MockApp />
        </AppProviders>
      );

      // アプリケーション全体がプロバイダーで包まれている
      expect(screen.getByTestId("ui-provider")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-provider")).toBeInTheDocument();

      // アプリケーションの各部分が表示される
      expect(screen.getByTestId("app")).toBeInTheDocument();
      expect(screen.getByTestId("app-header")).toBeInTheDocument();
      expect(screen.getByTestId("app-main")).toBeInTheDocument();
      expect(screen.getByTestId("app-footer")).toBeInTheDocument();
      expect(screen.getByTestId("editor-area")).toBeInTheDocument();
    });
  });

  describe("パフォーマンス", () => {
    test("大量の子要素でもレンダリングできる", () => {
      const manyChildren = Array.from({ length: 100 }, (_, i) => (
        <div key={i} data-testid={`child-${i}`}>
          子要素 {i}
        </div>
      ));

      render(<AppProviders>{manyChildren}</AppProviders>);

      // 最初と最後の要素を確認
      expect(screen.getByTestId("child-0")).toBeInTheDocument();
      expect(screen.getByTestId("child-99")).toBeInTheDocument();
      expect(screen.getByText("子要素 0")).toBeInTheDocument();
      expect(screen.getByText("子要素 99")).toBeInTheDocument();
    });

    test("ネストした構造でもパフォーマンス問題がない", () => {
      const NestedComponent = ({ level }: { level: number }) => (
        <div data-testid={`nested-${level}`}>
          レベル {level}
          {level > 0 && <NestedComponent level={level - 1} />}
        </div>
      );

      render(
        <AppProviders>
          <NestedComponent level={10} />
        </AppProviders>
      );

      // 深いネスト構造でも正常に動作
      expect(screen.getByTestId("nested-10")).toBeInTheDocument();
      expect(screen.getByTestId("nested-0")).toBeInTheDocument();
    });
  });
});
