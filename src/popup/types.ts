import { Set, Map, fromJS, List, Record, OrderedSet } from "immutable";

export type TagId = string;

export class Tag extends Record<{
  id: TagId;
  label: string;
}>({ id: "", label: "" }) {}

export type TagsById = Map<string, Tag>;

export type FieldId = string;

export type FieldType = "text" | "tags" | "select";

export class Field extends Record<{
  id: FieldId;
  label: string;
  type: FieldType;
  tags: Set<Tag>
}>({
  id: "",
  label: "",
  type: "text",
  tags: Set()
}) {
  getTagById(tagId: TagId): Tag | undefined {
    return this.get('tags').find(t => t.get('id') === tagId)
  }

  getTagByLabel(tagLabel: string): Tag | undefined {
    return this.get('tags').find(t => t.label === tagLabel)
  }
}

export const defaultValueByFieldType = (fieldType: FieldType) => {
  switch (fieldType) {
    case "text":
      return "";
    case "tags":
      return [];
    default:
      return "";
  }
};

export type ValueData = string | OrderedSet<TagId> | number | List<number>;

export type UrlDataId = string;

export class UrlData extends Record<{
  id: UrlDataId;
  values: Map<FieldId, ValueData>;
}>({ id: "", values: Map({}) }) {}

export type CurrentUrl = string | undefined;

export type FieldsById = Map<FieldId, Field>;

export type UrlDataByUrl = Map<string, UrlData>;

export class State extends Record<{
  currentUrl: CurrentUrl;
  urls: UrlDataByUrl;
  allFields: List<FieldId>;
  fieldsById: FieldsById;
}>({
  currentUrl: undefined,
  urls: Map({}),
  fieldsById: Map({}),
  allFields: List([]),
}) {}
