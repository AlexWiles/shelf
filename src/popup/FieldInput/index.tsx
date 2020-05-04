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

  const data = useSelector<DataState, Data | undefined>(
    (state) => state.dataById[id]
  );

  const field = useSelector<DataState, Field | undefined>((state) =>
    state.fieldsById[fieldId]
  );

  if (!field || !data) {
    return <></>;
  }

  switch (field.type) {
    case "text":
      return <TextInput url={id} field={field} urlData={data} />;
    case "tags":
      return <TagsInputs url={id} field={field} urlData={data} />;
    case "select":
      return <SelectInput url={id} field={field} urlData={data} />;
    case "rate":
      return <RateInput url={id} field={field} urlData={data} />;
    default:
      return <div></div>;
  }
};

export default FieldInput;