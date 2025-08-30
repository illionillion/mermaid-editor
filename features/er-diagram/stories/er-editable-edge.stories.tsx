import type { Meta, StoryObj } from "@storybook/react";
import { ErEditableEdge } from "../components/edge/er-editable-edge";
import { ErCardinality } from "../types";

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
  args: {
    label: "relation",
    cardinality: "1:N",
  },
};

export const Editing: Story = {
  render: (args: typeof meta.args) => <ErEditableEdge {...args} />,
  args: {
    label: "editing label",
    cardinality: "0..1",
  },
};
