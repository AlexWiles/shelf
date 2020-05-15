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
  updateBookFieldFlag,
  updatePageValueTags,
  setPageFieldValue,
} from "../../store";
import Editor from "react-simple-code-editor";
import Prism, * as prism from "prismjs";
import "prismjs/themes/prism.css";
import { Collapsable } from "./Collapsable";
import { transform } from "@babel/standalone";
import { v4 } from "uuid";

const pageValuesToJSON = (book: Book, page: Page) => {
  const obj = book.allFields.reduce((obj, fieldId) => {
    const label = book.fieldsById[fieldId].label;
    return { ...obj, ...{ [label]: page.values[fieldId] } };
  }, {} as { [label: string]: ValueData });

  return JSON.stringify(obj);
};

const fieldsByLabelJSON = (book: Book) => {
  return JSON.stringify(
    book.allFields.reduce((obj, fieldId) => {
      return { ...obj, ...{ [book.fieldsById[fieldId].label]: fieldId } };
    }, {} as { [label: string]: string })
  );
};

const compileFieldCode = (
  book: Book,
  page: Page,
  field: Field,
  sourceId: string
) => {
  const code = `
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

const handleMessage = (
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

export const CodeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  const dispatch = useDispatch();

  const buttonStyle: React.CSSProperties = field.collapsed
    ? { marginRight: 5 }
    : { marginTop: 5 };

  return (
    <div
      style={{
        flexGrow: 1,
        display: field.collapsed ? "flex" : "block",
        flexDirection: "row-reverse",
      }}
    >
      <Collapsable
        style={{
          border: "1px solid rgb(217,217,217)",
        }}
        collapsed={field.collapsed}
        onCollapse={(v) =>
          dispatch(updateBookFieldFlag(book.id, field.id, "collapsed", v))
        }
      >
        <Editor
          value={field.text}
          disabled={field.readOnly}
          onValueChange={(v) => {
            dispatch(updateBookFieldText(book.id, field.id, v));
          }}
          highlight={(code) =>
            prism.highlight(code, Prism.languages.javascript, "javascript")
          }
          padding={5}
          style={{
            fontFamily: '"Fira code", "Fira Mono", monospace',
            fontSize: 12,
            outline: "none",
          }}
        />
      </Collapsable>
      <div
        style={{
          ...buttonStyle,
          ...{ display: "flex" },
        }}
      >
        <ExecuteCodeButton book={book} page={page} field={field} />
      </div>
    </div>
  );
};
