import { screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { LabelEditor } from "../../../features/flowchart/components/editor/label-editor";
import { render } from "../../test-utils";

describe("LabelEditor", () => {
  const defaultProps = {
    value: "テストラベル",
    isEditing: false,
    onDoubleClick: vi.fn(),
    onChange: vi.fn(),
    onKeyDown: vi.fn(),
    onCompositionStart: vi.fn(),
    onCompositionEnd: vi.fn(),
    onBlur: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示モード", () => {
    test("編集中でない場合、テキストとして表示される", () => {
      render(<LabelEditor {...defaultProps} />);

      expect(screen.getByText("テストラベル")).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    test("ダブルクリックでonDoubleClickが呼ばれる", () => {
      render(<LabelEditor {...defaultProps} />);

      const text = screen.getByText("テストラベル");
      fireEvent.doubleClick(text);

      expect(defaultProps.onDoubleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("編集モード", () => {
    test("編集中の場合、入力フィールドが表示される", () => {
      render(<LabelEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("テストラベル");
      expect(input).toHaveFocus();
    });

    test("入力値の変更でonChangeが呼ばれる", () => {
      render(<LabelEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "新しいラベル" } });

      expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
      // 実際のイベントオブジェクトが渡されることを確認
      const call = defaultProps.onChange.mock.calls[0];
      expect(call[0]).toHaveProperty("target");
      expect(call[0].target).toHaveProperty("value");
    });

    test("キーボードイベントでonKeyDownが呼ばれる", () => {
      render(<LabelEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(defaultProps.onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: "Enter" })
      );
    });

    test("フォーカスが外れた時にonBlurが呼ばれる", () => {
      render(<LabelEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
    });

    test("IME関連のイベントが正しく処理される", () => {
      render(<LabelEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");

      fireEvent.compositionStart(input);
      expect(defaultProps.onCompositionStart).toHaveBeenCalledTimes(1);

      fireEvent.compositionEnd(input);
      expect(defaultProps.onCompositionEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("プロパティの変更", () => {
    test("valueが変更されると表示が更新される", () => {
      const { rerender } = render(<LabelEditor {...defaultProps} />);
      expect(screen.getByText("テストラベル")).toBeInTheDocument();

      rerender(<LabelEditor {...defaultProps} value="更新されたラベル" />);
      expect(screen.getByText("更新されたラベル")).toBeInTheDocument();
    });

    test("isEditingが変更されるとモードが切り替わる", () => {
      const { rerender } = render(<LabelEditor {...defaultProps} />);
      expect(screen.getByText("テストラベル")).toBeInTheDocument();

      rerender(<LabelEditor {...defaultProps} isEditing={true} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
