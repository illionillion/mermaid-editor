import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Node, Edge } from "@xyflow/react";
import { describe, it, expect, vi } from "vitest";
import type { ERTableNodeProps } from "../components/node/er-table-node";
import { ERDiagramPanel } from "../components/panel/er-diagram-panel";

vi.mock("next/navigation", () => ({
  usePathname: () => "/er-diagram",
}));

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
        onImportMermaid={() => {}}
      />
    );
    expect(screen.getByText("Mermaid ER図エディター")).toBeInTheDocument();
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
        onImportMermaid={() => {}}
      />
    );
    await userEvent.click(screen.getByRole("button", { name: /テーブル追加/ }));
    expect(onAddTable).toHaveBeenCalled();
  });
});
