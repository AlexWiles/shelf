import React from "react";
import { Field, getTagById, Book, View, RowType } from "../../types";
import { Tag as AntdTag, Rate } from "antd";

export const columnData = (book: Book, fields: Field[], view: View) =>
  fields
    .filter((field) => field.type !== "code")
    .map((field) => {
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
