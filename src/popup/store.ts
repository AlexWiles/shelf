import { createStore } from "redux";
import {
  Data,
  FieldId,
  ValueData,
  FieldType,
  DataState,
  Field,
  Tag,
  getTagById,
  initialDataState,
} from "../types";

import produce from "immer";

export type Action =
  | { type: "UPDATE_NAME"; data: { name: string } }
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

export const updateName = (name: string): Action => ({
  type: "UPDATE_NAME",
  data: { name },
});

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

export const reducer = (
  state: DataState = initialDataState,
  action: Action
): DataState => {
  console.log(action);

  switch (action.type) {
    case "UPDATE_NAME":
      return produce(state, (draftState) => {
        draftState.name = action.data.name
      })
    case "SET_CURRENT_DATA_ID":
      return produce(state, (draftState) => {
        draftState.currentDataId = action.data.id;
      });
    case "SET_DATA":
      return produce(state, (draftState) => {
        draftState.dataById[action.data.id] = action.data.data;
      });
    case "SET_DATA_FIELD_VALUE":
      return produce(state, (draftState) => {
        draftState.dataById[action.data.id].values[action.data.fieldId] =
          action.data.value;
      });
    case "UPDATE_FIELD_LABEL":
      return produce(state, (draftState) => {
        draftState.fieldsById[action.data.fieldId].label = action.data.label;
      });
    case "ADD_FIELD":
      return produce(state, (draftState) => {
        draftState.allFields.push(action.data.id);

        const newField = {
          id: action.data.id,
          type: action.data.fieldType,
          label: action.data.label,
          tags: [],
        };
        draftState.fieldsById[action.data.id] = newField;
      });
    case "UPDATE_VALUE_TAGS":
      return produce(state, (draftState) => {
        if (draftState.fieldsById[action.data.fieldId]) {
          const field = draftState.fieldsById[action.data.fieldId];
          const newTags = action.data.tags.filter((currTag) => {
            return !getTagById(field, currTag.id);
          });

          const nextTags = [
            ...draftState.fieldsById[action.data.fieldId].tags,
            ...newTags,
          ];

          draftState.fieldsById[action.data.fieldId].tags = nextTags.uniqueBy(
            (t) => t.id
          );

          const dataTagIds = action.data.tags
            .map((t) => t.id)
            .uniqueBy((s) => s);

          draftState.dataById[action.data.id].values[
            action.data.fieldId
          ] = dataTagIds;
        }
      });
    default:
      return state;
  }
};

export const loadState = (): DataState => {
  try {
    const serializedState = localStorage.getItem("state");
    return serializedState ? JSON.parse(serializedState) : initialDataState;
  } catch (err) {
    return initialDataState;
  }
};

export const saveState = (state: DataState): void => {
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
