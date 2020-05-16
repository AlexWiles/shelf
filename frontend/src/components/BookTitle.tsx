import React from "react";
import { DropdownEditText } from "./DropdownTextEdit";
import { useDispatch } from "react-redux";
import { Book } from "../types";
import { updateBookName, deleteBook } from "../store";
import { Typography, Menu, Modal } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

export const BookTitle: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  return (
    <DropdownEditText
      text={{
        value: book.name,
        onChange: (v) => dispatch(updateBookName(book.id, v)),
        component: (
          <Typography.Title key={book.id} level={4} style={{ marginBottom: 0 }}>
            {book.name}
          </Typography.Title>
        ),
      }}
      menuItems={[
        <Menu.Item
          key={book.id}
          icon={
            <Typography.Text type="danger">
              <DeleteOutlined />
            </Typography.Text>
          }
          onClick={() => {
            const modal = Modal.confirm({});
            modal.update({
              title: "Are you sure you want to delete this book?",
              icon: <ExclamationCircleOutlined />,
              okText: "Yes",
              cancelText: "No",
              onOk: () => {
                dispatch(deleteBook(book.id));
                modal.destroy();
              },
            });
          }}
        >
          <Typography.Text type="danger">Delete book</Typography.Text>
        </Menu.Item>,
      ]}
    />
  );
};
