import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { setPageFieldValue } from "../../store";

export const TextInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  return (
    <Input
      size="small"
      value={page.values[field.id] ? String(page.values[field.id]) : ""}
      onChange={(e) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, e.target.value));
      }}
    />
  );
};
