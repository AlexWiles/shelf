import React, { useEffect, Dispatch, useState } from "react";
import {
  Page,
  Field,
  Book,
  getTagByLabel,
  newTag,
  ValueData,
} from "../../types";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import {
  updateBookFieldText,
  updatePageValueTags,
  setPageFieldValue,
} from "../../store";
import Editor from "react-simple-code-editor";
import Prism, * as prism from "prismjs";
import "prismjs/themes/prism.css";
import { transform } from "@babel/standalone";
import { v4 } from "uuid";

const pageValuesToJSON = (book: Book, page: Page) => {
  const obj = book.allFields.reduce((obj, fieldId) => {
    const field = book.fieldsById[fieldId];
    const label = field.label;

    if (field.type === "select") {
      const [tagId] = (page.values[fieldId] || []) as string[];
      const tag = field.tags.find((t) => t.id === tagId);
      return { ...obj, ...{ [label]: tag?.label } };
    } else if (field.type === "tags") {
      const tagIds = (page.values[fieldId] || []) as string[];
      const tags = tagIds
        .map((tagId) => field.tags.find((t) => t.id === tagId)?.label)
        .filter((id) => id);
      return { ...obj, ...{ [label]: tags } };
    } else {
      return { ...obj, ...{ [label]: page.values[fieldId] } };
    }
  }, {} as { [label: string]: any });

  return JSON.stringify(obj);
};

const fieldsByLabelJSON = (book: Book) => {
  return JSON.stringify(
    book.allFields.reduce((obj, fieldId) => {
      return { ...obj, ...{ [book.fieldsById[fieldId].label]: fieldId } };
    }, {} as { [label: string]: string })
  );
};

export const codeApi = ({
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
  const code = `
    const proxy = (url, opts) => { return fetch("http://localhost:3001/requests?url=" + url, opts) }
    const _VALS = ${pageValuesToJSON(book, page)};
    const _FIELD_IDS = ${fieldsByLabelJSON(book)};
    const getValue = (label) => _VALS[label];
    const g = (l) => getValue(l);
    const setValue = (label, value) => {
      window.top.postMessage({type: "SET_VALUE", sourceFieldId: "${
        field.id
      }", sourceId: "${sourceId}", fieldId: _FIELD_IDS[label],  value: value})
    };
    const _props = { getValue, g, setValue, s};
    const s = (l, v) => setValue(l, v);`;

  return transform(code, {}).code || "";
};

const compileFieldCode = (
  book: Book,
  page: Page,
  field: Field,
  sourceId: string
) => {
  const code = `
    const proxy = (url, opts) => { return fetch("http://localhost:3001/requests?url=" + url, opts) }
    const _VALS = ${pageValuesToJSON(book, page)};
    const _FIELD_IDS = ${fieldsByLabelJSON(book)};
    const getValue = (label) => _VALS[label];
    const g = (l) => getValue(l);
    const setValue = (label, value) => {
      window.top.postMessage({type: "SET_VALUE", sourceFieldId: "${
        field.id
      }", sourceId: "${sourceId}", fieldId: _FIELD_IDS[label],  value: value})
    };
    const s = (l, v) => setValue(l, v);
    ${field.text}`;

  return transform(code, {}).code || "";
};

export const handleMessage = (
  book: Book,
  page: Page,
  field: Field,
  sourceId: string,
  dispatch: Dispatch<any>,
  event: MessageEvent
) => {
  const action: {
    type: "SET_VALUE";
    fieldId: string;
    value: ValueData;
    sourceId: string;
    sourceFieldId: string;
  } = event.data;

  switch (action.type) {
    case "SET_VALUE":
      if (
        action.fieldId &&
        action.sourceId === sourceId &&
        action.sourceFieldId === field.id
      ) {
        const field = book.fieldsById[action.fieldId];
        switch (field.type) {
          case "select":
            return (() => {
              const tagLabel = action.value as string;
              const tag = getTagByLabel(field, tagLabel) || newTag(tagLabel);
              return dispatch(
                updatePageValueTags(book.id, page.id, field.id, [tag])
              );
            })();
          case "tags":
            return (() => {
              if (
                !Array.isArray(action.value) ||
                ((action.value as unknown) as string[]).find(
                  (v) => typeof v !== "string"
                )
              ) {
                throw new Error(`invalid tags value for ${field.label}`);
              }

              const tagLabels = action.value as string[];
              const tags = tagLabels.map((tagLabel) => {
                return getTagByLabel(field, tagLabel) || newTag(tagLabel);
              });
              return dispatch(
                updatePageValueTags(book.id, page.id, field.id, tags)
              );
            })();
          default:
            return dispatch(
              setPageFieldValue(book.id, page.id, action.fieldId, action.value)
            );
        }
      }
  }
};

export const ExecuteCodeButton: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
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
    <Button
      onClick={(e) => {
        e.preventDefault();
        try {
          const transpiled = compileFieldCode(book, page, field, sourceId);
          eval(transpiled);
        } catch (err) {
          console.log(err);
          alert(err);
        }
      }}
    >
      {field.label}
    </Button>
  );
};

export const CodeEditor: React.FC<{
  code: string;
  disabled?: boolean;
  onChange: (v: string) => void;
}> = ({ code, disabled, onChange }) => {
  return (
    <Editor
      value={code}
      disabled={disabled}
      onValueChange={(v) => onChange(v)}
      highlight={(code) =>
        prism.highlight(code, Prism.languages.javascript, "javascript")
      }
      padding={5}
      style={{
        fontFamily: '"Fira code", "Fira Mono", monospace',
        fontSize: 12,
        outline: "none",
        minHeight: 32,
      }}
    />
  );
};

export const CodeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  const dispatch = useDispatch();
  return (
    <div style={{ flexGrow: 1 }}>
      {field.readOnly ? undefined : (
        <CodeEditor
          code={field.text}
          disabled={field.readOnly}
          onChange={(v) => {
            dispatch(updateBookFieldText(book.id, field.id, v));
          }}
        />
      )}
      <div
        style={{
          display: "flex",
        }}
      >
        <ExecuteCodeButton book={book} page={page} field={field} />
      </div>
    </div>
  );
};

export const LiveCodeExecute: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
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

  useEffect(() => {
    try {
      const transpiled = compileFieldCode(book, page, field, sourceId);
      eval(transpiled);
    } catch (err) {
      console.log(err);
      alert(err);
    }
  }, [book, page, field, sourceId]);

  return <></>;
};

export const LiveCodeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  const dispatch = useDispatch();
  const [code, setCode] = useState(field.text);
  const [updated, setUpdated] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        flexGrow: 1,
        border: "1px solid rgb(217,217,217)",
        borderRadius: 2,
        minHeight: 32,
      }}
    >
      <LiveCodeExecute {...{book, page, field}} />

      <CodeEditor
        code={code}
        disabled={field.readOnly}
        onChange={(v) => {
          setCode(v);
          setUpdated(true);
        }}
      />
      <Button
        type="primary"
        size="small"
        disabled={!updated}
        style={{ position: "absolute", bottom: 5, right: 5 }}
        onClick={() => {
          setUpdated(false);
          dispatch(updateBookFieldText(book.id, field.id, code));
        }}
      >
        Save
      </Button>
    </div>
  );
};
