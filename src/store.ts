import { createStore } from "redux";
import {
  Page,
  FieldId,
  ValueData,
  FieldType,
  Book,
  Field,
  Tag,
  getTagById,
  newBookState,
  newAppState,
  AppState,
} from "./types";

import produce from "immer";

export type Action =
  | { type: "NEW_BOOK"; data: { book: Book } }
  | { type: "SET_CURRENT_BOOK_ID"; data: { bookId: string } }
  | { type: "UPDATE_BOOK_NAME"; data: { bookId: string; name: string } }
  | {
      type: "SET_CURRENT_BOOK_PAGE_ID";
      data: { bookId: string; pageId: string };
    }
  | {
      type: "SET_BOOK_PAGE";
      data: { bookId: string; pageId: string; page: Page };
    }
  | {
      type: "SET_PAGE_FIELD_VALUE";
      data: {
        bookId: string;
        pageId: string;
        fieldId: FieldId;
        value: ValueData;
      };
    }
  | {
      type: "UPDATE_BOOK_FIELD_LABEL";
      data: { bookId: string; fieldId: string; label: string };
    }
  | {
      type: "ADD_BOOK_FIELD";
      data: {
        bookId: string;
        fieldId: string;
        fieldType: FieldType;
        label: string;
      };
    }
  | {
      type: "UPDATE_PAGE_VALUE_TAGS";
      data: { bookId: string; pageId: string; fieldId: string; tags: Tag[] };
    }
  | {
      type: "DELETE_BOOK_PAGE";
      data: { bookId: string; pageId: string };
    };

export const newBook = (book: Book): Action => ({
  type: "NEW_BOOK",
  data: { book },
});

export const setCurrentBookId = (bookId: string): Action => ({
  type: "SET_CURRENT_BOOK_ID",
  data: { bookId },
});

export const updateBookName = (bookId: string, name: string): Action => ({
  type: "UPDATE_BOOK_NAME",
  data: { bookId, name },
});

export const setCurrentPageId = (bookId: string, pageId: string): Action => ({
  type: "SET_CURRENT_BOOK_PAGE_ID",
  data: { bookId, pageId },
});

export const setBookPage = (
  bookId: string,
  pageId: string,
  page: Page
): Action => ({
  type: "SET_BOOK_PAGE",
  data: { bookId, pageId, page },
});

export const deleteBookPage = (bookId: string, pageId: string): Action => ({
  type: "DELETE_BOOK_PAGE",
  data: { bookId, pageId },
});

export const setPageFieldValue = (
  bookId: string,
  pageId: string,
  fieldId: FieldId,
  value: ValueData
): Action => ({
  type: "SET_PAGE_FIELD_VALUE",
  data: { bookId, pageId, fieldId, value },
});

export const updateBookFieldLabel = (
  bookId: string,
  fieldId: string,
  label: string
): Action => ({
  type: "UPDATE_BOOK_FIELD_LABEL",
  data: { bookId, fieldId, label },
});

export const addField = (
  bookId: string,
  fieldType: FieldType,
  label: string,
  fieldId: string
): Action => ({
  type: "ADD_BOOK_FIELD",
  data: { bookId, fieldId, fieldType, label },
});

export const updatePageValueTags = (
  bookId: string,
  pageId: string,
  fieldId: string,
  tags: Tag[]
): Action => ({
  type: "UPDATE_PAGE_VALUE_TAGS",
  data: {
    bookId,
    pageId,
    fieldId,
    tags,
  },
});

export const reducer = (
  state: AppState = newAppState(),
  action: Action
): AppState => {
  console.log(action);

  switch (action.type) {
    case "NEW_BOOK":
      return produce(state, (draftState) => {
        const { book } = action.data;
        draftState.booksById[book.id] = book;
        draftState.allBookIds.push(book.id);
        draftState.currentBookId = book.id;
      });
    case "SET_CURRENT_BOOK_ID":
      return produce(state, (draftState) => {
        draftState.currentBookId = action.data.bookId;
      });

    case "UPDATE_BOOK_NAME":
      return produce(state, (draftState) => {
        const { bookId, name } = action.data;
        draftState.booksById[bookId].name = name;
      });

    case "SET_CURRENT_BOOK_PAGE_ID":
      return produce(state, (draftState) => {
        const { bookId, pageId } = action.data;
        draftState.booksById[bookId].currentPageId = pageId;
      });

    case "SET_BOOK_PAGE":
      return produce(state, (draftState) => {
        const { bookId, pageId, page } = action.data;
        draftState.booksById[bookId].pagesById[pageId] = page;
      });

    case "DELETE_BOOK_PAGE":
      return produce(state, (draftState) => {
        const { bookId, pageId } = action.data;
        delete draftState.booksById[bookId].pagesById[pageId];
      });

    case "SET_PAGE_FIELD_VALUE":
      return produce(state, (draftState) => {
        const { bookId, pageId, fieldId, value } = action.data;
        draftState.booksById[bookId].pagesById[pageId].values[fieldId] = value;
      });

    case "UPDATE_BOOK_FIELD_LABEL":
      return produce(state, (draftState) => {
        const { bookId, fieldId, label } = action.data;
        draftState.booksById[bookId].fieldsById[fieldId].label = label;
      });

    case "ADD_BOOK_FIELD":
      return produce(state, (draftState) => {
        const { bookId, fieldId, fieldType, label } = action.data;

        draftState.booksById[bookId].allFields.push(fieldId);

        const newField = {
          id: fieldId,
          type: fieldType,
          label: label,
          tags: [],
        };

        draftState.booksById[bookId].fieldsById[action.data.fieldId] = newField;
      });

    case "UPDATE_PAGE_VALUE_TAGS":
      return produce(state, (draftState) => {
        const { bookId, pageId, fieldId, tags } = action.data;

        const field = draftState.booksById[bookId].fieldsById[fieldId];

        const newTags = tags.filter((currTag) => {
          return !getTagById(field, currTag.id);
        });

        const nextTags = [
          ...draftState.booksById[bookId].fieldsById[fieldId].tags,
          ...newTags,
        ];

        draftState.booksById[bookId].fieldsById[
          fieldId
        ].tags = nextTags.uniqueBy((t) => t.id);

        const dataTagIds = tags.map((t) => t.id).uniqueBy((s) => s);

        draftState.booksById[bookId].pagesById[pageId].values[
          fieldId
        ] = dataTagIds;
      });

    default:
      return state;
  }
};

export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem("state");
    if (serializedState) {
      return JSON.parse(serializedState);
    } else {
      return newAppState();
    }
  } catch (err) {
    return newAppState();
  }
};

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const persistedStore = loadState();

export const store = createStore(
  reducer,
  persistedStore,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});
