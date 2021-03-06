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
  TableView,
  PageView,
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
        value: ValueData | undefined;
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
      type: "UPDATE_BOOK_FIELD_COLUMN_WIDTH";
      data: {
        bookId: string;
        fieldId: string;
        width: number;
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
    }
  | {
      type: "UPDATE_TABLE_VIEW";
      data: { bookId: string; tableView: TableView };
    }
  | {
      type: "ADD_TABLE_VIEW";
      data: { bookId: string; tableView: TableView };
    }
  | {
      type: "DELETE_TABLE_VIEW";
      data: { bookId: string; tableView: TableView };
    }
  | {
      type: "SET_CURRENT_TABLE_VIEW";
      data: { bookId: string; tableViewId: string };
    }
  | {
      type: "UPDATE_PAGE_VIEW";
      data: { bookId: string; pageView: PageView };
    }
  | {
      type: "ADD_PAGE_VIEW";
      data: { bookId: string; pageView: PageView };
    }
  | {
      type: "DELETE_PAGE_VIEW";
      data: { bookId: string; pageView: PageView };
    }
  | {
      type: "SET_CURRENT_PAGE_VIEW";
      data: { bookId: string; pageViewId: string };
    }
  | {
      type: "UPDATE_FIELD_TAG";
      data: { bookId: string; fieldId: string; tag: Tag };
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
  value: ValueData | undefined
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

export const updateBookFieldColumnWidth = (
  bookId: string,
  fieldId: string,
  width: number
): Action => ({
  type: "UPDATE_BOOK_FIELD_COLUMN_WIDTH",
  data: { bookId, fieldId, width },
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

export const updateTableView = (
  bookId: string,
  tableView: TableView
): Action => ({
  type: "UPDATE_TABLE_VIEW",
  data: { bookId, tableView },
});

export const addTableView = (bookId: string, tableView: TableView): Action => ({
  type: "ADD_TABLE_VIEW",
  data: { bookId, tableView },
});

export const deleteTableView = (
  bookId: string,
  tableView: TableView
): Action => ({
  type: "ADD_TABLE_VIEW",
  data: { bookId, tableView },
});

export const setCurrentTableView = (
  bookId: string,
  tableViewId: string
): Action => ({
  type: "SET_CURRENT_TABLE_VIEW",
  data: { bookId, tableViewId },
});

export const updatePageView = (bookId: string, pageView: PageView): Action => ({
  type: "UPDATE_PAGE_VIEW",
  data: { bookId, pageView },
});

export const addPageView = (bookId: string, pageView: PageView): Action => ({
  type: "ADD_PAGE_VIEW",
  data: { bookId, pageView },
});

export const deletePageView = (bookId: string, pageView: PageView): Action => ({
  type: "ADD_PAGE_VIEW",
  data: { bookId, pageView },
});

export const setCurrentPageView = (
  bookId: string,
  pageViewId: string
): Action => ({
  type: "SET_CURRENT_PAGE_VIEW",
  data: { bookId, pageViewId },
});

export const updateFieldTag = (
  bookId: string,
  fieldId: string,
  tag: Tag
): Action => ({
  type: "UPDATE_FIELD_TAG",
  data: { bookId, fieldId, tag },
});

export const reducer = (
  state: AppState = newAppState(),
  action: Action
): AppState => {
  //console.log(action);

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
        if (draftState.booksById[bookId].currentPageId === pageId) {
          draftState.booksById[bookId].currentPageId = "";
        }
      });

    case "SET_PAGE_FIELD_VALUE":
      return produce(state, (draftState) => {
        const { bookId, pageId, fieldId, value } = action.data;
        if (typeof value === "undefined") {
          delete draftState.booksById[bookId].pagesById[pageId].values[fieldId];
        } else {
          draftState.booksById[bookId].pagesById[pageId].values[
            fieldId
          ] = value;
        }
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

    case "UPDATE_BOOK_FIELD_COLUMN_WIDTH":
      return produce(state, (draftState) => {
        const { bookId, fieldId, width } = action.data;
        draftState.booksById[bookId].fieldsById[
          fieldId
        ].tableColumnWidth = width;
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
        const book = draftState.booksById[bookId];

        book.allFields.push(fieldId);

        const newField: Field = {
          id: fieldId,
          type: fieldType,
          label: label,
          tags: [],
          text: "",
          collapsed: false,
          readOnly: false,
        };

        book.fieldsById[action.data.fieldId] = newField;

        // make new field visible in current views
        const pvVisibleFields =
          book.pageViewsById[book.currentPageViewId].visibleFields;
        if (pvVisibleFields) {
          pvVisibleFields[fieldId] = true;
        }

        const tvVisibleFields =
          book.tableViewsById[book.currentTableViewId].visibleFields;
        if (tvVisibleFields) {
          tvVisibleFields[fieldId] = true;
        }
      });

    case "DELETE_BOOK_FIELD":
      return produce(state, (draftState) => {
        const { bookId, fieldId } = action.data;

        // delete from book fields
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

    case "UPDATE_TABLE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, tableView } = action.data;
        draftState.booksById[bookId].tableViewsById[tableView.id] = tableView;
      });

    case "ADD_TABLE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, tableView } = action.data;
        draftState.booksById[bookId].tableViewsById[tableView.id] = tableView;
        draftState.booksById[bookId].allTableViews.push(tableView.id);
        draftState.booksById[bookId].currentTableViewId = tableView.id;
      });

    case "SET_CURRENT_TABLE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, tableViewId } = action.data;
        draftState.booksById[bookId].currentTableViewId = tableViewId;
      });

    case "UPDATE_PAGE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, pageView } = action.data;
        draftState.booksById[bookId].pageViewsById[pageView.id] = pageView;
      });

    case "ADD_PAGE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, pageView } = action.data;
        draftState.booksById[bookId].pageViewsById[pageView.id] = pageView;
        draftState.booksById[bookId].allPageViews.push(pageView.id);
        draftState.booksById[bookId].currentPageViewId = pageView.id;
      });

    case "SET_CURRENT_PAGE_VIEW":
      return produce(state, (draftState) => {
        const { bookId, pageViewId } = action.data;
        draftState.booksById[bookId].currentPageViewId = pageViewId;
      });

    case "UPDATE_FIELD_TAG":
      return produce(state, (draftState) => {
        const { bookId, fieldId, tag } = action.data;

        const field = draftState.booksById[bookId].fieldsById[fieldId];

        field.tags = field.tags.map((t) => {
          if (t.id === tag.id) {
            return tag;
          } else {
            return t;
          }
        });
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
