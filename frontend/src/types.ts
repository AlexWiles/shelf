import { v4 as uuidv4 } from "uuid";
import { uniqueBy, getRandomColor } from "./lib";
import produce from "immer";

export type TagId = string;

export type Tag = {
  id: TagId;
  label: string;
  color: string;
};

export type TagsById = { [tagId: string]: Tag };

export type FieldId = string;

export type FieldType =
  | "text"
  | "tags"
  | "select"
  | "rate"
  | "url"
  | "textarea"
  | "checkbox"
  | "datetime"
  | "code"
  | "livecode";


type FieldTypeInfo = { value: FieldType; label: string, description?: string };
export const FIELD_TYPES: FieldTypeInfo[] = [
  { value: "text", label: "Text", description: "A simple, single line text field." },
  { value: "textarea", label: "Text area", description: "A markdown editor field. Good for taking notes" },
  { value: "tags", label: "Tags", description: "Multiple tags select" },
  { value: "select", label: "Select", description: "Single tag select" },
  { value: "rate", label: "Stars", description: "Five stars input. " },
  { value: "url", label: "URL", description: "A text input for URLs" },
  { value: "checkbox", label: "Checkbox", description: "A single checkbox" },
  { value: "datetime", label: "Date", description: "A date input" },
  { value: "code", label: "Script", description: "A piece of code that is executed when you click a button" },
  { value: "livecode", label: "Live code", description: "A piece of code that continually runs." },
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

export const newTag = (value: string) => ({
  id: uuidv4(),
  label: value,
  color: getRandomColor(),
});

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

export type VisibleFields = {
  [fieldId: string]: boolean;
};

export type TableView = {
  id: string;
  default: boolean;
  name: string;
  search: string;
  filters?: Record<string, (string | number)[] | null>;
  fieldIds: string[];
  visibleFields: VisibleFields | undefined;
};

export const newTableView = (): TableView => ({
  id: uuidv4(),
  default: false,
  name: "Table view",
  search: "",
  fieldIds: [],
  visibleFields: undefined,
});

export type PageView = {
  id: string;
  default: boolean;
  name: string;
  fieldIds: string[];
  visibleFields: VisibleFields | undefined;
};

export const newPageView = (): PageView => ({
  id: uuidv4(),
  default: false,
  name: "Page view",
  fieldIds: [],
  visibleFields: undefined,
});

export type ViewId = string;

export type TableViewsById = { [viewId: string]: TableView };
export type PageViewsById = { [viewId: string]: PageView };

export const fieldsForView = (
  book: Book,
  view: TableView | PageView
): string[] => {
  // concat view fields and book fields to handle new fields that were added
  // filter out fields not in book fields to handle deleted fields
  return uniqueBy([...view.fieldIds, ...book.allFields], (id) => id).filter(
    (fieldId) => book.fieldsById[fieldId]
  );
};

export const visibleFieldsForView = (
  book: Book,
  view: TableView | PageView
) => {
  return fieldsForView(book, view).filter(
    (fieldId) => !view.visibleFields || view.visibleFields[fieldId]
  );
};

export const visibleFieldsByIdForView = (
  book: Book,
  view: TableView | PageView
) => {
  return visibleFieldsForView(book, view).reduce((obj, fieldId) => {
    return { ...obj, ...{ [fieldId]: true } };
  }, {});
};

export type Book = {
  id: string;
  name: string;
  currentPageId: CurrentPageId;
  pagesById: PagesById;
  allFields: FieldId[];
  fieldsById: FieldsById;
  allTableViews: ViewId[];
  tableViewsById: TableViewsById;
  currentTableViewId: ViewId;
  allPageViews: ViewId[];
  pageViewsById: PageViewsById;
  currentPageViewId: ViewId;
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
  const tableView = { ...newTableView(), ...{ default: true } };
  const pageView = { ...newPageView(), ...{ default: true } };

  return {
    id: uuidv4(),
    name: "New book",
    currentPageId: page.id,
    pagesById: { [page.id]: page },
    allFields: [],
    fieldsById: {},
    allTableViews: [tableView.id],
    tableViewsById: { [tableView.id]: tableView },
    currentTableViewId: tableView.id,
    allPageViews: [pageView.id],
    pageViewsById: { [pageView.id]: pageView },
    currentPageViewId: pageView.id,
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
