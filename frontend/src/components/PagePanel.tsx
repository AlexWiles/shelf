import { Book, Page, visibleFieldsForView } from "../types";
import React from "react";
import { AddField } from "./AddField";
import FieldInput from "./FieldInput";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { useDispatch } from "react-redux";
import { setBookFieldIds, updatePageView } from "../store";
import { arrMove } from "../lib";

const SortableItem = SortableElement(
  ({ fieldId, book, page }: { fieldId: string; book: Book; page: Page }) => (
    <FieldInput book={book} page={page} field={book.fieldsById[fieldId]} />
  )
);

const SortableFieldList = SortableContainer(({ book, page }: { book: Book; page: Page }) => {
  const view = book.pageViewsById[book.currentPageViewId];
  const visibleFields = visibleFieldsForView(book, view);

  return (
    <div>
      {visibleFields.map((fieldId, index) => {
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

const FieldInputDisplay: React.FC<{ book: Book; page: Page }> = ({ book, page }) => {
  const dispatch = useDispatch();
  const pageView = book.pageViewsById[book.currentPageViewId];

  return (
    <div>
      <SortableFieldList
      helperClass="zIndexAbovePopup"
        book={book}
        page={page}
        distance={1}
        onSortEnd={({ oldIndex, newIndex }) => {
          const newFieldIdsOrder = arrMove(visibleFieldsForView(book, pageView), oldIndex, newIndex);
          const newView = {...pageView, ...{fieldIds: newFieldIdsOrder}}
          dispatch(updatePageView(book.id, newView));
        }}
      />
    </div>
  );
};

export const PagePanel: React.FC<{ book: Book }> = ({ book }) => {
  const page = book.pagesById[book.currentPageId || ""];

  if (book && page) {
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
            <FieldInputDisplay book={book} page={page} />
            <AddField />
          </div>

          {page ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            ></div>
          ) : undefined}
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
};
