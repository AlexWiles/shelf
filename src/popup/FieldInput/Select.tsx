import { Tag, Data, Field } from "../../types";
import { useDispatch } from "react-redux";
import { OrderedSet } from "immutable";
import { LabeledValue } from "antd/lib/select";
import { Select } from "antd";
import { uuid } from "../../lib";
import { updateValueTags } from "../store";
import React from "react";
import { InputLabel } from "./InputLabel";

export const SelectInput: React.FC<{
  url: string;
  urlData: Data;
  field: Field;
}> = ({ url, urlData, field }) => {
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
    const selectedTags = tags.map(
      (tag): Tag => {
        return (
          field.getTagById(tag.key || "") ||
          field.getTagByLabel(String(tag.value) || "") ||
          new Tag({ id: uuid(), label: String(tag.value) })
        );
      }
    );

    // if no tag selected yet, return selected tags
    // if there is a tag, find the one not in the values
    const nextTags =
      values.length === 0
        ? selectedTags
        : selectedTags.filter((tag) => {
            return !values.find((v) => v.key === tag.get("id"));
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
