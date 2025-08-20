import { screen, fireEvent, waitFor } from "@testing-library/react";
import { useState, useEffect, ReactNode, MutableRefObject } from "react";
import { describe, test, expect } from "vitest";
import { render } from "../../../__tests__/test-utils";
import { ERTableContent, ERColumn } from "../components/node/er-table-content";

const defaultColumns: ERColumn[] = [
  { name: "id", type: "int", pk: true, uk: false },
  { name: "name", type: "varchar(255)", pk: false, uk: false },
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
    // ukチェック
    const ukChecks = screen.getAllByRole("checkbox", { name: "UK" });
    fireEvent.click(ukChecks[1]);
    expect(ukChecks[1]).toBeChecked();
  });

  test("PK/UKは排他でどちらかがtrueのときもう一方はdisabledになる", async () => {
    const singleColumn = [{ name: "col", type: "int", pk: false, uk: false }];
    render(
      <StateWrapper initialColumns={singleColumn}>
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
    // 初期状態: どちらも有効
    expect(screen.getByRole("checkbox", { name: "PK" })).not.toBeDisabled();
    expect(screen.getByRole("checkbox", { name: "UK" })).not.toBeDisabled();
    // PKをチェック→UKがdisabled
    fireEvent.click(screen.getByRole("checkbox", { name: "PK" }));
    expect(screen.getByRole("checkbox", { name: "PK" })).toBeChecked();
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "UK" })).toBeDisabled());
    // PKを外す→UKが有効
    fireEvent.click(screen.getByRole("checkbox", { name: "PK" }));
    expect(screen.getByRole("checkbox", { name: "PK" })).not.toBeChecked();
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "UK" })).not.toBeDisabled());
    // UKをチェック→PKがdisabled
    fireEvent.click(screen.getByRole("checkbox", { name: "UK" }));
    expect(screen.getByRole("checkbox", { name: "UK" })).toBeChecked();
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "PK" })).toBeDisabled());
    // UKを外す→PKが有効
    fireEvent.click(screen.getByRole("checkbox", { name: "UK" }));
    expect(screen.getByRole("checkbox", { name: "UK" })).not.toBeChecked();
    await waitFor(() => expect(screen.getByRole("checkbox", { name: "PK" })).not.toBeDisabled());
  });
});
