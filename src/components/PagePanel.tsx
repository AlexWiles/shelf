import { Book, newPage, CurrentPageId, Page } from "../types";
import { useDispatch } from "react-redux";
import React from "react";
import { AddField } from "./AddField";
import { RemovePage } from "./RemovePage";
import { Button } from "antd";
import { setBookPage } from "../store";
import FieldInput from "./FieldInput";

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

export const PagePanel: React.FC<{ book: Book }> = ({ book }) => {
  const page = book.pagesById[book.currentPageId || ""];

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
            {page ? <DataDisplay book={book} page={page} /> : undefined}
          </div>

          {page ? (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <AddField />
              <RemovePage bookId={book.id} page={page} />
            </div>
          ) : undefined }
        </div>
      </div>
    );
  } else {
    return <div>Please visit a web page in the browser </div>;
  }
};
