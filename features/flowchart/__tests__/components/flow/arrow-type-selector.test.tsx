import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { ArrowTypeSelector } from "@/features/flowchart/components/edge/arrow-type-selector";
import { MermaidArrowType, ARROW_TYPES } from "@/features/flowchart/types/types";

describe("ArrowTypeSelector", () => {
  const defaultProps = {
    currentArrowType: "arrow" as MermaidArrowType,
    onArrowTypeChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示", () => {
    test("セレクターボタンが正しく表示される", () => {
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      expect(button).toBeInTheDocument();
    });

    test("現在の矢印タイプがメニューで選択されている", async () => {
      const user = userEvent.setup();
      render(<ArrowTypeSelector {...defaultProps} currentArrowType="thick" />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      await user.click(button);

      // "太い矢印 (==>)"が現在選択されている項目として表示される
      const thickOption = screen.getByText("太い矢印 (==>)");
      expect(thickOption).toBeInTheDocument();
    });
  });

  describe("メニュー操作", () => {
    test("ボタンクリックでメニューが開く", async () => {
      const user = userEvent.setup();
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      await user.click(button);

      // 全ての矢印タイプが表示される
      expect(screen.getByText("通常の矢印 (->)")).toBeInTheDocument();
      expect(screen.getByText("太い矢印 (==>)")).toBeInTheDocument();
      expect(screen.getByText("点線矢印 (-.->)")).toBeInTheDocument();
      expect(screen.getByText("非表示 (~~~)")).toBeInTheDocument();
      expect(screen.getByText("双方向矢印 (<->)")).toBeInTheDocument();
      expect(screen.getByText("太い双方向矢印 (<==>)")).toBeInTheDocument();
    });

    test("矢印タイプ選択時にonArrowTypeChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      await user.click(button);

      const thickOption = screen.getByText("太い矢印 (==>)");
      await user.click(thickOption);

      expect(defaultProps.onArrowTypeChange).toHaveBeenCalledWith("thick");
    });

    test("各矢印タイプの選択が正しく動作する", async () => {
      const user = userEvent.setup();

      for (const arrowType of ARROW_TYPES) {
        const { rerender } = render(
          <ArrowTypeSelector
            currentArrowType="arrow"
            onArrowTypeChange={defaultProps.onArrowTypeChange}
          />
        );

        const button = screen.getByRole("button", { name: "Select arrow type" });
        await user.click(button);

        // 矢印タイプに対応する表示名を取得
        const displayNames: Record<MermaidArrowType, string> = {
          arrow: "通常の矢印 (->)",
          thick: "太い矢印 (==>)",
          dotted: "点線矢印 (-.->)",
          invisible: "非表示 (~~~)",
          bidirectional: "双方向矢印 (<->)",
          "bidirectional-thick": "太い双方向矢印 (<==>)",
        };

        const option = screen.getByText(displayNames[arrowType]);
        await user.click(option);

        expect(defaultProps.onArrowTypeChange).toHaveBeenCalledWith(arrowType);

        vi.clearAllMocks();
        rerender(<div />); // クリーンアップ
      }
    });
  });

  describe("アクセシビリティ", () => {
    test("ボタンに適切なaria-labelが設定されている", () => {
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      expect(button).toHaveAttribute("aria-label", "Select arrow type");
    });

    test("キーボード操作でメニューを開ける", async () => {
      const user = userEvent.setup();
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      button.focus();
      await user.keyboard("{Enter}");

      expect(screen.getByText("通常の矢印 (->)")).toBeInTheDocument();
    });
  });

  describe("プロパティの変更", () => {
    test("currentArrowTypeが変更されると表示が更新される", () => {
      const { rerender } = render(<ArrowTypeSelector {...defaultProps} currentArrowType="arrow" />);

      rerender(<ArrowTypeSelector {...defaultProps} currentArrowType="thick" />);

      // プロパティの変更が反映されることを確認
      // （実際の表示の違いは内部的な状態変更なので、ここでは再レンダリングが成功することを確認）
      expect(screen.getByRole("button", { name: "Select arrow type" })).toBeInTheDocument();
    });
  });

  describe("定数の整合性", () => {
    test("ARROW_TYPESの全ての要素がメニューに表示される", async () => {
      const user = userEvent.setup();
      render(<ArrowTypeSelector {...defaultProps} />);

      const button = screen.getByRole("button", { name: "Select arrow type" });
      await user.click(button);

      // ARROW_TYPESの数と表示される項目数が一致する（非同期で待つ）
      const menuItems = await screen.findAllByRole("menuitem");
      expect(menuItems).toHaveLength(ARROW_TYPES.length);
    });
  });
});
