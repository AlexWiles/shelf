import React, { useState } from "react";
import { Book, Page, Field } from "../../types";
import { TextInput } from "./Text";
import { TagsInputs } from "./Tags";
import { SelectInput } from "./Select";
import { RateInput } from "./Rate";
import { InputLabel } from "./InputLabel";
import {
  EllipsisOutlined,
  InfoOutlined,
  DownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, Input, Menu, Typography } from "antd";
import { useDispatch } from "react-redux";
import { updateBookFieldLabel } from "../../store";

const ValueInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  switch (field.type) {
    case "text":
      return <TextInput {...{ book, page, field }} />;
    case "tags":
      return <TagsInputs {...{ book, page, field }} />;
    case "select":
      return <SelectInput {...{ book, page, field }} />;
    case "rate":
      return <RateInput {...{ book, page, field }} />;
    default:
      return <div></div>;
  }
};

const FieldEditIcon: React.FC<{ book: Book; field: Field }> = ({
  book,
  field,
}) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <Menu
          onClick={() => {
            setVisible(true);
          }}
        >
          <Menu.Item key="name">
            <Input
              type="text"
              value={field.label}
              onKeyPress={(e) => {
                switch (e.key) {
                  case "Enter":
                    return setVisible(false);
                }
              }}
              onChange={(e) =>
                dispatch(
                  updateBookFieldLabel(book.id, field.id, e.target.value)
                )
              }
            />
          </Menu.Item>

          <Menu.Item
            icon={
              <Typography.Text type="danger">
                <DeleteOutlined />
              </Typography.Text>
            }
          >
            <Typography.Text type="danger">Delete field</Typography.Text>
          </Menu.Item>
        </Menu>
      }
      trigger={["click"]}
    >
      <div
        style={{ width: 150, marginRight: 5, cursor: "pointer" }}
        onMouseEnter={() => setShowIcon(true)}
        onMouseLeave={() => {
          setShowIcon(false);
        }}
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <Typography.Text strong style={{ marginRight: 5 }}>
            {field.label}
          </Typography.Text>
          <DownOutlined
            style={{ display: showIcon ? "inline-block" : "none" }}
          />
        </a>
      </div>
    </Dropdown>
  );
};

export const FieldInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div style={{ width: 150, marginRight: 5 }}>
        <FieldEditIcon {...{ book, field }} />
      </div>
      <ValueInput book={book} page={page} field={field} />
    </div>
  );
};

export default FieldInput;
