import React, { useState } from "react";
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
import { EllipsisOutlined } from "@ant-design/icons";

type SelectInputProps = {
  book: Book;
  page: Page;
  field: Field;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export const SelectInput: React.FC<SelectInputProps> = ({
  book,
  field,
  page,
  onBlur = () => {},
  autoFocus,
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
      autoFocus={autoFocus}
      onBlur={onBlur}
      mode="tags"
      style={{ width: "100%" }}
      labelInValue={true}
      tagRender={(props) => {
        const tag = getTagByLabel(field, props.label as string);
        return <AntdTag color={tag?.color}>{props.label}</AntdTag>;
      }}
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

export const SelectInputDisplay: React.FC<SelectInputProps> = ({
  book,
  page,
  field,
}) => {
  const [showInput, setShowInput] = useState(false);

  const taglist = (page.values[field.id] as string[]) || [];

  return (
    <div
      style={{ display: "flex", cursor: "pointer" }}
      onClick={() => (field.readOnly ? undefined : setShowInput(true))}
    >
      {showInput ? (
        <SelectInput
          book={book}
          page={page}
          field={field}
          onBlur={() => setShowInput(false)}
          autoFocus={true}
        />
      ) : (
        taglist.map((tagId) => {
          const tag = getTagById(field, tagId);
          return (
            <AntdTag key={tagId} color={tag?.color}>
              {tag?.label}
            </AntdTag>
          );
        })
      )}
      {taglist.length === 0 && !showInput ? <EllipsisOutlined /> : " "}
    </div>
  );
};
