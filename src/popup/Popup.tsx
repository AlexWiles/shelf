import React, { useEffect, useState, useReducer } from "react";
import { createStore } from "redux";

import "antd/dist/antd.css";
import "./Popup.scss";

import { Provider, useSelector, useDispatch } from "react-redux";
import { Typography, Input, Button, Select, Table } from "antd";

const { Title, Text } = Typography;

const uuid = (): string => {
  // not good, get a better solution
  return Math.random().toString(36).substr(2, 9);
};

type FieldType = "text" | "tags";

type Field = {
  id: string;
  label: string;
  type: FieldType;
};

const defaultValueByFieldType = (fieldType: FieldType) => {
  switch (fieldType) {
    case "text":
      return "";
    default:
      return "";
  }
};

type TagId = string;

type Tag = {
  id: TagId;
  label: string;
};

type Tags = {
  byId: { [id: string]: Tag };
  allIds: string[];
};

type ValueData = string | TagId[] | number | number[];

type UrlDataId = string;

type UrlData = {
  id: UrlDataId;
  values: { [fieldId: string]: ValueData };
};

const newData = (): UrlData => ({
  id: uuid(),
  values: {},
});

type CurrentUrl = string | undefined;

type FieldsById = { [id: string]: Field };
type UrlDataByUrl = { [url: string]: UrlData };

type State = {
  currentUrl: CurrentUrl;
  urls: UrlDataByUrl;
  allFields: string[];
  fieldsById: FieldsById;
};

const initialState: State = {
  currentUrl: undefined,
  urls: {},
  fieldsById: {},
  allFields: [],
};

type Action =
  | { type: "SET_URL"; data: { url: string } }
  | { type: "SET_URL_DATA"; data: { url: string; data: UrlData } }
  | {
      type: "UPDATE_FIELD_LABEL";
      data: { fieldId: string; label: string };
    }
  | {
      type: "ADD_FIELD";
      data: { id: string; fieldType: FieldType; label: string };
    };

const setUrl = (url: string): Action => ({
  type: "SET_URL",
  data: { url },
});
const setUrlData = (url: string, data: UrlData): Action => ({
  type: "SET_URL_DATA",
  data: { url, data },
});
const updateFieldLabel = (fieldId: string, label: string): Action => ({
  type: "UPDATE_FIELD_LABEL",
  data: { fieldId, label },
});
const addField = (
  fieldType: FieldType,
  label: string,
  fieldId: string
): Action => ({
  type: "ADD_FIELD",
  data: { fieldType, id: fieldId, label },
});

const reducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case "SET_URL":
      return { ...state, ...{ currentUrl: action.data.url } };
    case "SET_URL_DATA":
      return {
        ...state,
        ...{
          urls: { ...state.urls, ...{ [action.data.url]: action.data.data } },
        },
      };
    case "UPDATE_FIELD_LABEL":
      return {
        ...state,
        ...{
          fieldsById: {
            ...state.fieldsById,
            ...{
              [action.data.fieldId]: {
                ...state.fieldsById[action.data.fieldId],
                ...{ label: action.data.label },
              },
            },
          },
        },
      };

    case "ADD_FIELD":
      return {
        ...state,
        ...{ allFields: [...state.allFields, action.data.id] },
        ...{
          fieldsById: {
            ...state.fieldsById,
            ...{
              [action.data.id]: {
                id: action.data.id,
                type: action.data.fieldType,
                label: action.data.label,
              },
            },
          },
        },
      };
    default:
      return state;
  }
};

export const loadState = (): State => {
  try {
    const serializedState = localStorage.getItem("state") || "{}";
    return JSON.parse(serializedState);
  } catch (err) {
    return initialState;
  }
};

export const saveState = (state: State): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {
    console.log(err);
  }
};

