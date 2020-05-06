import { Tag, Page, Field, getTagById, getTagByLabel, Book } from "../../types";
import { useDispatch } from "react-redux";
import { LabeledValue } from "antd/lib/select";
import { Select } from "antd";
import { uuid } from "../../lib";
import { updatePageValueTags } from "../../store";
import React from "react";

export const SelectInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  const options: LabeledValue[] = field.tags.map(
    (tag): LabeledValue => ({
      key: tag.id,
      value: tag.label,
      label: tag.label,
    })
  );

  const pageTagIds = (page.values[field.id] as string[]) || [];
  const values = options.filter((opt) =>
    pageTagIds.find((id) => id == opt.key)
  );

  const onChange = (tags: LabeledValue[]): void => {
    const selectedTags = tags.map(
      (tag): Tag => {
        const byId = getTagById(field, tag.key || "");
        const byLabel = getTagByLabel(field, String(tag.value) || "");
        const newTag = { id: uuid(), label: String(tag.value) };
        return byId || byLabel || newTag;
      }
    );

    // if no tag selected yet, return selected tags
    // if there is a tag, find the one not in the values
    const nextTags =
      values.length === 0
        ? selectedTags
        : selectedTags.filter((tag) => {
            return !values.find((v) => v.key === tag.id);
          });

    dispatch(updatePageValueTags(book.id, page.id, field.id, nextTags));
  };

  return (
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
  );
};
