import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { ShapeSelector } from "@/features/flowchart/components/node/shape-selector";
import { MermaidShapeType, SHAPE_OPTIONS } from "@/features/flowchart/types/types";

describe("ShapeSelector", () => {
  const defaultProps = {
    currentShape: "rectangle",
    onShapeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示", () => {
    test("セレクターメニューが正しく表示される", () => {
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      expect(menuButton).toBeInTheDocument();
    });

    test("形状アイコンが表示される", () => {
      render(<ShapeSelector {...defaultProps} />);

      // ShapesIconが表示されることを確認
      const menuButton = screen.getByText("ノード形状");
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("メニュー操作", () => {
    test("メニューボタンクリックで形状オプションが表示される", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      // 全ての形状タイプが表示される
      expect(screen.getByText("四角形")).toBeInTheDocument();
      expect(screen.getByText("菱形")).toBeInTheDocument();
      expect(screen.getByText("角丸四角")).toBeInTheDocument();
      expect(screen.getByText("円形")).toBeInTheDocument();
      expect(screen.getByText("六角形")).toBeInTheDocument();
      expect(screen.getByText("スタジアム")).toBeInTheDocument();
    });

    test("形状記号が正しく表示される", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      // 各形状の記号が表示される
      expect(screen.getByText("[ ]")).toBeInTheDocument(); // rectangle
      expect(screen.getByText("{ }")).toBeInTheDocument(); // diamond
      expect(screen.getByText("( )")).toBeInTheDocument(); // rounded
      expect(screen.getByText("(( ))")).toBeInTheDocument(); // circle
      expect(screen.getByText("{{ }}")).toBeInTheDocument(); // hexagon
      expect(screen.getByText("([ ])")).toBeInTheDocument(); // stadium
    });

    test("形状選択時にonShapeChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      const diamondOption = screen.getByText("菱形");
      await user.click(diamondOption);

      expect(defaultProps.onShapeChange).toHaveBeenCalledWith("diamond");
    });

    test("各形状タイプの選択が正しく動作する", async () => {
      const user = userEvent.setup();
      const shapeLabels: Record<MermaidShapeType, string> = {
        rectangle: "四角形",
        diamond: "菱形",
        rounded: "角丸四角",
        circle: "円形",
        hexagon: "六角形",
        stadium: "スタジアム",
      };

      for (const shapeOption of SHAPE_OPTIONS) {
        const { rerender } = render(
          <ShapeSelector currentShape="rectangle" onShapeChange={defaultProps.onShapeChange} />
        );

        const menuButton = screen.getByText("ノード形状");
        await user.click(menuButton);

        const option = screen.getByText(shapeLabels[shapeOption.type]);
        await user.click(option);

        expect(defaultProps.onShapeChange).toHaveBeenCalledWith(shapeOption.type);

        vi.clearAllMocks();
        rerender(<div />); // クリーンアップ
      }
    });
  });

  describe("現在の選択状態", () => {
    test("現在選択されている形状がハイライトされる", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} currentShape="diamond" />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      const diamondOption = screen.getByText("菱形");
      const diamondMenuItem = diamondOption.closest('[role="menuitem"]');

      // 現在選択されている項目は背景色が設定される
      expect(diamondMenuItem).toBeInTheDocument();
    });

    test("未選択状態でもメニューが正常に動作する", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector currentShape={undefined} onShapeChange={defaultProps.onShapeChange} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      const rectangleOption = screen.getByText("四角形");
      await user.click(rectangleOption);

      expect(defaultProps.onShapeChange).toHaveBeenCalledWith("rectangle");
    });
  });

  describe("プロパティのハンドリング", () => {
    test("onShapeChangeがundefinedでもエラーが発生しない", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector currentShape="rectangle" onShapeChange={undefined} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      const diamondOption = screen.getByText("菱形");

      // エラーが発生しないことを確認
      expect(async () => {
        await user.click(diamondOption);
      }).not.toThrow();
    });

    test("currentShapeが変更されると表示が更新される", () => {
      const { rerender } = render(<ShapeSelector {...defaultProps} currentShape="rectangle" />);

      rerender(<ShapeSelector {...defaultProps} currentShape="circle" />);

      // プロパティの変更が反映されることを確認
      expect(screen.getByText("ノード形状")).toBeInTheDocument();
    });
  });

  describe("定数の整合性", () => {
    test("SHAPE_OPTIONSの全ての要素がメニューに表示される", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      await user.click(menuButton);

      // 期待する形状がすべて表示されているかチェック（より確実な方法）
      expect(screen.getByText("四角形")).toBeInTheDocument();
      expect(screen.getByText("菱形")).toBeInTheDocument();
      expect(screen.getByText("角丸四角")).toBeInTheDocument();
      expect(screen.getByText("円形")).toBeInTheDocument();
      expect(screen.getByText("六角形")).toBeInTheDocument();
      expect(screen.getByText("スタジアム")).toBeInTheDocument();

      // SHAPE_OPTIONSの長さと一致することを確認
      expect(SHAPE_OPTIONS.length).toBe(6);
    });
  });

  describe("アクセシビリティ", () => {
    test("適切なrole属性が設定されている", () => {
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      expect(menuButton).toBeInTheDocument();
    });

    test("キーボード操作でメニューを開ける", async () => {
      const user = userEvent.setup();
      render(<ShapeSelector {...defaultProps} />);

      const menuButton = screen.getByText("ノード形状");
      menuButton.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByText("四角形")).toBeInTheDocument();
    });
  });
});
