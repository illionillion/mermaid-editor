import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Node, Edge } from "@xyflow/react";
import { describe, it, expect, vi } from "vitest";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ERDiagramPanel } from "../components/panel/er-diagram-panel";

const dummyNodes: Node<ERTableNodeProps>[] = [];
const dummyEdges: Edge[] = [];
const dummyGenerateCode = () => "erDiagram";
describe("ERDiagramPanel", () => {
  it("renders title and add button", () => {
    render(
      <ERDiagramPanel
        onAddTable={() => {}}
        nodes={dummyNodes}
        edges={dummyEdges}
        generateCode={dummyGenerateCode}
      />
    );
    expect(screen.getByText("ER図エディタ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /テーブル追加/ })).toBeInTheDocument();
  });

  it("calls onAddTable when button clicked", async () => {
    const onAddTable = vi.fn();
    render(
      <ERDiagramPanel
        onAddTable={onAddTable}
        nodes={dummyNodes}
        edges={dummyEdges}
        generateCode={dummyGenerateCode}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /テーブル追加/ }));
    expect(onAddTable).toHaveBeenCalled();
  });
});