const persistedStore = loadState();
const store = createStore(
  reducer,
  persistedStore,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
store.subscribe(() => {
  saveState(store.getState());
});

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const FieldInput: React.FC<{
  url: string;
  fieldId: string;
}> = ({ url, fieldId }) => {
  const urlData = useSelector<State, UrlData>((state) => state.urls[url]);
  const field = useSelector<State, Field>((state) => state.fieldsById[fieldId]);
  const dispatch = useDispatch();

  switch (field.type) {
    case "text":
      return (
        <div style={{ display: "flex" }} key={fieldId}>
          <Input
            style={{ width: 200, marginRight: 5, marginBottom: 5 }}
            size="small"
            placeholder="label"
            value={field.label}
            onChange={(e) => {
              dispatch(updateFieldLabel(fieldId, e.target.value));
            }}
          />
          <Input
            style={{ width: 250, marginRight: 5, marginBottom: 5 }}
            size="small"
            value={
              urlData.values[fieldId]
                ? String(urlData.values[fieldId])
                : defaultValueByFieldType(field.type)
            }
            onChange={(e) => {
              dispatch(
                setUrlData(url, {
                  ...urlData,
                  ...{
                    values: {
                      ...urlData.values,
                      ...{ [fieldId]: e.target.value },
                    },
                  },
                })
              );
            }}
          />
        </div>
      );
    default:
      return <div></div>;
  }
};

const AddField = () => {
  const [label, setLabel] = useState<string>("");
  const [selectedType, setSelectedType] = useState<FieldType>("text");
  const dispatch = useDispatch();

  const options: FieldType[] = ["text", "tags"];

  return (
    <div>
      <Input
        style={{ width: 200, marginRight: 5, marginBottom: 5 }}
        size="small"
        placeholder="label"
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
        }}
      />
      <Select
        size="small"
        showSearch
        style={{ width: 150, marginRight: 5, marginBottom: 5 }}
        optionFilterProp="children"
        placeholder="Select field type"
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        value={selectedType}
        onChange={(v) => setSelectedType(v as FieldType)}
      >
        {options.map((ft) => (
          <Select.Option key={ft} value={ft}>
            {ft}
          </Select.Option>
        ))}
      </Select>
      <Button
        style={{ width: 95, marginRight: 5, marginBottom: 5 }}
        size="small"
        type="primary"
        onClick={(e) => {
          e.preventDefault();
          const id = uuid();
          dispatch(addField(selectedType, label, id));
        }}
      >
        + Add field
      </Button>
    </div>
  );
};

const UrlData: React.FC<{ url: string }> = ({ url }) => {
  const allFields = useSelector<State, string[]>(({ allFields }) => allFields);

  return (
    <div>
      <div>
        {allFields.map((fieldId) => {
          return <FieldInput url={url} key={fieldId} fieldId={fieldId} />;
        })}
      </div>
      <AddField />
    </div>
  );
};

const Body: React.FC = () => {
  const currUrl = useSelector<State, CurrentUrl>((state) => state.currentUrl);

  const currUrlData = useSelector<State, UrlData | undefined>((state) =>
    state.currentUrl ? state.urls[state.currentUrl] : undefined
  );

  const dispatch = useDispatch();

  if (!currUrl) {
    return <div>No data for URL</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 200, marginRight: 5, marginBottom: 5 }}>URL</div>
          <div style={{ width: 200, marginRight: 5, marginBottom: 5 }}>
            {currUrl}
          </div>
        </div>
        {currUrlData ? (
          <UrlData url={currUrl} />
        ) : (
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setUrlData(currUrl, newData()));
              }}
            >
              save url
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const getCurrentUrl = (cb: (url: string) => void) => {
  chrome.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    (tab) => {
      if (tab.length > 0) {
        cb(tab[0].url || "");
      }
    }
  );
};

const DataTable: React.FC = () => {
  const fields = useSelector<State, Field[]>((state) =>
    state.allFields.map((id) => state.fieldsById[id])
  );
  const urls = useSelector<State, [string, UrlData][]>((state) =>
    Object.entries(state.urls).map(([url, data]) => [url, data])
  );

  const dataSource = urls.map(([url, data]) => {
    return {
      ...{ id: data.id },
      ...data.values,
      ...{ key: url },
    };
  });

  const columns = fields.map((field) => {
    return {
      title: field.label,
      key: field.id,
      dataIndex: field.id,
    };
  });

  return (
    <div style={{ marginTop: 20 }}>
      <Table size="small" columns={columns} dataSource={dataSource} />
    </div>
  );
};

const AppComponent: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    setInterval(() => {
      getCurrentUrl((url) => {
        if (!url.startsWith("chrome-extension://")) {
          dispatch(setUrl(url));
        }
      });
    }, 500);
  });

  return (
    <div className="popupContainer">
      <Body />
      <DataTable />
    </div>
  );
};

const Popup: React.FC = () => {
  return (
    <AppProvider>
      <AppComponent />
    </AppProvider>
  );
};

export default Popup;
