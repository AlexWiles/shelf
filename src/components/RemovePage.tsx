import React from "react";
import { useDispatch } from "react-redux";
import { Page } from "../types";
import { Button, Popconfirm } from "antd";
import { deleteBookPage } from "../store";

export const RemovePage: React.FC<{ bookId: string; page: Page }> = ({
  bookId,
  page,
}) => {
  const dispatch = useDispatch();

  return (
    <Popconfirm
      placement="left"
      title="Are you sure you want to delete this page?"
      onConfirm={() => dispatch(deleteBookPage(bookId, page.id))}
      okText="Yes"
      cancelText="No"
    >
      <Button
        danger
      >
        Delete page
      </Button>
    </Popconfirm>
  );
};
