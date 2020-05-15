import { Book, Page } from "../types";
import React from "react";
import { AddField } from "./AddField";
import FieldInput from "./FieldInput";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { useDispatch } from "react-redux";
import { setBookFieldIds } from "../store";
import { arrMove } from "../lib";

const SortableItem = SortableElement(
  ({ fieldId, book, page }: { fieldId: string; book: Book; page: Page }) => (
    <FieldInput book={book} page={page} field={book.fieldsById[fieldId]} />
  )
);

const Data = SortableContainer(({ book, page }: { book: Book; page: Page }) => {
  return (
    <div>
      {book.allFields.map((fieldId, index) => {
        return (
          <SortableItem
            key={fieldId}
            fieldId={fieldId}
            index={index}
            book={book}
            page={page}
          />
        );
      })}
    </div>
  );
});

const DataDisplay: React.FC<{ book: Book; page: Page }> = ({ book, page }) => {
  const dispatch = useDispatch();

  return (
    <div>
      <Data
        book={book}
        page={page}
        distance={1}
        onSortEnd={({ oldIndex, newIndex }) => {
          const newFieldIdsOrder = arrMove(book.allFields, oldIndex, newIndex);
          dispatch(setBookFieldIds(book.id, newFieldIdsOrder));
        }}
      />
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
          minWidth: "100%",
          minHeight: "100%",
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
            <AddField />
          </div>

          {page ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
            </div>
          ) : undefined}
        </div>
      </div>
    );
  } else {
    return <div>Please visit a web page in the browser </div>;
  }
};
