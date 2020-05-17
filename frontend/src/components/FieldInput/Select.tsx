import React from "react";
import {
  Tag,
  Page,
  Field,
  getTagById,
  getTagByLabel,
  Book,
  newTag,
} from "../../types";
import { useDispatch } from "react-redux";
import { LabeledValue } from "antd/lib/select";
import { Select, Tag as AntdTag } from "antd";
import { updatePageValueTags } from "../../store";
import { v4 as uuidv4 } from "uuid";
import { getRandomColor } from "../../lib";

type SelectInputProps = {
  book: Book;
  page: Page;
  field: Field;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  book,
  field,
  page,
}) => {
  const dispatch = useDispatch();

  const pageTagIds = (page.values[field.id] as string[]) || [];
  const values = field.tags.filter((tag) =>
    pageTagIds.find((id) => id === tag.id)
  );

  const onChange = (tags: LabeledValue[]): void => {
    const selectedTags = tags.map(
      (tag): Tag => {
        const byId = getTagById(field, tag.key || "");
        const byLabel = getTagByLabel(field, String(tag.value) || "");
        return byId || byLabel || newTag(String(tag.value));
      }
    );

    // if no tag selected yet, return selected tags
    // if there is a tag, find the one not in the values
    const nextTags =
      values.length === 0
        ? selectedTags
        : selectedTags.filter((tag) => {
            return !values.find((v) => v.id === tag.id);
          });

    dispatch(updatePageValueTags(book.id, page.id, field.id, nextTags));
  };

  if (field.readOnly) {
    return (
      <>
        {values.map((tag) => {
          return <AntdTag key={tag.id}>{tag.label}</AntdTag>;
        })}
      </>
    );
  }

  return (
    <Select
      mode="tags"
      style={{ width: "100%" }}
      labelInValue={true}
      value={values.map(
        (tag): LabeledValue => ({
          key: tag.id,
          value: tag.label.toLowerCase(),
          label: tag.label,
        })
      )}
      onChange={onChange}
    >
      {field.tags.map((tag) => {
        return (
          <Select.Option key={tag.id} value={tag.label} label={tag.label}>
            <AntdTag color={tag.color}>{tag.label}</AntdTag>
          </Select.Option>
        );
      })}
    </Select>
  );
};
