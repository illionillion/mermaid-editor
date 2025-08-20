import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { ERTableContent, ERColumn } from "../components/node/er-table-content";

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
