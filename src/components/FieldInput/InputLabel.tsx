import React from "react";
import { Typography } from "antd";
import { updateBookFieldLabel } from "../../store";
import { Field, Book } from "../../types";
import { useDispatch } from "react-redux";

export const InputLabel: React.FC<{book: Book; field: Field}> = ({book, field}) => {
  const dispatch = useDispatch();

  return (
    <div style={{ width: 150, marginRight: 5, marginBottom: 5 }}>
      <Typography.Text
        strong
        style={{ width: "100%" }}
        editable={{
          onChange: (v) => dispatch(updateBookFieldLabel(book.id, field.id, v)),
        }}
      >
        {field.label}
      </Typography.Text>
    </div>
  );
};
