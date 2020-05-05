import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Book, getTagById, Field, Page } from "../types";
import { Table, Tag as AntdTag, Rate, Input } from "antd";
import { setCurrentPageId } from "../store";

const filterValues = (fields: Field[], page: Page, search: string) => {
  return fields.find((f) => {
    const val = page.values[f.id];

    switch (f.type) {
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

  const [search, setSearch] = useState("");

  const dataSource = Object.entries(book.pagesById).reduce(
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

  const columns = [
    {
      title: "URL",
      key: "key",
      dataIndex: "key",
      ellipsis: true,
      render: (url: string) => (
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
      ),
    },
    ...fields.map((field) => {
      if (field.type === "tags" || field.type === "select") {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (tagIds: undefined | string[]) => {
            return (tagIds || []).map((tagId) => (
              <AntdTag key={tagId}>{getTagById(field, tagId)?.label}</AntdTag>
            ));
          },
        };
      } else if (field.type === "rate") {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (value: number) => (
            <Rate allowHalf={true} value={value} disabled={true} />
          ),
        };
      } else {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          ellipsis: true,
        };
      }
    }),
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 12 }}>
        <Input.Search
          placeholder="Search"
          size="small"
          style={{ width: 200 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div style={{ padding: 12, paddingTop: 0 }}>
        <Table
          bordered
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
