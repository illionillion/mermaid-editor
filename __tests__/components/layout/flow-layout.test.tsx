import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { FlowLayout } from "@/components/layout/flow-layout";

/**
 * ReactFlowコンポーネントをモック
 * @description テスト環境でReactFlowの依存関係を模擬
 */
vi.mock("@xyflow/react", () => ({
  Background: () => <div data-testid="react-flow-background" />,
  Controls: () => <div data-testid="react-flow-controls" />,
  MiniMap: () => <div data-testid="react-flow-minimap" />,
}));

/**
 * ContributionPanelコンポーネントをモック
 * @description テスト環境でContributionPanelの依存関係を模擬
 */
vi.mock("@/components/ui/contribution-panel", () => ({
  ContributionPanel: () => <div data-testid="contribution-panel" />,
}));

/**
 * FlowLayoutコンポーネントのテストスイート
 * @description レイアウトコンポーネント配置、子要素レンダリング、ReactFlow統合を検証
 */
describe("FlowLayout", () => {
  describe("基本表示", () => {
    test("すべてのReactFlowコンポーネントが表示される", () => {
      render(
        <FlowLayout>
          <div data-testid="child-content">テスト内容</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
    });

    test("ContributionPanelが表示される", () => {
      render(
        <FlowLayout>
          <div data-testid="child-content">テスト内容</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();
    });

    test("子要素が正しくレンダリングされる", () => {
      render(
        <FlowLayout>
          <div data-testid="child-content">テスト内容</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("child-content")).toBeInTheDocument();
      expect(screen.getByText("テスト内容")).toBeInTheDocument();
    });
  });

  describe("複数の子要素", () => {
    test("複数の子要素が全て表示される", () => {
      render(
        <FlowLayout>
          <div data-testid="child-1">子要素1</div>
          <div data-testid="child-2">子要素2</div>
          <div data-testid="child-3">子要素3</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
      expect(screen.getByText("子要素1")).toBeInTheDocument();
      expect(screen.getByText("子要素2")).toBeInTheDocument();
      expect(screen.getByText("子要素3")).toBeInTheDocument();
    });

    test("Reactコンポーネントも正しくレンダリングされる", () => {
      const TestComponent = ({ message }: { message: string }) => (
        <div data-testid="test-component">{message}</div>
      );

      render(
        <FlowLayout>
          <TestComponent message="コンポーネントテスト" />
          <span data-testid="span-element">スパン要素</span>
        </FlowLayout>
      );

      expect(screen.getByTestId("test-component")).toBeInTheDocument();
      expect(screen.getByText("コンポーネントテスト")).toBeInTheDocument();
      expect(screen.getByTestId("span-element")).toBeInTheDocument();
      expect(screen.getByText("スパン要素")).toBeInTheDocument();
    });
  });

  describe("レンダリング順序", () => {
    test("すべてのコンポーネントが正しく表示される", () => {
      render(
        <FlowLayout>
          <div data-testid="main-content">メイン内容</div>
        </FlowLayout>
      );

      // 必要なコンポーネントがすべて存在することを確認
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("main-content")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();
    });
  });

  describe("エッジケース", () => {
    test("子要素がない場合でもエラーにならない", () => {
      expect(() => render(<FlowLayout>{null}</FlowLayout>)).not.toThrow();

      // ReactFlowコンポーネントは表示される
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();
    });

    test("undefinedの子要素でもエラーにならない", () => {
      expect(() => render(<FlowLayout>{undefined}</FlowLayout>)).not.toThrow();

      // ReactFlowコンポーネントは表示される
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();
    });

    test("空の配列でもエラーにならない", () => {
      expect(() => render(<FlowLayout>{[]}</FlowLayout>)).not.toThrow();

      // ReactFlowコンポーネントは表示される
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();
    });

    test("条件付きレンダリングも正常に動作する", () => {
      const showChild = true;
      const hideChild = false;

      render(
        <FlowLayout>
          {showChild && <div data-testid="conditional-child">条件付き子要素</div>}
          {hideChild && <div data-testid="hidden-child">非表示要素</div>}
        </FlowLayout>
      );

      expect(screen.getByTestId("conditional-child")).toBeInTheDocument();
      expect(screen.queryByTestId("hidden-child")).not.toBeInTheDocument();
    });
  });

  describe("再レンダリング", () => {
    test("子要素の変更が正しく反映される", () => {
      const { rerender } = render(
        <FlowLayout>
          <div data-testid="dynamic-child">初期内容</div>
        </FlowLayout>
      );

      expect(screen.getByText("初期内容")).toBeInTheDocument();

      rerender(
        <FlowLayout>
          <div data-testid="dynamic-child">更新内容</div>
        </FlowLayout>
      );

      expect(screen.getByText("更新内容")).toBeInTheDocument();
      expect(screen.queryByText("初期内容")).not.toBeInTheDocument();
    });

    test("子要素の追加・削除が正しく反映される", () => {
      const { rerender } = render(
        <FlowLayout>
          <div data-testid="child-1">子要素1</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.queryByTestId("child-2")).not.toBeInTheDocument();

      rerender(
        <FlowLayout>
          <div data-testid="child-1">子要素1</div>
          <div data-testid="child-2">子要素2</div>
        </FlowLayout>
      );

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();

      rerender(
        <FlowLayout>
          <div data-testid="child-2">子要素2</div>
        </FlowLayout>
      );

      expect(screen.queryByTestId("child-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
    });
  });

  describe("統合テスト", () => {
    test("実際のFlowEditorコンポーネントとの統合を想定", () => {
      // 実際のFlowEditorで使用されるような子要素の構造をテスト
      const MockFlowEditor = () => (
        <div data-testid="flow-editor">
          <div data-testid="react-flow-wrapper">ReactFlow本体</div>
          <div data-testid="flow-panel">フロー操作パネル</div>
        </div>
      );

      render(
        <FlowLayout>
          <MockFlowEditor />
        </FlowLayout>
      );

      // FlowLayoutの全要素が表示される
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();

      // FlowEditorの内容も表示される
      expect(screen.getByTestId("flow-editor")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("flow-panel")).toBeInTheDocument();
    });

    test("ERDiagramEditorとの統合を想定", () => {
      const MockERDiagramEditor = () => (
        <div data-testid="er-diagram-editor">
          <div data-testid="er-react-flow-wrapper">ERダイアグラム</div>
          <div data-testid="er-panel">ER操作パネル</div>
        </div>
      );

      render(
        <FlowLayout>
          <MockERDiagramEditor />
        </FlowLayout>
      );

      // 同じFlowLayoutがER図でも使用できることを確認
      expect(screen.getByTestId("react-flow-controls")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-minimap")).toBeInTheDocument();
      expect(screen.getByTestId("react-flow-background")).toBeInTheDocument();
      expect(screen.getByTestId("contribution-panel")).toBeInTheDocument();

      expect(screen.getByTestId("er-diagram-editor")).toBeInTheDocument();
      expect(screen.getByTestId("er-react-flow-wrapper")).toBeInTheDocument();
      expect(screen.getByTestId("er-panel")).toBeInTheDocument();
    });
  });
});
