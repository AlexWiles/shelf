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
    <div style={{ display: "flex" }} key={field.id}>
      <InputLabel field={field} />
      <Rate
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        allowHalf={true}
        value={
          urlData.values[field.id]
            ? urlData.values[field.id] as number
            : 0
        }
        onChange={(value) => {
          dispatch(setDataFieldValue(url, field.id, value));
        }}
      />
    </div>
  );
};
