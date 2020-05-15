import { v4 as uuidv4 } from "uuid";

export type TagId = string;

export type Tag = {
  id: TagId;
  label: string;
};

export type TagsById = { [tagId: string]: Tag };

export type FieldId = string;

export type FieldType =
  | "text"
  | "tags"
  | "select"
  | "rate"
  | "url"
  | "code"
  | "textarea"
  | "checkbox"
  | "datetime";

export const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text area" },
  { value: "tags", label: "Tags" },
  { value: "select", label: "Select" },
  { value: "rate", label: "Stars" },
  { value: "url", label: "URL" },
  { value: "code", label: "Code" },
  { value: "checkbox", label: "Checkbox" },
  { value: "datetime", label: "Date" },
];

export type Field = {
  id: FieldId;
  label: string;
  type: FieldType;
  tags: Tag[];
  text: string;
  collapsed: boolean;
  readOnly: boolean;
  tableColumnWidth?: number;
};

export const newField = (
  label: string | undefined,
  type: FieldType
): Field => ({
  id: uuidv4(),
  label: label || "",
  type,
  tags: [],
  text: "",
  collapsed: false,
  readOnly: false,
});

export const getTagById = (field: Field, tagId: TagId): Tag | undefined => {
  return field.tags.find((t) => t.id === tagId);
};

export const getTagByLabel = (
  field: Field,
  tagLabel: string
): Tag | undefined => {
  return field.tags.find(
    (t) => t.label.toLowerCase() === tagLabel.toLowerCase()
  );
};

export const newTag = (value: string) => ({ id: uuidv4(), label: value });

export type ValueData = string | string[] | number | number[] | boolean;

export type DataId = string;

export type ValuesByFieldId = { [fieldId: string]: ValueData };

export type Page = {
  id: string;
  values: ValuesByFieldId;
};

export const newPage = (): Page => ({
  id: uuidv4(),
  values: {},
});

export type CurrentPageId = string | undefined;

export type FieldsById = { [fieldId: string]: Field };

export type PagesById = { [pageId: string]: Page };

export type RowType = {
  key: string;
  id: string;
  page: Page;
};

export type TableView = {
  id: string;
  search: string;
  filters?: Record<string, (string | number)[] | null>;
};

export type ViewId = string;

export type TableViewsById = { [viewId: string]: TableView };

export type PageView = {
  id: string;
  allFields: FieldId[]
}

export type Book = {
  id: string;
  name: string;
  currentPageId: CurrentPageId;
  pagesById: PagesById;
  allFields: FieldId[];
  fieldsById: FieldsById;
  allTableViews: ViewId[];
  tableViewsById: TableViewsById;
  currentTableViewId: ViewId | undefined;
  allPageViews: ViewId[];
  pageViewsById: TableViewsById;
  currentPageViewId: ViewId | undefined;
};

export const getFieldIdByLabel = (
  book: Book,
  label: string
): string | undefined => {
  return book.allFields.find(
    (fieldId) => book.fieldsById[fieldId].label === label
  );
};

export const newBookState = (): Book => {
  const page = newPage();

  return {
    id: uuidv4(),
    name: "New book",
    currentPageId: page.id,
    pagesById: { [page.id]: page },
    allFields: [],
    fieldsById: {},
    allTableViews: [],
    tableViewsById: {},
    currentTableViewId: undefined,
    allPageViews: [],
    pageViewsById: {},
    currentPageViewId: undefined,
  };
};

export type BooksById = { [bookId: string]: Book };

export type ViewingPage = "books" | "settings";

export type AppState = {
  viewing: "books" | "settings";
  currentBookId: string | undefined;
  booksById: BooksById;
  allBookIds: string[];
};

export const currentBook = (appState: AppState): Book | undefined => {
  if (appState.currentBookId) {
    return appState.booksById[appState.currentBookId];
  }
  return undefined;
};

export const currentPage = (appState: AppState): Page | undefined => {
  const book = currentBook(appState);
  if (book && book.currentPageId) {
    return book.pagesById[book.currentPageId];
  }
  return undefined;
};

export const newAppState = (): AppState => ({
  viewing: "books",
  currentBookId: undefined,
  booksById: {},
  allBookIds: [],
});
