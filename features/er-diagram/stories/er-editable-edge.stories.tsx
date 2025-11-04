import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ErEditableEdge } from "../components/edge/er-editable-edge";
import type { ErCardinality } from "../types";

const meta: Meta<typeof ErEditableEdge> = {
  title: "ER/ErEditableEdge",
  component: ErEditableEdge,
  args: {
    id: "edge-1",
    label: "relation",
    cardinality: "1:N" as ErCardinality,
    onLabelChange: (id: string, label: string) => {
      // eslint-disable-next-line no-console
      console.log("Label changed:", id, label);
    },
    onCardinalityChange: (id: string, cardinality: ErCardinality) => {
      // eslint-disable-next-line no-console
      console.log("Cardinality changed:", id, cardinality);
    },
    onDelete: (id: string) => {
      // eslint-disable-next-line no-console
      console.log("Deleted:", id);
    },
  },
};

export default meta;

type Story = StoryObj<typeof ErEditableEdge>;

export const Default: Story = {
  tags: ["vrt"],
  args: {
    label: "relation",
    cardinality: "1:N" as ErCardinality,
  },
};

export const Editing: Story = {
  tags: ["vrt"],
  render: (args) => (
    <ErEditableEdge {...args} id={args.id ?? "edge-1"} cardinality={"0..1" as ErCardinality} />
  ),
  args: {
    label: "editing label",
    id: "edge-1",
    cardinality: "0..1" as ErCardinality,
  },
};
