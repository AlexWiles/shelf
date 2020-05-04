import { createStore } from "redux";
import {
  Data,
  FieldId,
  ValueData,
  FieldType,
  DataState,
  Field,
  Tag,
} from "../types";
import { Set, List, fromJS } from "immutable";

export type Action =
  | { type: "SET_CURRENT_DATA_ID"; data: { id: string } }
  | { type: "SET_DATA"; data: { id: string; data: Data } }
  | {
      type: "SET_DATA_FIELD_VALUE";
      data: { id: string; fieldId: FieldId; value: ValueData };
    }
  | {
      type: "UPDATE_FIELD_LABEL";
      data: { fieldId: string; label: string };
    }
  | {
      type: "ADD_FIELD";
      data: { id: string; fieldType: FieldType; label: string };
    }
  | {
      type: "UPDATE_VALUE_TAGS";
      data: { id: string; fieldId: string; tags: Tag[] };
    };

export const setCurrentDataId = (id: string): Action => ({
  type: "SET_CURRENT_DATA_ID",
  data: { id },
});

export const setData = (id: string, data: Data): Action => ({
  type: "SET_DATA",
  data: { id, data },
});

export const setDataFieldValue = (
  id: string,
  fieldId: FieldId,
  value: ValueData
): Action => ({
  type: "SET_DATA_FIELD_VALUE",
  data: { id, fieldId, value },
});

export const updateFieldLabel = (fieldId: string, label: string): Action => ({
  type: "UPDATE_FIELD_LABEL",
  data: { fieldId, label },
});

export const addField = (
  fieldType: FieldType,
  label: string,
  fieldId: string
): Action => ({
  type: "ADD_FIELD",
  data: { fieldType, id: fieldId, label },
});

export const updateValueTags = (id: string, fieldId: string, tags: Tag[]) => ({
  type: "UPDATE_VALUE_TAGS",
  data: {
    id,
    fieldId,
    tags,
  },
});

export const reducer = (state: DataState = new DataState(), action: Action): DataState => {
  console.log(state.toJS(), action);

  switch (action.type) {
    case "SET_CURRENT_DATA_ID":
      return state.set("currentDataId", action.data.id);
    case "SET_DATA":
      return state.setIn(["dataById", action.data.id], action.data.data);
    case "SET_DATA_FIELD_VALUE":
      return state.setIn(
        ["dataById", action.data.id, "values", action.data.fieldId],
        action.data.value
      );
    case "UPDATE_FIELD_LABEL":
      return state.setIn(
        ["fieldsById", action.data.fieldId, "label"],
        action.data.label
      );
    case "ADD_FIELD":
      return state
        .update("allFields", (fields) => fields.push(action.data.id))
        .setIn(
          ["fieldsById", action.data.id],
          new Field({
            id: action.data.id,
            type: action.data.fieldType,
            label: action.data.label,
          })
        );
    case "UPDATE_VALUE_TAGS":
      const field = state.get("fieldsById").get(action.data.fieldId);

      if (field) {
        const newTags = action.data.tags.filter((currTag) => {
          return !field.getTagById(currTag.id);
        });

        const newField = newTags.reduce((f, tag) => {
          return f
            .update("tags", (tags) => tags.merge(Set([tag])));
        }, field);

        return state
          .setIn(["fieldsById", newField.id], newField)
          .setIn(
            ["dataById", action.data.id, "values", action.data.fieldId],
            List(action.data.tags.map((t) => t.id))
          );
      } else {
        return state;
      }
    default:
      return state;
  }
};

export const loadState = (): DataState => {
  try {
    const serializedState = localStorage.getItem("state") || "{}";
    return new DataState(fromJS(JSON.parse(serializedState)));
  } catch (err) {
    return new DataState();
  }
};

export const saveState = (state: DataState): void => {
  try {
    const serializedState = JSON.stringify(state.toJS());
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
