import React, { useEffect } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Layout, Typography, Menu, Modal, Button } from "antd";
import {
  store,
  setCurrentPageId,
  updateBookName,
  deleteBook,
  setBookPage,
} from "../store";
import { AppState, currentBook, ViewingPage, newPage } from "../types";
import { DataTable } from "./DataTable";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { DropdownEditText } from "./DropdownTextEdit";
import { PagePanel } from "./PagePanel";
import { Sidebar } from "./Sidebar";
import { getCurrentUrl } from "../lib";

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const BookScreen: React.FC = () => {
  const dispatch = useDispatch();

  const book = useSelector(currentBook);

  if (!book) {
    return <div>no app selected</div>;
  }

  return (
    <Layout>
      <div style={{ paddingLeft: 12, paddingTop: 12, paddingRight: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DropdownEditText
            text={{
              value: book.name,
              onChange: (v) => dispatch(updateBookName(book.id, v)),
              component: (
                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                  {book.name}
                </Typography.Title>
              ),
            }}
            menuItems={[
              <Menu.Item
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

          <Button
            onClick={(e) => {
              e.preventDefault();
              getCurrentUrl((tab) => {
                const page = newPage();
                dispatch(setBookPage(book.id, page.id, page));
                dispatch(setCurrentPageId(book.id, page.id));
              });
            }}
          >
            + New page
          </Button>
        </div>
      </div>
      <Layout.Content
        style={{
          padding: 12,
          resize: "vertical",
          overflow: "hidden",
          flexShrink: 0,
          flexGrow: 0,
          height: "50vh",
        }}
      >
        <div className="contentContainer">
          <PagePanel book={book} />
        </div>
      </Layout.Content>
      <Layout.Content style={{ padding: 12, flexShrink: 0 }}>
        <div className="contentContainer" style={{ padding: 0 }}>
          <DataTable book={book} />
        </div>
      </Layout.Content>
    </Layout>
  );
};

const App: React.FC = () => {
  const [viewing] = useSelector<AppState, [ViewingPage, string | undefined]>(
    ({ currentBookId, viewing }) => [viewing, currentBookId]
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      {viewing === "books" ? <BookScreen /> : <Layout></Layout>}
    </Layout>
  );
};

const Screen: React.FC = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default Screen;
