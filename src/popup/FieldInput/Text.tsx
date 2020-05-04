import React from "react";
import { Data, Field } from "../../types";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { setDataFieldValue } from "../store";
import { InputLabel } from "./InputLabel";

export const TextInput: React.FC<{
  url: string;
  urlData: Data;
  field: Field;
}> = ({ url, field, urlData }) => {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex" }} key={field.id}>
      <InputLabel field={field} />
      <Input
        size="small"
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        value={urlData.values[field.id] ? String(urlData.values[field.id]) : ""}
        onChange={(e) => {
          dispatch(setDataFieldValue(url, field.id, e.target.value));
        }}
      />
    </div>
  );
};
