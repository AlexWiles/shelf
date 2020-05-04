import React, { useState } from "react";
import { FieldType } from "./types";
import { useDispatch } from "react-redux";
import { Input, Select, Button, Typography } from "antd";
import { addField } from "./store";
import { uuid } from "../lib";

export const AddField = () => {
  const [label, setLabel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FieldType>("text");
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);

  const options: FieldType[] = ["text", "tags", "select"];

  if (!showForm) {
    return (
      <div>
        <Button
          style={{ width: 95, marginRight: 5, marginBottom: 5 }}
          size="small"
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
          style={{ width: 200, marginRight: 5, marginBottom: 5 }}
          size="small"
          placeholder="label"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
          }}
        />
        <Select
          size="small"
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
          size="small"
          type="primary"
          onClick={(e) => {
            e.preventDefault();
            const id = uuid();
            dispatch(addField(selectedType, label, id));
            setShowForm(false);
          }}
        >
          + Add field
        </Button>
      </div>
    );
  }
};
