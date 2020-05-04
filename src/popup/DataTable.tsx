import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { DataState, Field, DataById } from "../types";
import { List } from "immutable";
import { notUndefined } from "../lib";
import { Table, Tag as AntdTag, Rate } from "antd";
import { setCurrentDataId } from "./store";

export const DataTable: React.FC = () => {
  const fields = useSelector<DataState, List<Field>>((state) => {
    return state
      .get("allFields")
      .map((id) => state.get("fieldsById").get(id))
      .filter((f) => notUndefined(f)) as List<Field>;
  });

  const data = useSelector<DataState, DataById>((state) => state.get("dataById"));

  const dispatch = useDispatch();

  const dataSource = data.entrySeq()
    .map(([id, data]) => {
      return {
        ...{ key: id, id: data.get("id") },
        ...data.get("values").toJS(),
      };
    })
    .toArray();

  const columns = [
    {
      title: "URL",
      key: "key",
      dataIndex: "key",
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
              <AntdTag key={tagId}>{field.getTagById(tagId)?.label}</AntdTag>
            ));
          },
        };
      } else if (field.get("type") === "rate") {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (value: number) => <Rate value={value} disabled={true} />,
        };
      } else {
        return {
          title: field.label,
          key: field.id,
          dataIndex: field.id,
          render: (value: string) => (
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 100
              }}
            >
              {value}
            </div>
          ),
        };
      }
    }),
  ];

  return (
    <div style={{ marginTop: 20 }}>
      <Table
        onRow={(row) => {
          return {
            onClick: () => dispatch(setCurrentDataId(row.key)),
          };
        }}
        size="small"
        columns={columns}
        dataSource={dataSource}
      />
    </div>
  );
};
