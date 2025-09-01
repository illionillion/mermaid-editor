import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ERDiagramMermaidModal } from "../components/panel/er-diagram-mermaid-modal";

const meta: Meta<typeof ERDiagramMermaidModal> = {
  title: "components/er/ERDiagramMermaidModal",
  component: ERDiagramMermaidModal,
  args: {
    open: true,
    code: `erDiagram
  ユーザー {
    int id PK
    varchar(255) name
  }
  投稿 {
    int id PK
    varchar(255) comment
  }
  ユーザー ||--o{ 投稿 : relation
  `,
    onClose: () => alert("close"),
    onDownload: () => alert("download"),
  },
};

export default meta;
type Story = StoryObj<typeof ERDiagramMermaidModal>;

export const Default: Story = {};
