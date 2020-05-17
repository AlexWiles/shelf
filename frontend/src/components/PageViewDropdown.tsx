import React from "react";
import { Book, newPageView } from "../types";
import { useDispatch } from "react-redux";
import { Menu, Typography } from "antd";
import { TableOutlined, PlusOutlined } from "@ant-design/icons";
import {
  setCurrentPageView,
  addPageView,
  updatePageView,
} from "../store";
import { DropdownEditText } from "./DropdownTextEdit";

export const PageViewDropdown: React.FC<{ book: Book }> = ({ book }) => {
  const view = book.pageViewsById[book.currentPageViewId];
  const dispatch = useDispatch();

  const views = book.allPageViews.map((viewId) => {
    const v = book.pageViewsById[viewId];
    return (
      <Menu.Item
        icon={<TableOutlined />}
        key={v.id}
        onClick={() => dispatch(setCurrentPageView(book.id, v.id))}
      >
        {v.name}
      </Menu.Item>
    );
  });

  const newView = (
    <Menu.Item
      icon={<PlusOutlined />}
      key="new-view"
      onClick={() => dispatch(addPageView(book.id, newPageView()))}
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
          dispatch(updatePageView(book.id, { ...view, ...{ name: v } }));
        },
      }}
      selectedMenuKeys={[view.id]}
      menuItems={[...views, newView]}
    />
  );
};
