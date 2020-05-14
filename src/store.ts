import { createStore } from "redux";
import {
  Page,
  FieldId,
  ValueData,
  FieldType,
  Book,
  Tag,
  getTagById,
  newAppState,
  AppState,
  Field,
} from "./types";

import produce from "immer";
import { uniqueBy } from "./lib";

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
      type: "UPDATE_BOOK_FIELD_FLAG";
      data: {
        bookId: string;
        fieldId: string;
        flag: "collapsed" | "readOnly";
        value: boolean;
      };
    }
  | {
      type: "UPDATE_BOOK_FIELD_TEXT";
      data: { bookId: string; fieldId: string; text: string };
    }
  | {
      type: "SET_BOOK_FIELD_IDS";
      data: { bookId: string; fieldIds: string[] };
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
      type: "DELETE_BOOK_FIELD";
      data: {
        bookId: string;
        fieldId: string;
      };
    }
  | {
      type: "UPDATE_PAGE_VALUE_TAGS";
      data: { bookId: string; pageId: string; fieldId: string; tags: Tag[] };
    }
  | {
      type: "DELETE_BOOK_PAGE";
      data: { bookId: string; pageId: string };
    }
  | {
      type: "DELETE_BOOK";
      data: { bookId: string };
    };

export const newBook = (book: Book): Action => ({
  type: "NEW_BOOK",
  data: { book },
});

export const deleteBook = (bookId: string): Action => ({
  type: "DELETE_BOOK",
  data: { bookId },
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

export const updateBookFieldFlag = (
  bookId: string,
  fieldId: string,
  flag: "collapsed" | "readOnly",
  value: boolean
): Action => ({
  type: "UPDATE_BOOK_FIELD_FLAG",
  data: { bookId, fieldId, flag, value },
});

export const updateBookFieldText = (
  bookId: string,
  fieldId: string,
  text: string
): Action => ({
  type: "UPDATE_BOOK_FIELD_TEXT",
  data: { bookId, fieldId, text },
});

export const setBookFieldIds = (
  bookId: string,
  fieldIds: string[]
): Action => ({
  type: "SET_BOOK_FIELD_IDS",
  data: { bookId, fieldIds },
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

export const deleteBookField = (bookId: string, fieldId: string): Action => ({
  type: "DELETE_BOOK_FIELD",
  data: { bookId, fieldId },
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
  switch (action.type) {
    case "NEW_BOOK":
      return produce(state, (draftState) => {
        const { book } = action.data;
        draftState.booksById[book.id] = book;
        draftState.allBookIds.push(book.id);
        draftState.currentBookId = book.id;
      });

    case "DELETE_BOOK":
      return produce(state, (draftState) => {
        const { bookId } = action.data;
        delete draftState.booksById[bookId];
        draftState.allBookIds = draftState.allBookIds.filter(
          (bId) => bId !== bookId
        );
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

    case "UPDATE_BOOK_FIELD_FLAG":
      return produce(state, (draftState) => {
        const { bookId, fieldId, flag, value } = action.data;
        draftState.booksById[bookId].fieldsById[fieldId][flag] = value;
      });

    case "UPDATE_BOOK_FIELD_TEXT":
      return produce(state, (draftState) => {
        const { bookId, fieldId, text } = action.data;
        draftState.booksById[bookId].fieldsById[fieldId].text = text;
      });

    case "SET_BOOK_FIELD_IDS":
      return produce(state, (draftState) => {
        const { bookId, fieldIds } = action.data;
        draftState.booksById[bookId].allFields = fieldIds;
      });

    case "ADD_BOOK_FIELD":
      return produce(state, (draftState) => {
        const { bookId, fieldId, fieldType, label } = action.data;

        draftState.booksById[bookId].allFields.push(fieldId);

        const newField: Field = {
          id: fieldId,
          type: fieldType,
          label: label,
          tags: [],
          text: "",
          collapsed: false,
          readOnly: false,
        };

        draftState.booksById[bookId].fieldsById[action.data.fieldId] = newField;
      });

    case "DELETE_BOOK_FIELD":
      return produce(state, (draftState) => {
        const { bookId, fieldId } = action.data;
        delete draftState.booksById[bookId].fieldsById[fieldId];
        draftState.booksById[bookId].allFields = draftState.booksById[
          bookId
        ].allFields.filter((fId) => fId !== fieldId);
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

        draftState.booksById[bookId].fieldsById[fieldId].tags = uniqueBy(
          nextTags,
          (t) => t.id
        );

        const dataTagIds = uniqueBy(
          tags.map((t) => t.id),
          (s) => s
        );

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
