import type { Meta } from "@storybook/nextjs-vite";
import { CopyButton } from "@/components/ui/copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "components/ui/CopyButton",
  component: CopyButton,
};
export default meta;

export const Default = {
  render: () => <CopyButton value="コピーするテキスト" />,
};
