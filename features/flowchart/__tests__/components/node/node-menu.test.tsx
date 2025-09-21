import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, test, expect, vi, beforeEach } from "vitest";
import { render } from "@/__tests__/test-utils";
import { NodeMenu } from "@/features/flowchart/components/node/node-menu";

describe("NodeMenu", () => {
  const onEdit = vi.fn();
  const onEditVariableName = vi.fn();
  const onDelete = vi.fn();
  const onShapeChange = vi.fn();
  const defaultProps = {
    onEdit,
    onEditVariableName,
    onDelete,
    onShapeChange,
    currentShape: "rectangle",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("メニューボタンが表示される", () => {
    render(<NodeMenu {...defaultProps} />);
    expect(screen.getByLabelText("ノードの操作メニューを開く")).toBeInTheDocument();
  });

  test("メニューを開くと各項目が表示される", async () => {
    render(<NodeMenu {...defaultProps} />);
    const user = userEvent.setup();
    const menuButton = screen.getByLabelText("ノードの操作メニューを開く");
    await user.click(menuButton);
    expect(screen.getByText("ラベル編集")).toBeInTheDocument();
    expect(screen.getByText("変数名編集")).toBeInTheDocument();
    expect(screen.getByText("削除")).toBeInTheDocument();
  });

  test("ラベル編集クリックでonEditが呼ばれる", async () => {
    render(<NodeMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("ノードの操作メニューを開く"));
    await user.click(screen.getByText("ラベル編集"));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  test("変数名編集クリックでonEditVariableNameが呼ばれる", async () => {
    render(<NodeMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("ノードの操作メニューを開く"));
    await user.click(screen.getByText("変数名編集"));
    expect(onEditVariableName).toHaveBeenCalledTimes(1);
  });

  test("削除クリックでonDeleteが呼ばれる", async () => {
    render(<NodeMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("ノードの操作メニューを開く"));
    await user.click(screen.getByText("削除"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  test("ShapeSelector経由でonShapeChangeが呼ばれる", async () => {
    render(<NodeMenu {...defaultProps} />);
    const user = userEvent.setup();
    await user.click(screen.getByLabelText("ノードの操作メニューを開く"));
    // ShapeSelectorのサブメニューを開く
    await user.click(screen.getByText("ノード形状"));
    // ShapeSelectorのshapeボタンをクリック（例: 菱形）
    const diamondButton = screen.getByText("菱形");
    await user.click(diamondButton);
    expect(onShapeChange).toHaveBeenCalled();
  });
});
