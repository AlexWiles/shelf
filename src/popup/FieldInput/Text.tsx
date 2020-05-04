import React from "react";
import { UrlData, Field } from "../types";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { setUrlFieldValue } from "../store";
import { InputLabel } from "./InputLabel";

export const TextInput: React.FC<{ url: string; urlData: UrlData; field: Field }> = ({
  url,
  field,
  urlData,
}) => {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex" }} key={field.get("id")}>
      <InputLabel field={field} />
      <Input
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        size="small"
        value={
          urlData.getIn(["values", field.get("id")])
            ? String(urlData.getIn(["values", field.get("id")]))
            : ""
        }
        onChange={(e) => {
          dispatch(setUrlFieldValue(url, field.get("id"), e.target.value));
        }}
      />
    </div>
  );
};
