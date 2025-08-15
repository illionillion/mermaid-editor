import type { Meta } from "@storybook/react-vite";
import { ImportModal } from "../../../components/mermaid/import-modal";

const meta: Meta<typeof ImportModal> = {
  title: "components/mermaid/ImportModal",
  component: ImportModal,
};
export default meta;

export const Default = {
  render: () => (
    <ImportModal
      open={true}
      onClose={() => alert("閉じる")}
      onImport={(data) => alert("インポート: " + JSON.stringify(data))}
    />
  ),
};
