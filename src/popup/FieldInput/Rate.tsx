import React from "react";
import { UrlData, Field } from "../types";
import { useDispatch } from "react-redux";
import { Rate } from "antd";
import { setUrlFieldValue } from "../store";
import { InputLabel } from "./InputLabel";

export const RateInput: React.FC<{ url: string; urlData: UrlData; field: Field }> = ({
  url,
  field,
  urlData,
}) => {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex" }} key={field.get("id")}>
      <InputLabel field={field} />
      <Rate
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        value={
          urlData.getIn(["values", field.get("id")])
            ? urlData.getIn(["values", field.get("id")]) as number
            : 0
        }
        onChange={(value) => {
          dispatch(setUrlFieldValue(url, field.get("id"), value));
        }}
      />
    </div>
  );
};
