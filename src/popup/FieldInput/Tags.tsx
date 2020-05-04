import React from "react";
import { UrlData, Field, Tag } from "../types";
import { useDispatch } from "react-redux";
import { OrderedSet } from "immutable";
import { LabeledValue } from "antd/lib/select";
import { Select } from "antd";
import { uuid } from "../../lib";
import { updateValueTags } from "../store";
import { InputLabel } from "./InputLabel";


export const TagsInputs: React.FC<{ url: string; urlData: UrlData; field: Field }> = ({
  url,
  urlData,
  field,
}) => {
  const dispatch = useDispatch();

  const urlTagIds = urlData
    .get("values")
    .get(field.get("id"), OrderedSet()) as OrderedSet<string>;

  const options: LabeledValue[] = field
    .get("tags")
    .map(
      (tag): LabeledValue => ({
        key: tag.id,
        value: tag.label,
        label: tag.label,
      })
    )
    .toArray();

  const values = options.filter((opt) => urlTagIds.includes(opt.key || ""));

  const onChange = (tags: LabeledValue[]): void => {
    const nextTags = tags.map((tag) => {
      return (
        field.getTagById(tag.key || "") ||
        field.getTagByLabel(String(tag.value) || "") ||
        new Tag({ id: uuid(), label: String(tag.value) })
      );
    });

    dispatch(
      updateValueTags(url, field.get("id"), OrderedSet(nextTags).toArray())
    );
  };

  return (
    <div style={{ display: "flex" }} key={field.get("id")}>
      <InputLabel field={field} />
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