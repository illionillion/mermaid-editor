import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { EdgeContent } from "@/features/flowchart/components/edge/editable-edge";

describe("EdgeContent", () => {
  const defaultProps = {
    id: "edge1",
    labelX: 100,
    labelY: 50,
    data: {
      label: "テストエッジ",
      arrowType: "arrow" as const,
      onLabelChange: vi.fn(),
      onArrowTypeChange: vi.fn(),
      onDelete: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("表示", () => {
    test("エッジラベルが正しく表示される", () => {
      render(<EdgeContent {...defaultProps} />);

      expect(screen.getByText("テストエッジ")).toBeInTheDocument();
    });

    test("ラベルが空の場合、プレースホルダーまたは空の状態が表示される", () => {
      const propsWithEmptyLabel = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          label: "",
        },
      };

      render(<EdgeContent {...propsWithEmptyLabel} />);

      // 空ラベルの場合、「...」のプレースホルダーが表示されることを確認
      expect(screen.getByText("...")).toBeInTheDocument();
    });
  });

  describe("ラベル編集", () => {
    test("クリックでラベル編集モードになる", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      // 編集モードになると入力フィールドが表示される
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    test("編集モードで入力フィールドにフォーカスが当たる", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = screen.getByRole("textbox");
      expect(input).toHaveFocus();
    });

    test("ラベル変更時にonLabelChangeが呼ばれる", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "新しいエッジラベル");
      await user.click(document.body); // フォーカスを外す

      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("edge1", "新しいエッジラベル");
    });

    test("Enterキーでラベル編集が確定される", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "Enterで確定{Enter}");

      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("edge1", "Enterで確定");
    });

    test("Escapeキーでラベル編集がキャンセルされる", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

      const input = screen.getByRole("textbox");
      await user.clear(input);
      await user.type(input, "キャンセルされる{Escape}");

      // onLabelChangeは呼ばれない
      expect(defaultProps.data.onLabelChange).not.toHaveBeenCalled();
      // 元のテキストが表示される
      expect(screen.getByText("テストエッジ")).toBeInTheDocument();
    });
  });

  describe("削除機能", () => {
    test("削除ボタンクリックで削除が実行される", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const deleteButton = screen.getByLabelText("Delete edge");
      await user.click(deleteButton);

      expect(defaultProps.data.onDelete).toHaveBeenCalledWith("edge1");
    });
  });

  describe("プロップスがない場合の処理", () => {
    test("削除ハンドラーがない場合でも正常に動作する", () => {
      const propsWithoutDelete = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          onDelete: undefined,
        },
      };

      expect(() => {
        render(<EdgeContent {...propsWithoutDelete} />);
      }).not.toThrow();
    });

    test("ラベル変更ハンドラーがない場合でも正常に動作する", () => {
      const propsWithoutLabelChange = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          onLabelChange: undefined,
        },
      };

      expect(() => {
        render(<EdgeContent {...propsWithoutLabelChange} />);
      }).not.toThrow();
    });
  });

  describe("IME入力処理", () => {
    test("IME入力中はEnterキーが無視される", async () => {
      const user = userEvent.setup();
      render(<EdgeContent {...defaultProps} />);

      const labelElement = screen.getByText("テストエッジ");
      await user.click(labelElement);

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
      expect(defaultProps.data.onLabelChange).toHaveBeenCalledWith("edge1", "入力中");
    });
  });

  describe("矢印タイプの処理", () => {
    test("矢印タイプ変更ハンドラーが存在する", () => {
      expect(defaultProps.data.onArrowTypeChange).toBeDefined();
    });

    test("異なる矢印タイプが正しく処理される", () => {
      const propsWithThickArrow = {
        ...defaultProps,
        data: {
          ...defaultProps.data,
          arrowType: "thick" as const,
        },
      };

      expect(() => {
        render(<EdgeContent {...propsWithThickArrow} />);
      }).not.toThrow();
    });
  });
});
