import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { State, Field, UrlDataByUrl } from "./types";
import { List } from "immutable";
import { notUndefined } from "../lib";
import { Table, Tag as AntdTag } from "antd";
import { setUrl } from "./store";

export const DataTable: React.FC = () => {
  const fields = useSelector<State, List<Field>>((state) => {
    return state
      .get("allFields")
      .map((id) => state.get("fieldsById").get(id))
      .filter((f) => notUndefined(f)) as List<Field>;
  });

  const urls = useSelector<State, UrlDataByUrl>((state) => state.get("urls"));

  const dispatch = useDispatch();

  const dataSource = urls
    .entrySeq()
    .map(([url, data]) => {
      return {
        ...{ key: url, id: data.get("id") },
        ...data.get("values").toJS(),
      };
    })
    .toArray();

  const columns = [
    {
      title: "URL",
      key: "key",
      dataIndex: "key",
      render: (url: string) => (
        <a href={url} target="_blank">
          Link
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
              <AntdTag key={tagId}>{field.getTagById(tagId)?.label}</AntdTag>
            ));
          },
        };
      } else {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
        };
      }
    }),
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <Table
        onRow={(row) => {
          return {
            onClick: () => dispatch(setUrl(row.key)),
          };
        }}
        size="small"
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};
