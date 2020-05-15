import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Checkbox } from "antd";
import { setPageFieldValue } from "../../store";

export const CheckboxInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  return (
    <Checkbox
      disabled={field.readOnly}
      checked={page.values[field.id] as boolean}
      onChange={(e) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, e.target.checked));
      }}
    />
  );
};
