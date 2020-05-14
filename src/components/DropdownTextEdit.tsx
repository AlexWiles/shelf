import React, { useState, ReactNode } from "react";
import { Dropdown, Menu, Input } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export const DropdownEditText: React.FC<{
  text: {
    component: ReactNode;
    value: string;
    onChange: (value: string) => void;
  };
  menuItems: ReactNode[];
  iconStyle?: React.CSSProperties;
}> = ({ text, menuItems, iconStyle = {} }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <Menu>
          <Menu.Item
            key="name"
            onClick={() => {
              setVisible(true);
            }}
          >
            <Input
              type="text"
              value={text.value}
              onKeyPress={(e) => {
                switch (e.key) {
                  case "Enter":
                    return setVisible(false);
                }
              }}
              onChange={(e) => text.onChange(e.target.value)}
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
