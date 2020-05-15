import React, { useState } from "react";
import { FieldType, AppState, currentBook, Book, FIELD_TYPES } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Button } from "antd";
import { addField } from "../store";
import { v4 as uuidv4 } from "uuid";

export const AddField = () => {
  const book = useSelector<AppState, Book | undefined>(currentBook);
  const dispatch = useDispatch();

  const [label, setLabel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FieldType>("text");

  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <div>
        <Button
          size="small"
          style={{ width: 95, marginRight: 5, marginBottom: 5 }}
          type="default"
          onClick={(e) => {
            e.preventDefault();
            setShowForm(true);
          }}
        >
          + Add field
        </Button>
      </div>
    );
  } else {
    return (
      <div style={{ display: "flex" }}>
        <Input
          style={{ width: 150, marginRight: 5, marginBottom: 5 }}
          placeholder="label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
        />
        <Select
          showSearch
          style={{ width: 150, marginRight: 5, marginBottom: 5 }}
          optionFilterProp="children"
          placeholder="Select field type"
          filterOption={(input, option) =>
            option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          value={selectedType}
          onChange={(v) => setSelectedType(v as FieldType)}
        >
          {FIELD_TYPES.map(({ value, label }) => (
            <Select.Option key={value} value={value}>
              {label}
            </Select.Option>
          ))}
        </Select>
        <Button
          style={{ width: 95, marginRight: 8, marginBottom: 5 }}
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            if (!book) return;

            const id = uuidv4();
            dispatch(addField(book.id, selectedType, label, id));
            setShowForm(false);
            setLabel("");
          }}
        >
          + Add field
        </Button>
        <Button
          danger
          style={{ width: 95, marginRight: 8, marginBottom: 5 }}
          onClick={(e) => {
            e.preventDefault();
            setShowForm(false);
            setLabel("");
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }
};
