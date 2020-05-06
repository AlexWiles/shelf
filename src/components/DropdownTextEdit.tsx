import React, { useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Input, Typography } from "antd";
import { DeleteOutlined, DownOutlined } from "@ant-design/icons";

export const DropdownEditText: React.FC<{
  text: {
    component: ReactNode;
    value: string;
    onChange: (value: string) => void;
  };
  menuItems: ReactNode;
}> = ({ text, menuItems }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [showIcon, setShowIcon] = useState(false);

  return (
    <Dropdown
      onVisibleChange={setVisible}
      visible={visible}
      overlay={
        <Menu
          onClick={({ item, key }) => {
            if (key !== "name") {
              setVisible(false);
            }
          }}
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
        onMouseEnter={() => setShowIcon(true)}
        onMouseLeave={() => {
          setShowIcon(false);
        }}
      >
        <a
          onClick={(e) => e.preventDefault()}
          style={{ display: "flex", alignItems: "center" }}
        >
          {text.component}
          <DownOutlined
            style={{
              marginLeft: 5,
              display: showIcon ? "inline-block" : "none",
            }}
          />
        </a>
      </div>
    </Dropdown>
  );
};
