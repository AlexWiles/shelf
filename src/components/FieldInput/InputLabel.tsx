import React from "react";
import { Typography } from "antd";
import { Field, Book } from "../../types";

export const InputLabel: React.FC<{book: Book; field: Field}> = ({book, field}) => {
  return (
    <div style={{ width: 150, marginRight: 5 }}>
      <Typography.Text
        strong
        style={{ width: "100%" }}
      >
        {field.label}
      </Typography.Text>
    </div>
  );
};
