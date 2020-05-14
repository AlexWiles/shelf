import React from "react";
import { Page, Field, getTagById, getTagByLabel, Book } from "../../types";
import { useDispatch } from "react-redux";
import { LabeledValue } from "antd/lib/select";
import { Select, Tag as AntdTag } from "antd";
import { updatePageValueTags } from "../../store";
import { v4 as uuidv4 } from "uuid";

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
      value: tag.label.toLowerCase(),
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
      const newTag = { id: uuidv4(), label: String(tag.value) };
      return byId || byLabel || newTag;
    });

    dispatch(updatePageValueTags(book.id, page.id, field.id, nextTags));
  };

  if (field.readOnly) {
    return (
      <>
        {values.map((tag) => {
          return <AntdTag key={tag.value}>{tag.label}</AntdTag>;
        })}
      </>
    );
  }

  return (
    <Select
      disabled={field.readOnly}
      size="small"
      mode="tags"
      style={{ width: "100%" }}
      labelInValue={true}
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
