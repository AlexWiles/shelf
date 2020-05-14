import React from "react";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

type CollapsableProps = {
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  style?: React.CSSProperties;
  collapsedStyle?: React.CSSProperties;
  expandedStyle?: React.CSSProperties;
};

export const Collapsable: React.FC<CollapsableProps> = ({
  collapsed,
  onCollapse,
  children,
  style,
  collapsedStyle,
  expandedStyle,
}) => {
  const containerStyle: React.CSSProperties = collapsed
    ? {
        ...collapsedStyle,
        ...{
          height: 32,
          overflow: "hidden",
          flexGrow: 1,
        },
      }
    : { ...expandedStyle, ...{ height: "auto" } };

  return (
    <div
      style={{
        ...{ position: "relative", flexGrow: 1 },
        ...style,
        ...containerStyle,
      }}
    >
      {children}

      <div style={{ position: "absolute", right: 10, top: 5 }}>
        {collapsed ? (
          <CaretDownOutlined onClick={() => onCollapse(false)} />
        ) : (
          <CaretUpOutlined onClick={() => onCollapse(true)} />
        )}
      </div>
    </div>
  );
};
