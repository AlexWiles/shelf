import React, { useState } from "react";
import { Page, Field, Book } from "../../types";
import { useDispatch } from "react-redux";
import { Input, Typography } from "antd";
import { setPageFieldValue, updateBookFieldFlag } from "../../store";
import { Collapsable } from "./Collapsable";
import marked from "marked";
import DOMPurify from "dompurify";

export const TextInput: React.FC<{
  book: Book;
  page: Page;
  field: Field;
}> = ({ book, field, page }) => {
  const dispatch = useDispatch();

  if (field.readOnly) {
    return (
      <Typography.Text>
        {page.values[field.id] ? String(page.values[field.id]) : ""}
      </Typography.Text>
    );
  }

  return (
    <Input
      disabled={field.readOnly}
      value={page.values[field.id] ? String(page.values[field.id]) : ""}
      onChange={(e) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, e.target.value));
      }}
    />
  );
};

type TextareaInputProps = {
  book: Book;
  page: Page;
  field: Field;
  onBlur?: () => void;
  autoFocus?: boolean;
};

export const TextareaInput: React.FC<TextareaInputProps> = ({
  book,
  field,
  page,
  autoFocus,
  onBlur = () => {},
}) => {
  const dispatch = useDispatch();

  if (field.readOnly) {
    return (
      <div style={{ whiteSpace: "pre-line", padding: "4px 11px" }}>
        <Typography.Text>
          {page.values[field.id] ? String(page.values[field.id]) : ""}
        </Typography.Text>
      </div>
    );
  }

  return (
    <Input.TextArea
      autoFocus={autoFocus}
      onBlur={onBlur}
      disabled={field.readOnly}
      autoSize={{ minRows: 2 }}
      value={page.values[field.id] ? String(page.values[field.id]) : ""}
      onChange={(e) => {
        dispatch(setPageFieldValue(book.id, page.id, field.id, e.target.value));
      }}
    />
  );
};

export const TextareaInputDisplay: React.FC<TextareaInputProps> = ({
  book,
  page,
  field,
}) => {
  const [showInput, setShowInput] = useState(false);

  return (
    <div
      style={{ display: "flex", cursor: "pointer", width: "100%" }}
      onClick={() => (field.readOnly ? undefined : setShowInput(true))}
    >
      {showInput && !field.readOnly ? (
        <TextareaInput
          book={book}
          page={page}
          field={field}
          onBlur={() => setShowInput(false)}
          autoFocus={true}
        />
      ) : (
        <div
          style={{
            border: "1px solid rgb(217,217,217)",
            borderRadius: "2px",
            minHeight: 32,
            display: "flex",
            width: "100%",
          }}
        >
          <div
            style={{ padding: "4px 11px" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                marked(String(page.values[field.id] || ""))
              ),
            }}
          ></div>
        </div>
      )}
    </div>
  );
};
