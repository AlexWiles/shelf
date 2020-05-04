import React from "react";
import { Data, Field } from "../../types";
import { useDispatch } from "react-redux";
import { Rate } from "antd";
import { setDataFieldValue } from "../store";
import { InputLabel } from "./InputLabel";

export const RateInput: React.FC<{ url: string; urlData: Data; field: Field }> = ({
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
          dispatch(setDataFieldValue(url, field.get("id"), value));
        }}
      />
    </div>
  );
};
