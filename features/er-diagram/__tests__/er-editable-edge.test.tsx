import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErEditableEdge } from "../components/edge/er-editable-edge";
import type { ErCardinality } from "../types";

describe("ErEditableEdge", () => {
  const baseProps = {
    id: "edge-1",
    label: "relation",
    cardinality: "one-to-one" as ErCardinality,
    onLabelChange: vi.fn(),
    onCardinalityChange: vi.fn(),
    onDelete: vi.fn(),
  };

  it("ラベルが表示される", () => {
    render(<ErEditableEdge {...baseProps} />);
    expect(screen.getByText("relation")).toBeInTheDocument();
  });

  it("ラベルをクリックで編集できる", () => {
    render(<ErEditableEdge {...baseProps} />);
    fireEvent.click(screen.getByText("relation"));
    const input = screen.getByDisplayValue("relation");
    fireEvent.change(input, { target: { value: "new label" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(baseProps.onLabelChange).toHaveBeenCalledWith("edge-1", "new label");
  });

  it("カーディナリティ変更時にonCardinalityChangeが呼ばれる", () => {
    render(<ErEditableEdge {...baseProps} />);
    // カーディナリティボタンをラベルで直接取得
    const menuButton = screen.getByRole("button", { name: "1...1" });
    fireEvent.click(menuButton);
    // メニューと目的のアイテムをシンプルに取得（重複しないラベルを選択）
    const menu = screen.getByRole("menu", { hidden: true });
    const menuItem = within(menu).getByText(/1\.\.\.\+/);
    fireEvent.click(menuItem);
    expect(baseProps.onCardinalityChange).toHaveBeenCalled();
  });

  it("削除ボタンでonDeleteが呼ばれる", () => {
    render(<ErEditableEdge {...baseProps} />);
    fireEvent.click(screen.getByLabelText("Delete edge"));
    expect(baseProps.onDelete).toHaveBeenCalledWith("edge-1");
  });
});
