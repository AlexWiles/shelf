import React from "react";
import { Page, Field, Tag, getTagById, getTagByLabel, Book } from "../../types";
import { useDispatch } from "react-redux";
import { LabeledValue } from "antd/lib/select";
import { Select } from "antd";
import { uuid } from "../../lib";
import { updatePageValueTags } from "../../store";
import { InputLabel } from "./InputLabel";

export const TagsInputs: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {

  const dispatch = useDispatch();

  const pageTagIds = (page.values[field.id] as string[]) || [];

  const options: LabeledValue[] = field.tags.map(
    (tag): LabeledValue => ({
      key: tag.id,
      value: tag.label,
      label: tag.label,
    })
  );

  const values = options.filter((opt) =>
    pageTagIds.find((tagId) => opt.key === tagId)
  );

  const onChange = (tags: LabeledValue[]): void => {
    const nextTags = tags.map((tag) => {
      const byId = getTagById(field, tag.key || "");
      const byLabel = getTagByLabel(field, String(tag.value) || "");
      const newTag = { id: uuid(), label: String(tag.value) };
      return byId || byLabel || newTag;
    });

    dispatch(updatePageValueTags(book.id, page.id, field.id, nextTags));
  };

  return (
    <div style={{ display: "flex" }} key={field.id}>
      <InputLabel field={field} book={book} />
      <Select
        size="small"
        mode="tags"
        labelInValue={true}
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        value={values}
        onChange={onChange}
      >
        {options.map((tag) => {
          return (
            <Select.Option key={tag.key} value={tag.value} label={tag.label}>
              {tag.label}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
