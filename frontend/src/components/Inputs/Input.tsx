import React, { useState, useEffect } from "react";
import { Input as AntdInput } from "antd";
import { InputProps } from "antd/lib/input";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

type DebouncedInputProps = Overwrite<
  InputProps,
  { onChange: (value: string) => void }
>;

export const DebouncedInput: React.FC<DebouncedInputProps> = (props) => {
  const [state, setState] = useState<string>(props.value as string);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (props.onChange) {
        props.onChange(state);
      }
    }, 400);
    return () => clearTimeout(timeout);
  }, [state, props.onChange]);

  return (
    <AntdInput
      {...{
        ...props,
        ...{
          value: state,
          onChange: (e) => {
            setState(e.target.value);
          },
        },
      }}
    />
  );
};
