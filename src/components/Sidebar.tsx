import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState, ViewingPage, Book, newBookState } from "../types";
import { Layout, Menu } from "antd";
import { PlusOutlined, DatabaseOutlined } from "@ant-design/icons";
import { newBook, setCurrentBookId } from "../store";

export const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const [sidebar, setSidebar] = useState(true);

  const [viewing, currentBookId] = useSelector<
    AppState,
    [ViewingPage, string | undefined]
  >(({ currentBookId, viewing }) => [viewing, currentBookId]);

  const books = useSelector<AppState, Book[]>((s) =>
    s.allBookIds.map((id) => s.booksById[id])
  );

  const selectedMenuKey = viewing === "books" ? currentBookId || "" : "";

  return (
    <Layout.Sider
      collapsible
      theme="dark"
      collapsed={!sidebar}
      onCollapse={(v) => setSidebar(!v)}
    >
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedMenuKey]}
        defaultOpenKeys={["books"]}
      >
        <Menu.Item
          key="newBook"
          icon={<PlusOutlined />}
          onClick={(e) => {
            dispatch(newBook(newBookState()));
          }}
        >
          New book
        </Menu.Item>
        <Menu.Divider />
        <Menu.SubMenu icon={<DatabaseOutlined />} key="books" title="Books">
          {books.map((book) => {
            return (
              <Menu.Item
                key={book.id}
                onClick={(e) => dispatch(setCurrentBookId(book.id))}
              >
                {book.name}
              </Menu.Item>
            );
          })}
        </Menu.SubMenu>
      </Menu>
    </Layout.Sider>
  );
}