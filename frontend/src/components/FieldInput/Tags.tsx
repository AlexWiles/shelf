import React, { useState, Dispatch } from "react";
import {
  Page,
  Field,
  getTagById,
  getTagByLabel,
  Book,
  newTag,
} from "../../types";
import { useDispatch } from "react-redux";
import { LabeledValue } from "antd/lib/select";
import { Select, Tag as AntdTag, Menu, Typography, Input, Popover } from "antd";
import { updatePageValueTags, updateFieldTag } from "../../store";
import {
  EllipsisOutlined,
} from "@ant-design/icons";
import { TwitterPicker } from "react-color";

type TagsInputsProps = {
  book: Book;
  page: Page;
  field: Field;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export const TagsInputs: React.FC<TagsInputsProps> = ({
  book,
  field,
  page,
  onBlur = () => {},
  autoFocus,
}) => {
  const dispatch = useDispatch();

  const pageTagIds = (page.values[field.id] as string[]) || [];

  const options: LabeledValue[] = field.tags.map(
    (tag): LabeledValue => ({
      key: tag.id,
      value: tag.label.toLowerCase(),
      label: tag.label,
    })
  );

  const values = field.tags.filter((tag) =>
    pageTagIds.find((id) => id === tag.id)
  );

  const onChange = (tags: LabeledValue[]): void => {
    const nextTags = tags.map((tag) => {
      const byId = getTagById(field, tag.key || "");
      const byLabel = getTagByLabel(field, String(tag.value) || "");
      return byId || byLabel || newTag(String(tag.value));
    });

    dispatch(updatePageValueTags(book.id, page.id, field.id, nextTags));
  };

  if (field.readOnly) {
    return (
      <>
        {values.map((tag) => {
          return (
            <AntdTag key={tag.id} color={tag.color}>
              {tag.label}
            </AntdTag>
          );
        })}
      </>
    );
  }

  return (
    <Select
      disabled={field.readOnly}
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
      onBlur={onBlur}
      autoFocus={autoFocus}
      tagRender={(props) => {
        const tag = getTagByLabel(field, props.label as string);
        return <AntdTag color={tag?.color}>{props.label}</AntdTag>;
      }}
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

export const TagsInputDisplay: React.FC<TagsInputsProps> = ({
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
        <TagsInputs
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

const ColorPicker: React.FC<{
  color: string;
  onChangeComplete: (color: string) => void;
}> = ({ color, onChangeComplete }) => {
  const [state, setState] = useState(false);

  return (
    <div
      style={{ position: "relative" }}
      onMouseEnter={() => setState(true)}
      onMouseLeave={() => setState(false)}
    >
      <div
        style={{
          backgroundColor: color,
          minWidth: 24,
          height: 24,
          marginRight: 8,
          borderRadius: 2,
        }}
      >
        {" "}
      </div>
      <div
        style={{
          display: state ? "" : "none",
          zIndex: 9999,
          position: "absolute",
          left: -5,
          top: 26,
        }}
      >
        <TwitterPicker
          color={color}
          onChangeComplete={(c) => onChangeComplete(c.hex)}
        />
      </div>
    </div>
  );
};

export const fieldDropdownTagOptions = (
  book: Book,
  field: Field,
  dispatch: Dispatch<any>
) => {
  const items = field.tags.map((tag) => (
    <Menu.Item key={tag.id} onClick={() => {}}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <ColorPicker
          color={tag.color}
          onChangeComplete={(color) =>
            dispatch(
              updateFieldTag(book.id, field.id, {
                ...tag,
                ...{ color },
              })
            )
          }
        />
        <Input
          value={tag.label}
          onChange={(v) =>
            dispatch(
              updateFieldTag(book.id, field.id, {
                ...tag,
                ...{ label: v.target.value },
              })
            )
          }
        />
      </div>
    </Menu.Item>
  ));

  if (items.length === 0) {
    return items;
  } else {
    return [
      <Menu.Divider></Menu.Divider>,
      <Menu.Item key="">
        <Typography.Text strong>Values</Typography.Text>
      </Menu.Item>,
      ...items,
    ];
  }
};
