import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Book, Field, Page, View, RowType } from "../../types";
import { Table, Input } from "antd";
import { setCurrentPageId } from "../../store";
import { columnData } from "./Columns";

const filterValues = (fields: Field[], page: Page, search: string) => {
  return fields.find((f) => {
    const val = page.values[f.id];

    switch (f.type) {
      case "pageTitle":
      case "text":
        return ((val as undefined | string) || "")
          .toLowerCase()
          .includes(search.toLowerCase());

      case "select":
      case "tags":
        return ((val as string[]) || []).find((tagId) => {
          return f.tags.find(
            (tag) =>
              tag.id === tagId &&
              tag.label.toLowerCase().includes(search.toLowerCase())
          );
        });
    }
    return;
  });
};

export const DataTable: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  const fields = book.allFields.map((fieldId) => book.fieldsById[fieldId]);
  const [view, setView] = useState<View>({ id: "asdf", search: "" });

  console.log(view);

  const dataSource: RowType[] = Object.entries(book.pagesById).reduce(
    (results: any[], [id, page]) => {
      if (view.search === "" || filterValues(fields, page, view.search)) {
        const newSource = {
          ...{ key: id, id: page.id },
          ...page.values,
        };
        results.push(newSource);
      }

      return results;
    },
    []
  );

  const columns = columnData(book, fields, view);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 12,
        }}
      >
        <Input.Search
          placeholder="Search"
          style={{ width: 200 }}
          value={view.search}
          onChange={(e) => setView({ ...view, ...{ search: e.target.value } })}
        />
      </div>
      <div style={{ padding: 12, paddingTop: 0 }}>
        <Table
          bordered
          onChange={(pagination, filters, sorter) => {
            setView({ ...view, ...{ pagination, filters, sorter } });
          }}
          scroll={{ x: true }}
          onRow={(row) => {
            return {
              onClick: () => dispatch(setCurrentPageId(book.id, row.key)),
            };
          }}
          size="small"
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </div>
  );
};