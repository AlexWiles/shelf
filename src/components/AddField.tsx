import React, { useState } from "react";
import { FieldType, AppState, currentBook, Book } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { Input, Select, Button, Typography } from "antd";
import { addField } from "../store";
import { uuid } from "../lib";

export const AddField = () => {
  const book = useSelector<AppState, Book | undefined>(currentBook);
  const dispatch = useDispatch();

  const [label, setLabel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FieldType>("text");

  const [showForm, setShowForm] = useState(false);

  const options: FieldType[] = ["text", "tags", "select", "rate"];

  if (!showForm) {
    return (
      <div>
        <Button
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
      <div>
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
          {options.map((ft) => (
            <Select.Option key={ft} value={ft}>
              {ft}
            </Select.Option>
          ))}
        </Select>
        <Button
          style={{ width: 95, marginRight: 5, marginBottom: 5 }}
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            if (!book) return;

            const id = uuid();
            dispatch(addField(book.id, selectedType, label, id));
            setShowForm(false);
            setLabel("");
          }}
        >
          + Add field
        </Button>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            setShowForm(false);
            setLabel("");
          }}
        >
          {" "}
          cancel
        </a>
      </div>
    );
  }
};
