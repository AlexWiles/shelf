import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Layout, Modal, Button } from "antd";
import {
  store,
  setCurrentPageId,
  setBookPage,
} from "../store";
import { AppState, currentBook, ViewingPage, newPage } from "../types";
import { DataTable } from "./DataTable";
import { PagePanel } from "./PagePanel";
import { Sidebar } from "./Sidebar";
import { RemovePage } from "./RemovePage";

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export const BookScreen: React.FC = () => {
  const dispatch = useDispatch();

  const book = useSelector(currentBook);

  if (!book) {
    return <div>no app selected</div>;
  }

  return (
    <Layout>
      <Modal
        title={book.currentPageId}
        visible={!!book.currentPageId}
        onCancel={() => dispatch(setCurrentPageId(book.id, ""))}
        bodyStyle={{ minHeight: "60vh", display: "flex" }}
        style={{ minWidth: "66vw" }}
        footer={
          <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <RemovePage bookId={book.id} pageId={book.currentPageId || ""} />
            <Button
              key="ok"
              onClick={() => dispatch(setCurrentPageId(book.id, ""))}
            >
              Close
            </Button>
          </div>
        }
      >
        <PagePanel book={book} />
      </Modal>
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
