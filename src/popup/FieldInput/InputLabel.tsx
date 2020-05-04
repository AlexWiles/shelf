import React from "react";
import { Typography } from "antd";
import { updateFieldLabel } from "../store";
import { Field } from "../../types";
import { useDispatch } from "react-redux";

export const InputLabel: React.FC<{field: Field}> = ({field}) => {
  const dispatch = useDispatch();

  return (
    <div style={{ width: 150, marginRight: 5, marginBottom: 5 }}>
      <Typography.Text
        strong
        style={{ width: "100%" }}
        editable={{
          onChange: (v) => dispatch(updateFieldLabel(field.id, v)),
        }}
      >
        {field.label}
      </Typography.Text>
    </div>
  );
};
