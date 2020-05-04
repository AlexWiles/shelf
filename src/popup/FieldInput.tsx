import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { State, UrlData, Field, defaultValueByFieldType, Tag } from "./types";
import { updateFieldLabel, setUrlFieldValue, updateValueTags } from "./store";
import { Input, Select, Typography } from "antd";
import { List, OrderedSet } from "immutable";
import { LabeledValue } from "antd/lib/select";
import { uuid, notUndefined } from "../lib";

const TextInput: React.FC<{ url: string; urlData: UrlData; field: Field }> = ({
  url,
  field,
  urlData,
}) => {
  const dispatch = useDispatch();
  return (
    <div style={{ display: "flex" }} key={field.get("id")}>
      <div style={{ width: 200, marginRight: 5, marginBottom: 5 }}>
        <Typography.Text
          style={{ width: "100%" }}
          editable={{
            onChange: (v) => dispatch(updateFieldLabel(field.get("id"), v)),
          }}
        >
          {field.get("label")}
        </Typography.Text>
      </div>
      <Input
        style={{ width: 250, marginRight: 5, marginBottom: 5 }}
        size="small"
        value={
          urlData.getIn(["values", field.get("id")])
            ? String(urlData.getIn(["values", field.get("id")]))
            : defaultValueByFieldType(field.get("type"))
        }
        onChange={(e) => {
          dispatch(setUrlFieldValue(url, field.get("id"), e.target.value));
        }}
      />
    </div>
  );
};

const TagsInputs: React.FC<{ url: string; urlData: UrlData; field: Field }> = ({
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
      <div style={{ width: 200, marginRight: 5, marginBottom: 5 }}>
        <Typography.Text
          style={{ width: "100%" }}
          editable={{
            onChange: (v) => dispatch(updateFieldLabel(field.get("id"), v)),
          }}
        >
          {field.get("label")}
        </Typography.Text>
      </div>
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

const SelectInput: React.FC<{
  url: string;
  urlData: UrlData;
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
      <div style={{ width: 200, marginRight: 5, marginBottom: 5 }}>
        <Typography.Text
          style={{ width: "100%" }}
          editable={{
            onChange: (v) => dispatch(updateFieldLabel(field.get("id"), v)),
          }}
        >
          {field.get("label")}
        </Typography.Text>
      </div>
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

export const FieldInput: React.FC<{
  url: string;
  fieldId: string;
}> = ({ url, fieldId }) => {
  const urlData = useSelector<State, UrlData>(
    (state) => state.get("urls").get(url) || new UrlData()
  );

  const field = useSelector<State, Field | undefined>((state) =>
    state.get("fieldsById").get(fieldId)
  );

  if (!field) {
    return <></>;
  }

  switch (field.get("type")) {
    case "text":
      return <TextInput url={url} field={field} urlData={urlData} />;
    case "tags":
      return <TagsInputs url={url} field={field} urlData={urlData} />;
    case "select":
      return <SelectInput url={url} field={field} urlData={urlData} />;
    default:
      return <div></div>;
  }
};
