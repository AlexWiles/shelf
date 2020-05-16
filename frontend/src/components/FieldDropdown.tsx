import React, { useState } from "react";
import { SortableElement, SortableContainer } from "react-sortable-hoc";
import { Book, VisibleFields } from "../types";
import { Menu, Switch, Dropdown, Button } from "antd";
import { FieldEditIcon } from "./FieldInput";
import { arrMove } from "../lib";
import { DownOutlined } from "@ant-design/icons";

const SortableItem = SortableElement(
  ({
    fieldId,
    book,
    visibleFields,
    onVisibleChange,
  }: {
    fieldId: string;
    book: Book;
    visibleFields: VisibleFields;
    onVisibleChange: (vf: VisibleFields) => void;
  }) => (
    <div
      className="zIndexAbovePopup"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 8,
      }}
    >
      <div style={{ marginRight: 16 }}>
        <FieldEditIcon book={book} field={book.fieldsById[fieldId]} />
      </div>

      <Switch
        size="small"
        checked={visibleFields[fieldId]}
        onChange={(checked) =>
          onVisibleChange({
            ...visibleFields,
            ...{ [fieldId]: checked },
          })
        }
      />
    </div>
  )
);

const Data = SortableContainer(
  ({
    book,
    allFields,
    visibleFields,
    onVisibleChange,
  }: {
    book: Book;
    allFields: string[];
    visibleFields: VisibleFields;
    onVisibleChange: (vf: VisibleFields) => void;
    visible: boolean;
    setVisible: (v: boolean) => void;
  }) => {
    return (
      <div style={{ padding: "12px 16px" }}>
        {allFields.map((fieldId, index) => {
          return (
            <SortableItem
              key={fieldId}
              index={index}
              book={book}
              fieldId={fieldId}
              visibleFields={visibleFields}
              onVisibleChange={onVisibleChange}
            />
          );
        })}
      </div>
    );
  }
);

export const FieldDropdown: React.FC<{
  book: Book;
  allFields: string[] | undefined;
  visibleFields: VisibleFields;
  onVisibleChange: (vf: VisibleFields) => void;
  onSortChange: (fieldIds: string[]) => void;
}> = ({ book, allFields, visibleFields, onVisibleChange, onSortChange }) => {
  const [visible, setVisible] = useState(false);

  const menu = (
    <Menu selectable={false}>
      <Data
        distance={1}
        helperClass="zIndexAbovePopup"
        book={book}
        allFields={allFields || book.allFields}
        visibleFields={visibleFields}
        onVisibleChange={onVisibleChange}
        visible={visible}
        setVisible={setVisible}
        onSortEnd={({ oldIndex, newIndex }) => {
          const newFieldIdsOrder = arrMove(
            allFields || book.allFields,
            oldIndex,
            newIndex
          );
          onSortChange(newFieldIdsOrder);
        }}
      />
    </Menu>
  );

  return (
    <Dropdown
      trigger={["click"]}
      visible={visible}
      onVisibleChange={setVisible}
      overlay={menu}
    >
      <Button
        size="small"
        onClick={(e) => {
          e.preventDefault();
          console.log("click");
          setVisible(true);
        }}
      >
        Fields <DownOutlined />
      </Button>
    </Dropdown>
  );
};
