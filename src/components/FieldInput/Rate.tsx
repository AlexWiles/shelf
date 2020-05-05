import React from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Rate } from "antd";
import { setPageFieldValue } from "../../store";
import { InputLabel } from "./InputLabel";

export const RateInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  return (
    <div style={{ display: "flex" }} key={field.id}>
      <InputLabel field={field} book={book} />
      <Rate
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        allowHalf={true}
        value={
          page.values[field.id]
            ? page.values[field.id] as number
            : 0
        }
        onChange={(value) => {
          dispatch(setPageFieldValue(book.id, book.id, field.id, value));
        }}
      />
    </div>
  );
};
