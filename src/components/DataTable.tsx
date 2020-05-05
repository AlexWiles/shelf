import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Book, getTagById } from "../types";
import { Table, Tag as AntdTag, Rate, Input } from "antd";
import { setCurrentPageId } from "../store";


export const DataTable: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();

  const fields = book.allFields.map((fieldId) => book.fieldsById[fieldId]);

  const [search, setSearch] = useState("");

  const dataSource = Object.entries(book.pagesById).reduce(
    (results: any[], [id, page]) => {
      var ok = false;
      if (search !== "") {
        fields.forEach((f) => {
          const val = page.values[f.id];
          if (f.type === "text") {
            ok = ok || (val as string).toLowerCase().includes(search.toLowerCase());
          }
        });
      }

      if (search === "" || ok) {
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
      render: (id: string) => (
        <a href={id} target="_blank">
          {id.substr(0, 30)}
        </a>
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
      <div>
        <Input
          placeholder="filter"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Table
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
  );
};
