import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Input, Button } from "antd";
import { setPageFieldValue } from "../../store";
import { LinkOutlined } from "@ant-design/icons";
import { getCurrentUrl } from "../../lib";

const CurrUrlButton: React.FC<{ book: Book; page: Page; field: Field }> = ({
  book,
  page,
  field,
}) => {
  const dispatch = useDispatch();

  return (
    <Button
      size="small"
      onClick={(e) => {
        e.preventDefault();
        getCurrentUrl((tab) => {
          const url = tab.url || "";
          if (book) {
            dispatch(setPageFieldValue(book.id, page.id, field.id, url));
          }
        });
      }}
    >
      Current URL
    </Button>
  );
};
export const UrlInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  if (field.readOnly) {
    return (
      <a
        target="_blank"
        href={(page.values[field.id] as string | undefined) || ""}
      >
        {(page.values[field.id] as string | undefined) || ""}
      </a>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Input
        size="small"
        disabled={field.readOnly}
        value={page.values[field.id] ? String(page.values[field.id]) : ""}
        onChange={(e) => {
          dispatch(
            setPageFieldValue(book.id, page.id, field.id, e.target.value)
          );
        }}
        suffix={
          <a
            target="_blank"
            href={(page.values[field.id] as string | undefined) || ""}
          >
            <LinkOutlined style={{ marginRight: 5 }} />
          </a>
        }
      />
    </div>
  );
};
