import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Book, getTagById, Field, Page, ValueData } from "../types";
import { Table, Tag as AntdTag, Rate, Input, Button } from "antd";
import { setCurrentPageId, setBookPage, setCurrentBookId } from "../store";

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

type RowType = {
  key: string;
  id: string;
  [fieldId: string]: ValueData;
};

type ViewConfig = {
  search: string;
}

export const DataTable: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();

  const fields = book.allFields.map((fieldId) => book.fieldsById[fieldId]);

  const [search, setSearch] = useState("");


  const dataSource: RowType[] = Object.entries(book.pagesById).reduce(
    (results: any[], [id, page]) => {
      if (search === "" || filterValues(fields, page, search)) {
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

  const columns = fields.map((field) => {
    switch (field.type) {
      case "tags":
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (tagIds: undefined | string[]) => {
            return (tagIds || []).map((tagId) => (
              <AntdTag key={tagId}>{getTagById(field, tagId)?.label}</AntdTag>
            ));
          },
          filterMultiple: true,
          filters: book.fieldsById[field.id].tags.map((t) => ({
            text: t.label,
            value: t.id,
          })),

          onFilter: (value: any, record: RowType) => {
            return !!((record[field.id] || [])  as string[]).find(
              (tagId) => value === tagId
            );
          },
        };
      case "select":
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (tagIds: undefined | string[]) => {
            return (tagIds || []).map((tagId) => (
              <AntdTag key={tagId}>{getTagById(field, tagId)?.label}</AntdTag>
            ));
          },
          filterMultiple: false,
          filters: book.fieldsById[field.id].tags.map((t) => ({
            text: t.label,
            value: t.id,
          })),

          onFilter: (value: any, record: RowType) => {
            return !!((record[field.id] || [])  as string[]).find(
              (tagId) => value === tagId
            );
          },
        };

      case "url":
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          ellipsis: true,
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
                <a href={url} target="_blank">
                  {url.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            ) : undefined,
        };

      case "rate":
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          width: 160,
          sorter: (a: RowType, b: RowType) => {
            return Number(a[field.id] || 0) - Number(b[field.id] || 0);
          },
          render: (value: number) => (
            <div>
              <Rate allowHalf={true} value={value} disabled={true} />
            </div>
          ),
        };

      default:
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          ellipsis: true,
        };
    }
  });

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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div style={{ padding: 12, paddingTop: 0 }}>
        <Table
          bordered
          onChange={(pagination, filters,  sorter) => {}}
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
