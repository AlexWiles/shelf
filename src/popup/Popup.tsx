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
  currentPage,
  newBookState,
  ViewingPage,
} from "../types";
import { uuid } from "../lib";
import { AddField } from "../components/AddField";
import { FieldInput } from "../components/FieldInput";
import { DataTable } from "../components/DataTable";
import { PlusOutlined } from "@ant-design/icons";

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
            <div>
              <AddField />
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

const getCurrentUrl = (cb: (url: string) => void) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    (tab) => {
      if (tab.length > 0) {
        cb(tab[0].url || "");
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
      getCurrentUrl((url) => {
        console.log(url);
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
    <>
      <div style={{ paddingLeft: 12, paddingTop: 12 }}>
        <Typography.Text
          strong
          editable={{
            onChange: (v) => dispatch(updateBookName(book.id, v)),
          }}
        >
          {book.name}
        </Typography.Text>
      </div>
      <Layout.Content style={{ padding: 12 }}>
        <div className="contentContainer">
          <PagePanel book={book} />
        </div>
      </Layout.Content>
      <Layout.Content style={{ padding: 12 }}>
        <div className="contentContainer" style={{ padding: 0 }}>
          <DataTable book={book} />
        </div>
      </Layout.Content>
    </>
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
        collapsed={!sidebar}
        onCollapse={(v) => setSidebar(!v)}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[selectedMenuKey]}>
          <Menu.Item
            key="newBook"
            icon={<PlusOutlined />}
            onClick={(e) => {
              dispatch(newBook(newBookState()));
            }}
          >
            Create App
          </Menu.Item>
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
        </Menu>
      </Layout.Sider>
      <Layout>{viewing === "books" ? <BookScreen /> : <div></div>}</Layout>
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
