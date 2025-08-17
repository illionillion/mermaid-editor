import type { Meta } from "@storybook/react-vite";
import { ERTableNode } from "../../../features/er-diagram/node/er-table-node";

const meta: Meta<typeof ERTableNode> = {
  title: "components/er/ERTableNode",
  component: ERTableNode,
};
export default meta;

export const Default = {
  render: () => <ERTableNode />,
};
