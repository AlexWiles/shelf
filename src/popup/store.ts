import { createStore } from "redux";
import {
  UrlData,
  FieldId,
  ValueData,
  FieldType,
  State,
  Field,
  Tag,
} from "./types";
import { Set, List, fromJS } from "immutable";

export type Action =
  | { type: "SET_URL"; data: { url: string } }
  | { type: "SET_URL_DATA"; data: { url: string; data: UrlData } }
  | {
      type: "SET_URL_FIELD_VALUE";
      data: { url: string; fieldId: FieldId; value: ValueData };
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
      data: { url: string; fieldId: string; tags: Tag[] };
    };

export const setUrl = (url: string): Action => ({
  type: "SET_URL",
  data: { url },
});

export const setUrlData = (url: string, data: UrlData): Action => ({
  type: "SET_URL_DATA",
  data: { url, data },
});

export const setUrlFieldValue = (
  url: string,
  fieldId: FieldId,
  value: ValueData
): Action => ({
  type: "SET_URL_FIELD_VALUE",
  data: { url, fieldId, value },
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

export const updateValueTags = (url: string, fieldId: string, tags: Tag[]) => ({
  type: "UPDATE_VALUE_TAGS",
  data: {
    url,
    fieldId,
    tags,
  },
});

export const reducer = (state: State = new State(), action: Action): State => {
  console.log(state.toJS(), action);

  switch (action.type) {
    case "SET_URL":
      return state.set("currentUrl", action.data.url);
    case "SET_URL_DATA":
      return state.setIn(["urls", action.data.url], action.data.data);
    case "SET_URL_FIELD_VALUE":
      return state.setIn(
        ["urls", action.data.url, "values", action.data.fieldId],
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
            ["urls", action.data.url, "values", action.data.fieldId],
            List(action.data.tags.map((t) => t.id))
          );
      } else {
        return state;
      }
    default:
      return state;
  }
};

export const loadState = (): State => {
  try {
    const serializedState = localStorage.getItem("state") || "{}";
    return fromJS(JSON.parse(serializedState));
  } catch (err) {
    return new State();
  }
};

export const saveState = (state: State): void => {
  try {
    const serializedState = JSON.stringify(state.toObject());
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

export const persistedStore = loadState();

export const store = createStore(
  reducer,
  //persistedStore,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

store.subscribe(() => {
  saveState(store.getState());
});
