import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Book, Field, Page, TableView, RowType } from "../../types";
import { Table, Input } from "antd";
import { updateBookFieldColumnWidth } from "../../store";
import { columnData } from "./Columns";
import { Resizable } from "react-resizable";

const Header: React.FC<{ field: Field; book: Book; lastColumn: boolean }> = (
  props
) => {
  const dispatch = useDispatch();

  const [width, setWidth] = useState<number | undefined>(
    props.field?.tableColumnWidth
  );

  if (props.lastColumn) {
    return <th {...props} ></th>;
  }

  return (
    <Resizable
      width={width || 100}
      height={0}
      handle={
        <span
          className="react-resizable-handle"
          style={{
            position: "absolute",
            width: 10,
            height: "100%",
            bottom: 0,
            right: -5,
            cursor: "col-resize",
            zIndex: 1,
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      }
      onResize={(_, { size }) => {
        setWidth(size.width);
      }}
      onResizeStop={() => {
        if (width && props?.field?.id) {
          dispatch(
            updateBookFieldColumnWidth(props.book.id, props.field.id, width)
          );
        }
      }}
      draggableOpts={{ enableUserSelectHack: true }}
    >
      <th {...{ ...props, ...{ width: width || 100 } }} />
    </Resizable>
  );
};

const filterValues = (fields: Field[], page: Page, search: string) => {
  return fields.find((f) => {
    const val = page.values[f.id];

    switch (f.type) {
      case "textarea":
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
  });
};

export const DataTable: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  const fields = book.allFields.map((fieldId) => book.fieldsById[fieldId]);
  const [view, setView] = useState<TableView>({ id: "asdf", search: "" });

  const dataSource: RowType[] = Object.entries(book.pagesById).reduce(
    (results: any[], [id, page]) => {
      if (view.search === "" || filterValues(fields, page, view.search)) {
        const newSource = {
          ...{ key: id, id: page.id, page }
        };
        results.push(newSource);
      }

      return results;
    },
    []
  );

  const columns = columnData(book, fields, view, dispatch);

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
          components={{ header: { cell: Header } }}
          onChange={(pagination, filters, sorter) => {
            setView({ ...view, ...{ pagination, filters, sorter } });
          }}
          size="small"
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    </div>
  );
};
