import React, { useState } from "react";
import {
  Page,
  Field,
  Book,
  getFieldIdByLabel,
  ValueData,
  getTagByLabel,
  newTag,
} from "../../types";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import {
  setPageFieldValue,
  updateBookFieldText,
  updatePageValueTags,
  updateBookFieldFlag,
} from "../../store";
import Editor from "react-simple-code-editor";
import Prism, * as prism from "prismjs";
import "prismjs/themes/prism.css";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons";
import { Collapsable } from "./Collapsable";

export const CodeInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  const getValue = (label: string) => {
    const fieldId = getFieldIdByLabel(book, label);
    if (fieldId) {
      return page.values[fieldId];
    } else {
      throw `No field ${label}`;
    }
  };

  const setValue = (label: string, value: ValueData): void => {
    const fieldId = getFieldIdByLabel(book, label);

    if (fieldId) {
      const field = book.fieldsById[fieldId];
      if (field.type === "select") {
        const tagLabel = value as string;
        const tag = getTagByLabel(field, tagLabel) || newTag(tagLabel);
        dispatch(updatePageValueTags(book.id, page.id, field.id, [tag]));
      } else {
        dispatch(setPageFieldValue(book.id, page.id, fieldId, value));
      }
    } else {
      throw `No field ${label}`;
    }
  };

  const buttonStyle: React.CSSProperties = field.collapsed
    ? { marginLeft: 5 }
    : { marginTop: 5 };

  return (
    <div style={{ flexGrow: 1, display: field.collapsed ? "flex" : "block" }}>
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
          ...{ display: "flex", justifyContent: "flex-end" },
        }}
      >
        <Button
          onClick={(e) => {
            e.preventDefault();
            eval(field.text);
          }}
        >
          Execute
        </Button>
      </div>
    </div>
  );
};
