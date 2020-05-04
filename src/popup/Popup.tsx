import "./Popup.scss";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Button, Layout } from "antd";
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
  const allFields = useSelector<DataState, string[]>(
    (state) => state.allFields
  );

  return (
    <div>
      <div>
        {allFields.map((fieldId) => {
          return <FieldInput id={id} key={fieldId} fieldId={fieldId} />;
        })}
      </div>
    </div>
  );
};

const UrlDisplay: React.FC<{ currentUrl: CurrentDataId }> = ({
  currentUrl,
}) => {
  return (
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
        <a href={currentUrl} target="_blank">
          {currentUrl}
        </a>
      </div>
    </div>
  );
};

const Body: React.FC = () => {
  const currDataId = useSelector<DataState, CurrentDataId>(
    (state) => state.currentDataId
  );

  const currData = useSelector<DataState, Data | undefined>((state) =>
    state.currentDataId ? state.dataById[state.currentDataId] || "" : undefined
  );

  const dispatch = useDispatch();

  if (!currDataId) {
    return <div>Please visit a web page in the browser </div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        <div>
          <UrlDisplay currentUrl={currDataId} />
          {currData ? <DataDisplay id={currDataId} /> : undefined}
        </div>

        {currData ? (
          <div>
            <AddField />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              onClick={(e) => {
                e.preventDefault();
                dispatch(setData(currDataId, { id: uuid(), values: {} }));
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

  const currentDataId = useSelector<DataState, CurrentDataId>(
    (state) => state.currentDataId
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
            Hello
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
