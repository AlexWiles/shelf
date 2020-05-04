import React from "react";
import { useSelector } from "react-redux";
import { State, UrlData, Field } from "../types";
import { TextInput } from "./Text";
import { TagsInputs } from "./Tags";
import { SelectInput } from "./Select";
import { RateInput } from "./Rate";


export const FieldInput: React.FC<{
  url: string;
  fieldId: string;
}> = ({ url, fieldId }) => {
  const urlData = useSelector<State, UrlData>(
    (state) => state.get("urls").get(url) || new UrlData()
  );

  const field = useSelector<State, Field | undefined>((state) =>
    state.get("fieldsById").get(fieldId)
  );

  if (!field) {
    return <></>;
  }

  switch (field.get("type")) {
    case "text":
      return <TextInput url={url} field={field} urlData={urlData} />;
    case "tags":
      return <TagsInputs url={url} field={field} urlData={urlData} />;
    case "select":
      return <SelectInput url={url} field={field} urlData={urlData} />;
    case "rate":
      return <RateInput url={url} field={field} urlData={urlData} />;
    default:
      return <div></div>;
  }
};

export default FieldInput;