import React, { useState, useEffect } from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import Editor from "react-simple-code-editor";
import { updateBookFieldText } from "../../store";
import Prism, { highlight } from "prismjs";
import { Button } from "antd";
import { codeApi, handleMessage } from "./Code";
import { v4 } from "uuid";

const CodeEditor: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  const dispatch = useDispatch();

  const [code, setCode] = useState(field.text);
  const [updated, setUpdated] = useState(false);

  const onSave = () => {
    setUpdated(false);
    dispatch(updateBookFieldText(book.id, field.id, code));
  };

  return (
    <div style={{ position: "relative" }}>
      <Editor
        value={code}
        disabled={field.readOnly}
        onValueChange={(v) => {
          setUpdated(true);
          setCode(v);
        }}
        highlight={(code) =>
          highlight(code, Prism.languages.javascript, "javascript")
        }
        padding={5}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 12,
          outline: "none",
        }}
      />
      <Button
        type="primary"
        disabled={!updated}
        style={{ position: "absolute", bottom: 5, right: 5 }}
        onClick={() => onSave()}
      >
        Save
      </Button>
    </div>
  );
};

const reactDoc = ({
  book,
  page,
  field,
  sourceId,
}: {
  book: Book;
  page: Page;
  field: Field;
  sourceId: string;
}) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/light.min.css">
    <script crossorigin src="https://unpkg.com/react@16/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/@babel/standalone@7.9.6/babel.min.js"></script>
    <script type="text/babel">
      ${codeApi({ book, page, field, sourceId })}
      ${field.text}
      ReactDOM.render(<DefaultComponent {..._props} />, document.getElementById('root'))
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
  </html>`;
};

export const IframeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  const [sourceId] = useState(v4());

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      try {
        handleMessage(book, page, field, sourceId, dispatch, event);
      } catch (err) {
        alert(err);
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [book, field, dispatch, sourceId, page]);

  return (
    <div style={{ flexGrow: 1 }}>
      <div style={{ border: "1px solid rgb(217,217,217);" }}>
        {field.readOnly ? undefined : <CodeEditor {...{ book, page, field }} />}
      </div>
      <div>
        <iframe
          style={{ width: "100%", border: "none" }}
          srcDoc={reactDoc({ book, page, field, sourceId })}
        />
      </div>
    </div>
  );
};
