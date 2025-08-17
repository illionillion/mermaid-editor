import type { Meta } from "@storybook/react-vite";
import { useState } from "react";
import { ERTableContent, ERColumn } from "../../../features/er-diagram/node/er-table-content";

const meta: Meta<typeof ERTableContent> = {
  title: "components/er/ERTableContent",
  component: ERTableContent,
};
export default meta;

const initialColumns: ERColumn[] = [
  { name: "id", type: "int", pk: true, nn: true, defaultValue: "auto_increment" },
  { name: "name", type: "varchar(255)", pk: false, nn: false, defaultValue: "" },
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
