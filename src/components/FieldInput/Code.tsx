import React, { useEffect } from "react";
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

export const CodeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, page, field }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      const action = event.data;
      switch (action.type) {
        case "SET_VALUE":
          if (action.fieldId) {
            const field = book.fieldsById[action.fieldId];
            if (field.type === "select") {
              const tagLabel = action.value as string;
              const tag = getTagByLabel(field, tagLabel) || newTag(tagLabel);
              dispatch(updatePageValueTags(book.id, page.id, field.id, [tag]));
            } else {
              dispatch(
                setPageFieldValue(
                  book.id,
                  page.id,
                  action.fieldId,
                  action.value
                )
              );
            }
          }
      }
    };

    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [book, dispatch, page]);

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
        <Button
          onClick={(e) => {
            e.preventDefault();
            const code = `
              const _VALS = ${pageValuesToJSON(
                book,
                page
              )}; const _FIELD_IDS = ${fieldsByLabelJSON(
              book
            )}; const getValue = (label) => _VALS[label]; const setValue = (label, value) => window.postMessage({type: "SET_VALUE", fieldId: _FIELD_IDS[label], value: value});
              ${field.text}`;

            try {
              const transpiled = transform(code, {});
              console.log(transpiled);
              eval(transpiled.code || "");
            } catch (err) {
              alert(err);
            }
          }}
        >
          Execute
        </Button>
      </div>
    </div>
  );
};
