import React, { useState, ReactNode } from "react";
import { Dropdown, Menu, Input } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { DebouncedInput } from "./Inputs/Input";

export const DropdownEditText: React.FC<{
  text: {
    component: ReactNode;
    value: string;
    onChange: (value: string) => void;
  };
  menuItems: ReactNode;
  iconStyle?: React.CSSProperties;
  selectedMenuKeys?: string[];
}> = ({ text, menuItems, selectedMenuKeys, iconStyle = {} }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <Menu selectedKeys={selectedMenuKeys}>
          <Menu.Item
            key="name"
            onClick={(e) => {
              setVisible(true);
            }}
          >
            <DebouncedInput
              type="text"
              value={text.value}
              onKeyPress={(e) => {
                switch (e.key) {
                  case "Enter":
                    return setVisible(false);
                }
              }}
              onChange={(value) => text.onChange(value)}
            />
          </Menu.Item>
          {menuItems}
        </Menu>
      }
      trigger={["click"]}
    >
      <div
        onClick={(e) => e.preventDefault()}
        style={{
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
        }}
      >
        <MenuOutlined
          style={{
            ...{ marginRight: 8, color: "rgba(217,217,217)" },
            ...iconStyle,
          }}
        />
        {text.component}
      </div>
    </Dropdown>
  );
};
