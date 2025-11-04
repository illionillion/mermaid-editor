import type { Meta } from "@storybook/nextjs-vite";
import { DownloadModal } from "@/features/flowchart/components/mermaid/download-modal";

const meta: Meta<typeof DownloadModal> = {
  title: "components/mermaid/DownloadModal",
  component: DownloadModal,
};
export default meta;

const dummyFlowData = {
  nodes: [
    { id: "1", type: "default", data: { label: "A" }, position: { x: 0, y: 0 } },
    { id: "2", type: "default", data: { label: "B" }, position: { x: 100, y: 0 } },
  ],
  edges: [{ id: "e1-2", source: "1", target: "2", type: "default" }],
};

export const Default = {
  tags: ["vrt"],
  render: () => (
    <DownloadModal open={true} onClose={() => alert("閉じる")} flowData={dummyFlowData} />
  ),
};
