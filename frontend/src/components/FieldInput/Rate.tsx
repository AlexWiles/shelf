import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Rate } from "antd";
import { setPageFieldValue } from "../../store";

export const RateInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  return (
    <Rate
      disabled={field.readOnly}
      allowHalf={true}
      value={page.values[field.id] ? (page.values[field.id] as number) : 0}
      onChange={(value) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, value));
      }}
    />
  );
};
