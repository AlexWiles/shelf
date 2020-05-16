import React from "react";
import { Book, newTableView } from "../types";
import { useDispatch } from "react-redux";
import { Menu, Typography } from "antd";
import { TableOutlined, PlusOutlined } from "@ant-design/icons";
import { setCurrentTableView, addTableView, updateTableView } from "../store";
import { DropdownEditText } from "./DropdownTextEdit";

export const TableViewDropdown: React.FC<{ book: Book }> = ({ book }) => {
  const view = book.tableViewsById[book.currentTableViewId];
  const dispatch = useDispatch();

  const views = book.allTableViews.map((viewId) => {
    const v = book.tableViewsById[viewId];
    return (
      <Menu.Item
        icon={<TableOutlined />}
        key={v.id}
        onClick={() => dispatch(setCurrentTableView(book.id, v.id))}
      >
        {v.name}
      </Menu.Item>
    );
  });

  const newView = (
    <Menu.Item
      icon={<PlusOutlined />}
      key="new-view"
      onClick={() => dispatch(addTableView(book.id, newTableView(book)))}
    >
      New view
    </Menu.Item>
  );

  return (
    <DropdownEditText
      text={{
        value: view.name,
        component: <Typography.Text>{view.name}</Typography.Text>,
        onChange: (v) => {
          dispatch(updateTableView(book.id, { ...view, ...{ name: v } }));
        },
      }}
      selectedMenuKeys={[view.id]}
      menuItems={[...views, newView]}
    />
  );
};
