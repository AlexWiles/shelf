import React, { Dispatch, useState } from "react";
import {
  Field,
  getTagById,
  Book,
  TableView,
  RowType,
  Page,
  fieldsForView,
  visibleFieldsForView,
} from "../../types";
import { Tag as AntdTag, Button } from "antd";
import { RateInput } from "../FieldInput/Rate";
import { CheckboxInput } from "../FieldInput/Checkbox";
import { ArrowsAltOutlined, EllipsisOutlined } from "@ant-design/icons";
import { setCurrentPageId } from "../../store";
import { TagsInputs, TagsInputDisplay } from "../FieldInput/Tags";
import { ExecuteCodeButton } from "../FieldInput/Code";
import { DatetimeInput } from "../FieldInput/Datetime";

const tagColumn = (book: Book, field: Field, view: TableView) => ({
  render: (tagIds: undefined | string[], record: RowType) => {
    return <TagsInputDisplay book={book} page={record.page} field={field} />;
  },
  filterValue: (view.filters || {})[field.id],
  filterMultiple: true,
  filters: book.fieldsById[field.id].tags.map((t) => ({
    text: t.label,
    value: t.id,
  })),
  onFilter: (value: any, record: RowType) => {
    return !!((record.page.values[field.id] || []) as string[]).find(
      (tagId) => value === tagId
    );
  },
});

const selectColumn = (book: Book, field: Field, view: TableView) => ({
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
    return !!((record.page.values[field.id] || []) as string[]).find(
      (tagId) => value === tagId
    );
  },
});

const urlColumn = (book: Book, field: Field, view: TableView) => ({
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

const rateColumn = (book: Book, field: Field, view: TableView) => ({
  sorter: (a: RowType, b: RowType) => {
    return (
      Number(a.page.values[field.id] || 0) -
      Number(b.page.values[field.id] || 0)
    );
  },
  render: (value: number, record: RowType) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <RateInput book={book} page={record.page} field={field} />
    </div>
  ),
});

const datetimeColumn = (book: Book, field: Field, view: TableView) => ({
  render: (value: number, record: RowType) => (
    <div style={{ display: "flex" }}>
      <DatetimeInput book={book} page={record.page} field={field} />
    </div>
  ),
});

const codeColumn = (book: Book, field: Field, view: TableView) => ({
  render: (value: number, record: RowType) => (
    <div style={{ display: "flex" }}>
      <ExecuteCodeButton book={book} field={field} page={record.page} />
    </div>
  ),
});

const checkboxColumn = (book: Book, field: Field, view: TableView) => ({
  render: (value: boolean, { page }: RowType) => (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <CheckboxInput {...{ book, page, field }} />
    </div>
  ),
  filterValue: (view.filters || {})[field.id],
  filterMultiple: false,
  filters: [
    { text: "Checked", value: true },
    { text: "Unchecked", value: false },
  ],
  onFilter: (value: any, record: RowType) => {
    return (record.page.values[field.id] as boolean) === value;
  },
});

const actionColumn = (book: Book, dispatch: Dispatch<any>) => ({
  title: "Actions",
  key: book.id,
  dataIndex: "page",
  ellipsis: true,
  render: (page: Page) => {
    return (
      <div style={{ display: "flex" }}>
        <Button
          size="small"
          onClick={(e) => {
            e.preventDefault();
            dispatch(setCurrentPageId(book.id, page.id));
          }}
        >
          open
          <ArrowsAltOutlined />
        </Button>
      </div>
    );
  },
});

const defaultColumn = (book: Book, field: Field, lastColumn: boolean) => ({
  title: field.label,
  key: field.id,
  dataIndex: ["page", "values", field.id],
  ellipsis: true,
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

export const columnData = (
  book: Book,
  view: TableView,
  dispatch: Dispatch<any>
) => {
  const visibleFields = visibleFieldsForView(book, view);

  const inputCols = visibleFields.map((fieldId, idx) => {
    const field = book.fieldsById[fieldId];
    const lastColumn = idx === visibleFields.length - 1;
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
      case "code":
        return { ...fieldColumn, ...codeColumn(book, field, view) };
      case "datetime":
        return { ...fieldColumn, ...datetimeColumn(book, field, view) };
      default:
        return fieldColumn;
    }
  });
  return [actionColumn(book, dispatch), ...inputCols];
};
