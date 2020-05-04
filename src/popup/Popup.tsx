import React, { useEffect, useState } from "react";
import { Map, List } from "immutable";
import "antd/dist/antd.css";
import "./Popup.scss";

import { Provider, useSelector, useDispatch } from "react-redux";
import { Button, Layout, Breadcrumb } from "antd";
import { store, setData, setCurrentDataId } from "./store";
import { DataState, Data, CurrentDataId } from "../types";
import { uuid } from "../lib";
import { AddField } from "./AddField";
import { FieldInput } from "./FieldInput";
import { DataTable } from "./DataTable";

export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const DataDisplay: React.FC<{ id: string }> = ({ id }) => {
  const allFields = useSelector<DataState, List<string>>((state) =>
    state.get("allFields")
  );

  return (
    <div>
      <div>
        {allFields.map((fieldId) => {
          return <FieldInput id={id} key={fieldId} fieldId={fieldId} />;
        })}
      </div>
      <AddField />
    </div>
  );
};

const Body: React.FC = () => {
  const currDataid = useSelector<DataState, CurrentDataId>((state) =>
    state.get("currentDataId")
  );

  const currData = useSelector<DataState, Data | undefined>((state) =>
    state.get("currentDataId")
      ? state.get("dataById").get(state.get("currentDataId") || "")
      : undefined
  );

  const dispatch = useDispatch();

  if (!currDataid) {
    return <div>Please visit a web page in the browser </div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex" }}>
          <div style={{ width: 150, marginRight: 5, marginBottom: 5 }}>URL</div>
          <div
            style={{
              flexGrow: 1,
              marginRight: 5,
              marginBottom: 5,
              whiteSpace: "nowrap",

              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <a href={currDataid} target="_blank">
              {currDataid}
            </a>
          </div>
        </div>
        {currData ? (
          <DataDisplay id={currDataid} />
        ) : (
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              size="large"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setData(currDataid, new Data({ id: uuid(), values: Map({}) }))
                );
              }}
            >
              Save URL
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

const AppComponent: React.FC = () => {
  const dispatch = useDispatch();

  const currentDataId = useSelector<DataState, CurrentDataId>((state) =>
    state.get("currentDataId")
  );

  useEffect(() => {
    setInterval(() => {
      getCurrentUrl((url) => {
        if (!url.startsWith("chrome-extension://") && url !== currentDataId) {
          dispatch(setCurrentDataId(url));
        }
      });
    }, 500);
  });

  return (
    <div className="contentContainer">
      <Body />
    </div>
  );
};

const Popup: React.FC = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <AppProvider>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout.Sider
          collapsible
          collapsed={!sidebar}
          onCollapse={(v) => setSidebar(!v)}
        ></Layout.Sider>
        <Layout>
          <div style={{ paddingLeft: 12, paddingTop: 12 }}>
            <h2>hello</h2>
          </div>
          <Layout.Content style={{ padding: 12 }}>
            <AppComponent />
          </Layout.Content>
          <Layout.Content style={{ padding: 12 }}>
            <div className="contentContainer">
              <DataTable />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </AppProvider>
  );
};

export default Popup;
