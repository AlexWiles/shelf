import React from "react";
import { useSelector } from "react-redux";
import { DataState, Data, Field } from "../../types";
import { TextInput } from "./Text";
import { TagsInputs } from "./Tags";
import { SelectInput } from "./Select";
import { RateInput } from "./Rate";


export const FieldInput: React.FC<{
  id: string;
  fieldId: string;
}> = ({ id, fieldId }) => {
  const urlData = useSelector<DataState, Data>(
    (state) => state.get("dataById").get(id) || new Data()
  );

  const field = useSelector<DataState, Field | undefined>((state) =>
    state.get("fieldsById").get(fieldId)
  );

  if (!field) {
    return <></>;
  }

  switch (field.get("type")) {
    case "text":
      return <TextInput url={id} field={field} urlData={urlData} />;
    case "tags":
      return <TagsInputs url={id} field={field} urlData={urlData} />;
    case "select":
      return <SelectInput url={id} field={field} urlData={urlData} />;
    case "rate":
      return <RateInput url={id} field={field} urlData={urlData} />;
    default:
      return <div></div>;
  }
};

export default FieldInput;