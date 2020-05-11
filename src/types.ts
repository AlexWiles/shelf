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
  | "pageTitle";

export const FIELD_TYPES: FieldType[] = [
  "text",
  "tags",
  "select",
  "rate",
  "url",
];

export type Field = {
  id: FieldId;
  label: string;
  type: FieldType;
  tags: Tag[];
};

export const newField = (label: string | undefined, type: FieldType) => ({
  id: uuidv4(),
  label: label || "",
  type,
  tags: [],
});

export const getTagById = (field: Field, tagId: TagId): Tag | undefined => {
  return field.tags.find((t) => t.id === tagId);
};

export const getTagByLabel = (
  field: Field,
  tagLabel: string
): Tag | undefined => {
  return field.tags.find((t) => t.label === tagLabel);
};

export type ValueData = string | string[] | number | number[];

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
  [fieldId: string]: ValueData;
};

export type View = {
  id: string;
  search: string;
  filters?: Record<string, (string | number)[] | null>;
};

export type ViewId = string;

export type ViewsById = { [viewId: string]: View };

export type Book = {
  id: string;
  name: string;
  currentPageId: CurrentPageId;
  pagesById: PagesById;
  allFields: FieldId[];
  fieldsById: FieldsById;
  allViews: ViewId[];
  viewsById: ViewsById;
  currentView: ViewId | undefined;
};

export const newBookState = (): Book => {
  const urlField = newField("URL", "url");
  const titleField = newField("Page title", "pageTitle");
  const page = newPage();

  return {
    id: uuidv4(),
    name: "New book",
    currentPageId: page.id,
    pagesById: { [page.id]: page },
    allFields: [urlField.id, titleField.id],
    fieldsById: { [urlField.id]: urlField, [titleField.id]: titleField },
    allViews: [],
    viewsById: {},
    currentView: undefined,
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
