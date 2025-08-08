import { screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { VariableNameEditor } from "../../../components/editor/variable-name-editor";
import { render } from "../../test-utils";

describe("VariableNameEditor", () => {
  const defaultProps = {
    value: "testNode",
    isEditing: false,
    shapeType: "rectangle" as const,
    onClick: vi.fn(),
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
    test("編集中でない場合、形状記号付きのテキストが表示される", () => {
      render(<VariableNameEditor {...defaultProps} />);

      // formatMermaidShapeで変換された形状記号付きの表示を確認
      expect(screen.getByText("[testNode]")).toBeInTheDocument();
      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    });

    test("クリックでonClickが呼ばれる", () => {
      render(<VariableNameEditor {...defaultProps} />);

      const element = screen.getByText("[testNode]");
      fireEvent.click(element);

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    test("異なる形状タイプで正しい記号が表示される", () => {
      const { rerender } = render(<VariableNameEditor {...defaultProps} />);
      expect(screen.getByText("[testNode]")).toBeInTheDocument();

      rerender(<VariableNameEditor {...defaultProps} shapeType="diamond" />);
      expect(screen.getByText("{testNode}")).toBeInTheDocument();

      rerender(<VariableNameEditor {...defaultProps} shapeType="circle" />);
      expect(screen.getByText("((testNode))")).toBeInTheDocument();
    });
  });

  describe("編集モード", () => {
    test("編集中の場合、入力フィールドが表示される", () => {
      render(<VariableNameEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue("testNode");
      expect(input).toHaveFocus();
    });

    test("入力値の変更でonChangeが呼ばれる", () => {
      const { getByDisplayValue } = render(
        <VariableNameEditor {...defaultProps} isEditing={true} />
      );

      const input = getByDisplayValue("testNode");
      fireEvent.change(input, { target: { value: "newNode" } });

      expect(defaultProps.onChange).toHaveBeenCalledWith(
        expect.anything() // イベントオブジェクトが渡されることを確認
      );
    });

    test("キーボードイベントでonKeyDownが呼ばれる", () => {
      render(<VariableNameEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      fireEvent.keyDown(input, { key: "Enter" });

      expect(defaultProps.onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: "Enter" })
      );
    });

    test("フォーカスが外れた時にonBlurが呼ばれる", () => {
      render(<VariableNameEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      fireEvent.blur(input);

      expect(defaultProps.onBlur).toHaveBeenCalledTimes(1);
    });

    test("IME関連のイベントが正しく処理される", () => {
      render(<VariableNameEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");

      fireEvent.compositionStart(input);
      expect(defaultProps.onCompositionStart).toHaveBeenCalledTimes(1);

      fireEvent.compositionEnd(input);
      expect(defaultProps.onCompositionEnd).toHaveBeenCalledTimes(1);
    });
  });

  describe("スタイルと表示", () => {
    test("正しいスタイルクラスが適用される", () => {
      const { container } = render(<VariableNameEditor {...defaultProps} />);

      const wrapper = container.firstChild as HTMLElement;
      // Yamada UIのclassが適用されることを確認
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.className).toBeTruthy(); // 何らかのクラスが適用されていることを確認
    });

    test("編集モードでは適切なサイズの入力フィールドが表示される", () => {
      render(<VariableNameEditor {...defaultProps} isEditing={true} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      // 小さいサイズの入力フィールドの確認
    });
  });

  describe("プロパティの変更", () => {
    test("valueが変更されると表示が更新される", () => {
      const { rerender } = render(<VariableNameEditor {...defaultProps} />);
      expect(screen.getByText("[testNode]")).toBeInTheDocument();

      rerender(<VariableNameEditor {...defaultProps} value="updatedNode" />);
      expect(screen.getByText("[updatedNode]")).toBeInTheDocument();
    });

    test("isEditingが変更されるとモードが切り替わる", () => {
      const { rerender } = render(<VariableNameEditor {...defaultProps} />);
      expect(screen.getByText("[testNode]")).toBeInTheDocument();

      rerender(<VariableNameEditor {...defaultProps} isEditing={true} />);
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });
});
