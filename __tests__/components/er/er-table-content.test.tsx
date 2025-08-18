import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useState, useEffect, ReactNode, MutableRefObject } from "react";
import { describe, test, expect } from "vitest";
import {
  ERTableContent,
  ERColumn,
} from "../../../features/er-diagram/components/node/er-table-content";
import { render } from "../../test-utils";

const defaultColumns: ERColumn[] = [
  { name: "id", type: "int", pk: true, nn: true, defaultValue: "auto_increment" },
  { name: "name", type: "varchar(255)", pk: false, nn: false, defaultValue: "" },
];

// テスト用ラッパー（テスト本体でstateを直接参照できる形）
function StateWrapper({
  initialName = "ユーザー",
  initialColumns = defaultColumns,
  children,
}: {
  initialName?: string;
  initialColumns?: ERColumn[];
  children: (props: {
    name: string;
    setName: (v: string) => void;
    columns: ERColumn[];
    setColumns: (v: ERColumn[]) => void;
  }) => ReactNode;
}) {
  const [name, setName] = useState(initialName);
  const [columns, setColumns] = useState(initialColumns);
  return <>{children({ name, setName, columns, setColumns })}</>;
}

describe("ERTableContent", () => {
  test("名前書き換えができる", () => {
    render(
      <StateWrapper>
        {({ name, setName, columns }) => (
          <ERTableContent
            name={name}
            columns={columns}
            onNameChange={setName}
            onColumnsChange={() => {}}
          />
        )}
      </StateWrapper>
    );
    const input = screen.getByDisplayValue("ユーザー");
    fireEvent.change(input, { target: { value: "テーブルA" } });
    expect(input).toHaveValue("テーブルA");
  });

  test("行追加ができる", async () => {
    let latestColumns: ERColumn[] = [];
    render(
      <StateWrapper>
        {({ name, columns, setColumns }) => {
          latestColumns = columns;
          return (
            <ERTableContent
              name={name}
              columns={columns}
              onNameChange={() => {}}
              onColumnsChange={setColumns}
            />
          );
        }}
      </StateWrapper>
    );
    const addBtn = screen.getByRole("button", { name: "カラム追加" });
    fireEvent.click(addBtn);
    await waitFor(() => {
      expect(latestColumns.length).toBe(3);
    });
  });

  test("行削除ができる", () => {
    render(
      <StateWrapper>
        {({ name, columns, setColumns }) => (
          <ERTableContent
            name={name}
            columns={columns}
            onNameChange={() => {}}
            onColumnsChange={setColumns}
          />
        )}
      </StateWrapper>
    );
    const delBtns = screen.getAllByRole("button", { name: "削除" });
    fireEvent.click(delBtns[0]);
    // 削除後のカラム数を確認
    expect(screen.getAllByRole("row").length).toBe(2); // ヘッダー+1行
  });

  test("セル編集（テキスト・チェックボックス）ができる", async () => {
    function TestComponent({ columnsRef }: { columnsRef: MutableRefObject<ERColumn[]> }) {
      const [columns, setColumns] = useState(defaultColumns);
      useEffect(() => {
        columnsRef.current = columns;
      }, [columns]);
      return (
        <ERTableContent
          name="テーブル"
          columns={columns}
          onNameChange={() => {}}
          onColumnsChange={setColumns}
        />
      );
    }
    const columnsRef = { current: defaultColumns } as MutableRefObject<ERColumn[]>;
    render(<TestComponent columnsRef={columnsRef} />);
    // nameカラム編集
    const nameInputs = screen.getAllByRole("textbox", { name: "カラム名" });
    fireEvent.change(nameInputs[1], { target: { value: "名前" } });
    fireEvent.blur(nameInputs[1]);
    expect(nameInputs[1]).toHaveValue("名前");
    // typeカラム編集
    const typeInputs = screen.getAllByRole("textbox", { name: "型" });
    fireEvent.change(typeInputs[1], { target: { value: "text" } });
    fireEvent.blur(typeInputs[1]);
    expect(typeInputs[1]).toHaveValue("text");
    // pkチェック
    const pkChecks = screen.getAllByRole("checkbox", { name: "PK" });
    fireEvent.click(pkChecks[1]);
    expect(pkChecks[1]).toBeChecked();
    const nnChecks = screen.getAllByRole("checkbox", { name: "NN" });
    fireEvent.click(nnChecks[1]);
    expect(nnChecks[1]).toBeChecked();
    // defaultValue編集
    const defaultInputs = screen.getAllByRole("textbox", { name: "Default" });
    fireEvent.change(defaultInputs[0], { target: { value: "hoge" } });
    fireEvent.blur(defaultInputs[0]);
    expect(defaultInputs[0]).toHaveValue("hoge");
  });
});
