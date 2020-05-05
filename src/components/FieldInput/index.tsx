import React from "react";
import { Book, Page, Field } from "../../types";
import { TextInput } from "./Text";
import { TagsInputs } from "./Tags";
import { SelectInput } from "./Select";
import { RateInput } from "./Rate";


export const FieldInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {

  switch (field.type) {
    case "text":
      return <TextInput {...{ book, page, field}} />;
    case "tags":
      return <TagsInputs {...{ book, page, field}} />;
    case "select":
      return <SelectInput {...{ book, page, field}} />;
    case "rate":
      return <RateInput {...{ book, page, field}} />;
    default:
      return <div></div>;
  }
};

export default FieldInput;