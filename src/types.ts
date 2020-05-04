import { Set, Map, List, Record, OrderedSet } from "immutable";

export type TagId = string;

export class Tag extends Record<{
  _rec_type: "Tag",
  id: TagId;
  label: string;
}>({ id: "", label: "", _rec_type: "Tag" }) {}

export type TagsById = Map<string, Tag>;

export type FieldId = string;

export type FieldType = "text" | "tags" | "select" | "rate";

export class Field extends Record<{
  _rec_type: "Field"
  id: FieldId;
  label: string;
  type: FieldType;
  tags: Set<Tag>
}>({
  _rec_type: "Field",
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

export type ValueData = string | OrderedSet<TagId> | number | List<number>;

export type DataId = string;

export class Data extends Record<{
  _rec_type: "Data"
  id: DataId;
  values: Map<FieldId, ValueData>;
}>({ _rec_type: "Data", id: "", values: Map({}) }) {}

export type CurrentDataId = string | undefined;

export type FieldsById = Map<FieldId, Field>;

export type DataById = Map<string, Data>;

export class DataState extends Record<{
  _rec_type: "DataState",
  currentDataId: CurrentDataId;
  dataById: DataById;
  allFields: List<FieldId>;
  fieldsById: FieldsById;
}>({
  _rec_type: "DataState",
  currentDataId: undefined,
  dataById: Map({}),
  fieldsById: Map({}),
  allFields: List([]),
}) {}

export const knownRecordTypes = Map({
  Tag,
  Field,
  Data,
  DataState,
})
