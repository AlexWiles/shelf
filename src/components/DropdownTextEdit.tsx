import React, { useState, ReactNode } from "react";
import { Dropdown, Menu, Input } from "antd";
import {
  MenuOutlined,
} from "@ant-design/icons";

export const DropdownEditText: React.FC<{
  text: {
    component: ReactNode;
    value: string;
    onChange: (value: string) => void;
  };
  menuItems: ReactNode[];
}> = ({ text, menuItems }) => {
  const [visible, setVisible] = useState(false);

  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <Menu
        >
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
        style={{ cursor: "pointer" }}
      >
        <a
          onClick={(e) => e.preventDefault()}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <MenuOutlined
            style={{ marginRight: 5, color: "rgba(217,217,217)" }}
          />
          {text.component}
        </a>
      </div>
    </Dropdown>
  );
};
