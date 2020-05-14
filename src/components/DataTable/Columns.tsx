import React from "react";
import { Field, getTagById, Book, View, RowType } from "../../types";
import { Tag as AntdTag, Rate, Checkbox } from "antd";

const tagColumn = (book: Book, field: Field, view: View) => ({
  render: (tagIds: undefined | string[]) => {
    return (tagIds || []).map((tagId) => (
      <AntdTag key={tagId}>{getTagById(field, tagId)?.label}</AntdTag>
    ));
  },
  filterValue: (view.filters || {})[field.id],
  filterMultiple: true,
  filters: book.fieldsById[field.id].tags.map((t) => ({
    text: t.label,
    value: t.id,
  })),
  onFilter: (value: any, record: RowType) => {
    return !!((record[field.id] || []) as string[]).find(
      (tagId) => value === tagId
    );
  },
});

const selectColumn = (book: Book, field: Field, view: View) => ({
  render: (tagIds: undefined | string[]) => {
    return (tagIds || []).map((tagId) => (
      <AntdTag key={tagId}>{getTagById(field, tagId)?.label}</AntdTag>
    ));
  },
  filterValue: (view.filters || {})[field.id],
  filterMultiple: false,
  filters: book.fieldsById[field.id].tags.map((t) => ({
    text: t.label,
    value: t.id,
  })),

  onFilter: (value: any, record: RowType) => {
    return !!((record[field.id] || []) as string[]).find(
      (tagId) => value === tagId
    );
  },
});

const urlColumn = (book: Book, field: Field, view: View) => ({
  render: (url: string) =>
    url ? (
      <div
        style={{
          maxWidth: 300,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          {url.replace(/(^\w+:|^)\/\//, "")}
        </a>
      </div>
    ) : undefined,
});

const rateColumn = (book: Book, field: Field, view: View) => ({
  sorter: (a: RowType, b: RowType) => {
    return Number(a[field.id] || 0) - Number(b[field.id] || 0);
  },
  render: (value: number) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Rate allowHalf={true} value={value} disabled={true} />
    </div>
  ),
});

const checkboxColumn = (book: Book, field: Field, view: View) => ({
  render: (value: boolean) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Checkbox
        style={{ cursor: "normal" }}
        checked={value}
        onChange={() => {}}
      />
    </div>
  ),
  filterValue: (view.filters || {})[field.id],
  filterMultiple: false,
  filters: [
    { text: "Checked", value: true },
    { text: "Unchecked", value: false },
  ],
  onFilter: (value: any, record: RowType) => {
    return (record[field.id] as boolean) === value;
  },
});

const defaultColumn = (book: Book, field: Field, lastColumn: boolean) => ({
  title: field.label,
  key: field.id,
  dataIndex: field.id,
  ellipsis: true,
  lastColumn,
  onHeaderCell: (): {
    field: Field;
    book: Book;
    lastColumn: boolean;
  } & React.HTMLAttributes<HTMLElement> => ({
    lastColumn,
    field,
    book,
  }),
});

export const columnData = (book: Book, fields: Field[], view: View) => {
  const validColumns = fields.filter((field) => field.type !== "code");

  return validColumns.map((field, idx) => {
    const lastColumn = idx === validColumns.length - 1;
    const fieldColumn = defaultColumn(book, field, lastColumn);

    switch (field.type) {
      case "tags":
        return { ...fieldColumn, ...tagColumn(book, field, view) };
      case "select":
        return { ...fieldColumn, ...selectColumn(book, field, view) };
      case "url":
        return { ...fieldColumn, ...urlColumn(book, field, view) };
      case "rate":
        return { ...fieldColumn, ...rateColumn(book, field, view) };
      case "checkbox":
        return { ...fieldColumn, ...checkboxColumn(book, field, view) };
      default:
        return fieldColumn;
    }
  });
};
