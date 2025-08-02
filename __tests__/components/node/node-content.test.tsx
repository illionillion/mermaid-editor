import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { NodeContent } from "../../../components/node/editable-node";

describe("NodeContent", () => {
  const defaultProps = {
    data: {
      label: "テストノード",
      variableName: "testNode",
      shapeType: "rectangle",
      onLabelChange: vi.fn(),
      onVariableNameChange: vi.fn(),
      onShapeTypeChange: vi.fn(),
      onDelete: vi.fn(),
    },
    id: "1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示", () => {
    test("ノードが正しく表示される", () => {
      render(<NodeContent {...defaultProps} />);

      expect(screen.getByText("テストノード")).toBeInTheDocument();
      expect(screen.getByText("[testNode]")).toBeInTheDocument();
    });

    test("変数名エディターが表示される", () => {
      render(<NodeContent {...defaultProps} />);

      const variableNameElement = screen.getByText("[testNode]");
      expect(variableNameElement).toBeInTheDocument();
    });

    test("ノードメニューが表示される", () => {
      render(<NodeContent {...defaultProps} />);

      // メニューボタンが存在することを確認
      const menuButton = screen.getByRole("button");
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe("ラベル編集", () => {
    test("ダブルクリックでラベル編集モードになる", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const labelText = screen.getByText("テストノード");
      await user.dblClick(labelText);

      // 編集モードになると入力フィールドが表示される
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("ラベル変更時にonLabelChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      // ダブルクリックで編集モードに
      const labelText = screen.getByText("テストノード");
      await user.dblClick(labelText);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "新しいラベル");
      await user.click(document.body); // フォーカスを外す

      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("1", "新しいラベル");
    });

    test("Enterキーでラベル編集が確定される", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const labelText = screen.getByText("テストノード");
      await user.dblClick(labelText);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "Enterで確定{Enter}");

      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("1", "Enterで確定");
    });

    test("Escapeキーでラベル編集がキャンセルされる", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const labelText = screen.getByText("テストノード");
      await user.dblClick(labelText);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "キャンセルされる{Escape}");

      // onLabelChangeは呼ばれない
      expect(defaultProps.data.onLabelChange).not.toHaveBeenCalled();
      // 元のテキストが表示される
      expect(screen.getByText("テストノード")).toBeInTheDocument();
    });
  });

  describe("変数名編集", () => {
    test("変数名クリックで変数名編集モードになる", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const variableNameElement = screen.getByText("[testNode]");
      await user.click(variableNameElement);

      // 編集モードになると入力フィールドが表示される
      const inputs = screen.getAllByRole("textbox");
      expect(inputs.length).toBeGreaterThan(0);
    });

    test("変数名変更時にonVariableNameChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const variableNameElement = screen.getByText("[testNode]");
      await user.click(variableNameElement);

      // 複数の入力フィールドがある場合、変数名用のものを特定
      const inputs = screen.getAllByRole("textbox");
      const variableInput = inputs.find(
        (input) => (input as HTMLInputElement).value === "testNode"
      );

      if (variableInput) {
        await user.clear(variableInput);
        await user.type(variableInput, "newNode");
        await user.click(document.body); // フォーカスを外す

        expect(defaultProps.data.onVariableNameChange).toHaveBeenCalledWith("1", "newNode");
      } else {
        // フォールバック: 最初の入力フィールドを使用
        const firstInput = inputs[0];
        await user.clear(firstInput);
        await user.type(firstInput, "newNode");
        await user.click(document.body);

        expect(defaultProps.data.onVariableNameChange).toHaveBeenCalledWith("1", "newNode");
      }
    });
  });

  describe("プロップスがない場合の処理", () => {
    test("データプロパティがundefinedでも正常に動作する", () => {
      const propsWithoutHandlers = {
        data: {
          label: "テストノード",
          variableName: "testNode",
          shapeType: "rectangle",
        },
        id: "1",
      };

      expect(() => {
        render(<NodeContent {...propsWithoutHandlers} />);
      }).not.toThrow();
    });

    test("変数名がない場合はデフォルト値が使われる", () => {
      const propsWithoutVariableName = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          variableName: undefined,
        },
      };

      render(<NodeContent {...propsWithoutVariableName} />);

      // デフォルトの変数名 node1 が表示される
      expect(screen.getByText("[node1]")).toBeInTheDocument();
    });
  });

  describe("IME入力処理", () => {
    test("IME入力中はEnterキーが無視される", async () => {
      const user = userEvent.setup();
      render(<NodeContent {...defaultProps} />);

      const labelText = screen.getByText("テストノード");
      await user.dblClick(labelText);

      const input = screen.getByRole("textbox");

      // IME入力開始
      fireEvent.compositionStart(input);
      await user.clear(input);
      await user.type(input, "入力中");
      fireEvent.keyDown(input, { key: "Enter" });

      // IME入力中なので編集は確定されない
      expect(defaultProps.data.onLabelChange).not.toHaveBeenCalled();

      // IME入力終了
      fireEvent.compositionEnd(input);
      fireEvent.keyDown(input, { key: "Enter" });

      // 今度は確定される
      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("1", "入力中");
    });
  });
});
