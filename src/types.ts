export type TagId = string;

export type Tag = {
  id: TagId;
  label: string;
};

export type TagsById = { [tagId: string]: Tag };

export type FieldId = string;

export type FieldType = "text" | "tags" | "select" | "rate";

export type Field = {
  id: FieldId;
  label: string;
  type: FieldType;
  tags: Tag[];
};
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

export type Data = {
  id: DataId;
  values: ValuesByFieldId;
};

export type CurrentDataId = string | undefined;

export type FieldsById = { [fieldId: string]: Field };
export type DataById = { [dataId: string]: Data };

export type DataState = {
  currentDataId: CurrentDataId;
  dataById: DataById;
  allFields: FieldId[];
  fieldsById: FieldsById;
};

export const initialDataState = {
  currentDataId: undefined,
  dataById: {},
  allFields: [],
  fieldsById: {},
};
