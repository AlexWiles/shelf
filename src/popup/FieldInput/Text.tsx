import React from "react";
import { Data, Field } from "../../types";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { setDataFieldValue } from "../store";
import { InputLabel } from "./InputLabel";

export const TextInput: React.FC<{ url: string; urlData: Data; field: Field }> = ({
  url,
  field,
  urlData,
}) => {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex" }} key={field.get("id")}>
      <InputLabel field={field} />
      <Input.TextArea
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        autoSize={{ minRows: 1 }}
        value={
          urlData.getIn(["values", field.get("id")])
            ? String(urlData.getIn(["values", field.get("id")]))
            : ""
        }
        onChange={(e) => {
          dispatch(setDataFieldValue(url, field.get("id"), e.target.value));
        }}
      />
    </div>
  );
};
