import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { XIcon } from "@yamada-ui/lucide";
import {
  ui,
  Input,
  IconButton,
  HStack,
  Button,
  VStack,
  TableContainer,
  NativeTable,
  TableCaption,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FC,
  Center,
  Label,
  Text,
  Card,
  CardBody,
} from "@yamada-ui/react";
import { useState, useEffect } from "react";

export type ERColumn = {
  name: string;
  type: string;
  pk: boolean;
  nn: boolean;
  defaultValue: string;
};

export type ERTableContentProps = {
  name: string;
  columns: ERColumn[];
  onNameChange: (name: string) => void;
  onColumnsChange: (columns: ERColumn[]) => void;
};

export const ERTableContent: FC<ERTableContentProps> = ({
  name,
  columns,
  onNameChange,
  onColumnsChange,
}) => {
  const handleChange = (rowIdx: number, key: keyof ERColumn, value: string | boolean) => {
    onColumnsChange(columns.map((col, i) => (i === rowIdx ? { ...col, [key]: value } : col)));
  };
  const handleDelete = (rowIdx: number) => {
    onColumnsChange(columns.filter((_, i) => i !== rowIdx));
  };
  const handleAdd = () => {
    onColumnsChange([...columns, { name: "", type: "", pk: false, nn: false, defaultValue: "" }]);
  };

  const columnDefs: ColumnDef<ERColumn>[] = [
    {
      header: () => "カラム名",
      cell: ({ row, getValue }) => (
        <CellEditor
          value={getValue() as string}
          label="カラム名"
          onCommit={(v) => handleChange(row.index, "name", v)}
        />
      ),
      accessorKey: "name",
    },
    {
      header: () => "型",
      cell: ({ row, getValue }) => (
        <CellEditor
          value={getValue() as string}
          label="型"
          onCommit={(v) => handleChange(row.index, "type", v)}
        />
      ),
      accessorKey: "type",
    },
    {
      header: () => "PK",
      cell: ({ row, getValue }) => (
        <ui.input
          type="checkbox"
          checked={getValue() as boolean}
          aria-label="PK"
          onChange={(e) => handleChange(row.index, "pk", e.target.checked)}
        />
      ),
      accessorKey: "pk",
    },
    {
      header: () => "NN",
      cell: ({ row, getValue }) => (
        <ui.input
          type="checkbox"
          checked={getValue() as boolean}
          aria-label="NN"
          onChange={(e) => handleChange(row.index, "nn", e.target.checked)}
        />
      ),
      accessorKey: "nn",
    },
    {
      header: "Default",
      cell: ({ row, getValue }) => (
        <CellEditor
          value={getValue() as string}
          label="Default"
          onCommit={(v) => handleChange(row.index, "defaultValue", v)}
        />
      ),
      accessorKey: "defaultValue",
    },
    {
      header: "",
      id: "actions",
      cell: ({ row }) => (
        <IconButton
          aria-label="削除"
          icon={<XIcon />}
          size="xs"
          colorScheme="danger"
          onClick={() => handleDelete(row.index)}
          variant="outline"
        />
      ),
    },
  ];

  const table = useReactTable({
    data: columns,
    columns: columnDefs,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <VStack as={Card} maxW="5xl">
      <CardBody>
        <TableContainer w="full">
          <NativeTable variant="simple" size="sm">
            <TableCaption placement="top">
              <HStack justifyContent="space-between" w="full">
                <HStack as={Label}>
                  <Text fontWeight="bold" fontSize="md">
                    テーブル名
                  </Text>
                  <Input
                    aria-label="テーブル名"
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    fontWeight="bold"
                    fontSize="md"
                  />
                </HStack>
                <Button size="md" colorScheme="blue" onClick={handleAdd}>
                  カラム追加
                </Button>
              </HStack>
            </TableCaption>
            <Thead>
              <Tr>
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <Th key={header.id} fontWeight="bold" textAlign="left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {table.getRowModel().rows.map((row) => (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <Td key={cell.id}>
                      <Center w="full" h="full">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Center>
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </NativeTable>
        </TableContainer>
      </CardBody>
    </VStack>
  );
};

// セル編集用ローカルstate付きエディタ（再利用可能）
export const CellEditor = ({
  value,
  onCommit,
  label,
}: {
  value: string;
  onCommit: (v: string) => void;
  label: string;
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isComposing, setIsComposing] = useState(false);
  useEffect(() => {
    setInputValue(value);
  }, [value]);
  return (
    <Input
      aria-label={label}
      size="sm"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={(e) => {
        setIsComposing(false);
        setInputValue(e.currentTarget.value);
      }}
      onBlur={() => onCommit(inputValue)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !isComposing) {
          onCommit(inputValue);
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    />
  );
};
