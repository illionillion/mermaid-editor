import type { Meta } from "@storybook/nextjs-vite";
import { useState } from "react";
import type { ERColumn } from "../components/node/er-table-content";
import { ERTableContent } from "../components/node/er-table-content";

const meta: Meta<typeof ERTableContent> = {
  title: "components/er/ERTableContent",
  component: ERTableContent,
};
export default meta;

const initialColumns: ERColumn[] = [
  { name: "id", type: "int", pk: true, uk: false },
  { name: "name", type: "varchar(255)", pk: false, uk: false },
];

export const Default = {
  tags: ["vrt"],
  render: () => {
    const [name, setName] = useState("ユーザー");
    const [columns, setColumns] = useState(initialColumns);
    return (
      <ERTableContent
        name={name}
        columns={columns}
        onNameChange={setName}
        onColumnsChange={setColumns}
      />
    );
  },
};
