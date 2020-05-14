import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Input, Typography } from "antd";
import { setPageFieldValue, updateBookFieldFlag } from "../../store";
import { Collapsable } from "./Collapsable";

export const TextInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  if (field.readOnly) {
    return (
      <Typography.Text>
        {page.values[field.id] ? String(page.values[field.id]) : ""}
      </Typography.Text>
    );
  }

  return (
    <Input
      disabled={field.readOnly}
      value={page.values[field.id] ? String(page.values[field.id]) : ""}
      onChange={(e) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, e.target.value));
      }}
    />
  );
};

export const TextareaInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  if (field.readOnly) {
    return (
      <Collapsable
        collapsed={field.collapsed}
        onCollapse={(v) =>
          dispatch(updateBookFieldFlag(book.id, field.id, "collapsed", v))
        }
        style={{ border: "1px solid rgb(217,217,217)" }}
      >
        <div style={{ whiteSpace: "pre-line", padding: "4px 11px" }}>
          <Typography.Text>
            {page.values[field.id] ? String(page.values[field.id]) : ""}
          </Typography.Text>
        </div>
      </Collapsable>
    );
  }

  return (
    <Collapsable
      collapsed={field.collapsed}
      onCollapse={(v) =>
        dispatch(updateBookFieldFlag(book.id, field.id, "collapsed", v))
      }
      collapsedStyle={{ borderBottom: "1px solid rgb(217,217,217)" }}
    >
      <Input.TextArea
        disabled={field.readOnly}
        autoSize={{ minRows: 2 }}
        value={page.values[field.id] ? String(page.values[field.id]) : ""}
        onChange={(e) => {
          dispatch(
            setPageFieldValue(book.id, page.id, field.id, e.target.value)
          );
        }}
      />
    </Collapsable>
  );
};
