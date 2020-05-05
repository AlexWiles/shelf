import "./Popup.scss";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Button, Layout, Typography, Menu } from "antd";
import {
  store,
  setBookPage,
  setCurrentPageId,
  updateBookName,
  setCurrentBookId,
  newBook,
} from "../store";
import {
  Book,
  Page,
  newPage,
  CurrentPageId,
  AppState,
  currentBook,
  newBookState,
  ViewingPage,
} from "../types";
import { AddField } from "../components/AddField";
import { FieldInput } from "../components/FieldInput";
import { DataTable } from "../components/DataTable";
import { PlusOutlined, DatabaseOutlined } from "@ant-design/icons";
import { RemovePage } from "../components/RemovePage";

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const DataDisplay: React.FC<{ book: Book; page: Page }> = ({ book, page }) => {
  return (
    <div>
      <div>
        {book.allFields.map((fieldId) => {
          return (
            <FieldInput
              key={fieldId}
              book={book}
              page={page}
              field={book.fieldsById[fieldId]}
            />
          );
        })}
      </div>
    </div>
  );
};

const UrlDisplay: React.FC<{ currentUrl: CurrentPageId }> = ({
  currentUrl,
}) => {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ minWidth: 150, marginRight: 5, marginBottom: 5 }}>URL</div>
      <div
        style={{
          marginRight: 5,
          marginBottom: 5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <a href={currentUrl} target="_blank">
          {currentUrl}
        </a>
      </div>
    </div>
  );
};

const PagePanel: React.FC<{ book: Book }> = ({ book }) => {
  const page = book.pagesById[book.currentPageId || ""];
  const dispatch = useDispatch();

  if (book) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <div>
            <UrlDisplay currentUrl={book.currentPageId} />
            {page ? <DataDisplay book={book} page={page} /> : undefined}
          </div>

          {page ? (
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <AddField />
              <RemovePage bookId={book.id} page={page} />
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                onClick={(e) => {
                  e.preventDefault();
                  if (book.currentPageId) {
                    const page = newPage(book.currentPageId);
                    dispatch(setBookPage(book.id, page.id, page));
                  }
                }}
              >
                Save URL
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return <div>Please visit a web page in the browser </div>;
  }
};

const getCurrentUrl = (cb: (url: chrome.tabs.Tab) => void) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    (tab) => {
      if (tab.length > 0) {
        cb(tab[0]);
      }
    }
  );
};

const BookScreen: React.FC = () => {
  const dispatch = useDispatch();

  const book = useSelector(currentBook);

  const page = book?.currentPageId
    ? book.pagesById[book.currentPageId]
    : undefined;

  useEffect(() => {
    const interval = setInterval(() => {
      getCurrentUrl((tab) => {
        const url = tab.url || "";

        if (
          book &&
          !url.startsWith("chrome-extension://") &&
          url !== page?.id
        ) {
          dispatch(setCurrentPageId(book?.id, url));
        }
      });
    }, 500);
    return () => {
      clearInterval(interval);
    };
  });

  if (!book) {
    return <div>no app selected</div>;
  }

  return (
    <Layout>
      <div style={{ paddingLeft: 12, paddingTop: 12 }}>
        <Typography.Title
          level={4}
          style={{marginBottom: 0}}
          editable={{
            onChange: (v) => dispatch(updateBookName(book.id, v)),
          }}
        >
          {book.name}
        </Typography.Title>
      </div>
      <Layout.Content style={{ padding: 12, resize: "vertical", flexShrink: 0, flexGrow: 0, height: "35vh" }}>
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
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        collapsible
        theme="dark"
        collapsed={!sidebar}
        onCollapse={(v) => setSidebar(!v)}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuKey]} defaultOpenKeys={['books']}>
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
          <Menu.SubMenu icon={<DatabaseOutlined />}key="books" title="Books">
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
      {viewing === "books" ? <BookScreen /> : <Layout></Layout>}
    </Layout>
  );
};

const Popup: React.FC = () => {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
};

export default Popup;
