import React, { useEffect } from "react";
import { Map, List } from "immutable";
import "antd/dist/antd.css";
import "./Popup.scss";

import { Provider, useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import {
  store,
  setUrlData,
  setUrl,
} from "./store";
import {
  State,
  UrlData,
  CurrentUrl,
} from "./types";
import { uuid } from "../lib";
import { AddField } from "./AddField";
import { FieldInput } from "./FieldInput";
import { DataTable } from "./DataTable";


export const AppProvider: React.FC = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

const UrlDataDisplay: React.FC<{ url: string }> = ({ url }) => {

  const allFields = useSelector<State, List<string>>((state) =>
    state.get("allFields")
  );

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
  const currUrl = useSelector<State, CurrentUrl>((state) =>
    state.get("currentUrl")
  );

  const currUrlData = useSelector<State, UrlData | undefined>((state) =>
    state.get("currentUrl")
      ? state.get("urls").get(state.get("currentUrl") || "")
      : undefined
  );

  const dispatch = useDispatch();

  if (!currUrl) {
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
            <a href={currUrl} target="_blank">
              {currUrl}
            </a>
          </div>
        </div>
        {currUrlData ? (
          <UrlDataDisplay url={currUrl} />
        ) : (
          <div style={{ display: "flex" }}>
            <Button
              type="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault();
                dispatch(
                  setUrlData(
                    currUrl,
                    new UrlData({ id: uuid(), values: Map({}) })
                  )
                );
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

const AppComponent: React.FC = () => {
  const dispatch = useDispatch();

  const currentUrl = useSelector<State, CurrentUrl>(state => state.get('currentUrl'))

  useEffect(() => {
    setInterval(() => {
      getCurrentUrl((url) => {
        if (!url.startsWith("chrome-extension://") && url !== currentUrl) {
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
