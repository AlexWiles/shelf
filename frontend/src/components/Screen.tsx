import React from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Layout, Modal, Button } from "antd";
import { store, setCurrentPageId, updatePageView } from "../store";
import {
  AppState,
  currentBook,
  ViewingPage,
  newPage,
  fieldsForView,
  visibleFieldsByIdForView,
  Book,
} from "../types";
import { DataTable } from "./DataTable";
import { PagePanel } from "./PagePanel";
import { Sidebar } from "./Sidebar";
import { RemovePage } from "./RemovePage";
import { PageViewDropdown } from "./PageViewDropdown";
import { FieldDropdown } from "./FieldDropdown";

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const PageViewFieldDropdown: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch();
  const view = book.pageViewsById[book.currentPageViewId];

  return (
    <FieldDropdown
      book={book}
      allFields={fieldsForView(book, view)}
      visibleFields={visibleFieldsByIdForView(book, view)}
      onSortChange={(fieldIds) =>
        dispatch(updatePageView(book.id, { ...view, ...{ fieldIds } }))
      }
      onVisibleChange={(visibleFields) => {
        dispatch(updatePageView(book.id, { ...view, ...{ visibleFields } }));
      }}
    />
  );
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
        title={
          <div style={{ display: "flex" }}>
            <span style={{ marginRight: 16 }}>
              <PageViewDropdown book={book} />
            </span>
            <PageViewFieldDropdown book={book} />
          </div>
        }
        visible={!!book.currentPageId}
        onCancel={() => dispatch(setCurrentPageId(book.id, ""))}
        bodyStyle={{ minHeight: "60vh", display: "flex" }}
        style={{ minWidth: "66vw" }}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
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
