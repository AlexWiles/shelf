import React from "react";
import { Book, Page, Field } from "../../types";
import { TextInput, TextareaInput } from "./Text";
import { TagsInputs } from "./Tags";
import { SelectInput } from "./Select";
import { RateInput } from "./Rate";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Modal, Menu, Typography } from "antd";
import { useDispatch } from "react-redux";
import {
  updateBookFieldLabel,
  deleteBookField,
  updateBookFieldFlag,
} from "../../store";
import { DropdownEditText } from "../DropdownTextEdit";
import { UrlInput } from "./Url";
import { CodeInput } from "./Code";
import { CheckboxInput } from "./Checkbox";

const ValueInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  switch (field.type) {
    case "text":
      return <TextInput {...{ book, page, field }} />;
    case "textarea":
      return <TextareaInput {...{ book, page, field }} />;
    case "code":
      return <CodeInput {...{ book, page, field }} />;
    case "tags":
      return <TagsInputs {...{ book, page, field }} />;
    case "select":
      return <SelectInput {...{ book, page, field }} />;
    case "rate":
      return <RateInput {...{ book, page, field }} />;
    case "url":
      return <UrlInput {...{ book, page, field }} />;
    case "checkbox":
      return <CheckboxInput {...{ book, page, field }} />;
    default:
      return <div></div>;
  }
};

const FieldEditIcon: React.FC<{ book: Book; field: Field }> = ({
  book,
  field,
}) => {
  const dispatch = useDispatch();
  return (
    <DropdownEditText
      text={{
        component: (
          <Typography.Text strong>
            {field.label} {field.readOnly ? <LockOutlined /> : undefined}
          </Typography.Text>
        ),
        value: field.label,
        onChange: (v) => dispatch(updateBookFieldLabel(book.id, field.id, v)),
      }}
      menuItems={[
        <Menu.Item
          key="readOnly"
          icon={
            <Typography.Text>
              {field.readOnly ? <LockOutlined /> : <UnlockOutlined />}
            </Typography.Text>
          }
          onClick={() => {
            dispatch(
              updateBookFieldFlag(
                book.id,
                field.id,
                "readOnly",
                !field.readOnly
              )
            );
          }}
        >
          <Typography.Text>
            {field.readOnly ? "Unlock" : "Lock"}
          </Typography.Text>
        </Menu.Item>,
        <Menu.Item
          key="delete"
          icon={
            <Typography.Text type="danger">
              <DeleteOutlined />
            </Typography.Text>
          }
          onClick={() => {
            const modal = Modal.confirm({});
            modal.update({
              title: "Are you sure you want to delete this field?",
              icon: <ExclamationCircleOutlined />,
              okText: "Yes",
              cancelText: "No",
              onOk: () => {
                dispatch(deleteBookField(book.id, field.id));
                modal.destroy();
              },
            });
          }}
        >
          <Typography.Text type="danger">Delete field</Typography.Text>
        </Menu.Item>,
      ]}
    />
  );
};

export const FieldInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  return (
    <div style={{ display: "flex", alignItems: "top", marginBottom: 5 }}>
      <div style={{ flex: "0 0 150px", marginRight: 5 }}>
        <FieldEditIcon {...{ book, field }} />
      </div>
      <div style={{ display: "flex", flexGrow: 1 }}>
        <ValueInput book={book} page={page} field={field} />
      </div>
    </div>
  );
};

export default FieldInput;
