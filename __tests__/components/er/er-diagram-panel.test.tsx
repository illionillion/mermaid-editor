import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ERDiagramPanel } from "../../../features/er-diagram/er-diagram-panel";

describe("ERDiagramPanel", () => {
  it("renders title and add button", () => {
    render(<ERDiagramPanel onAddTable={() => {}} />);
    expect(screen.getByText("ER図エディタ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /テーブル追加/ })).toBeInTheDocument();
  });

  it("calls onAddTable when button clicked", async () => {
    const onAddTable = vi.fn();
    render(<ERDiagramPanel onAddTable={onAddTable} />);
    await userEvent.click(screen.getByRole("button", { name: /テーブル追加/ }));
    expect(onAddTable).toHaveBeenCalled();
  });
});
