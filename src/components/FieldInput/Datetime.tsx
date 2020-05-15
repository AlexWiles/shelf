import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Rate, DatePicker } from "antd";
import { setPageFieldValue } from "../../store";
import moment from "moment";

export const DatetimeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  return (
    <DatePicker
      disabled={field.readOnly}
      value={
        page.values[field.id]
          ? moment(page.values[field.id] as number)
          : undefined
      }
      onChange={(m) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, m?.valueOf()));
      }}
    />
  );
};
