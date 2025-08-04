import React from "react";
import { MoreOutlined } from "@ant-design/icons";
import { Dropdown, Space, ConfigProvider } from "antd";

const DropDownMenu = ({ menuItems, onMenuClick = () => {}, color, icon }) => (
  <Dropdown
    menu={{
      items: menuItems.map((item) => ({
        ...item,
        onClick: () => onMenuClick(item.key),
      })),
      className: "bg-white border",
    }}
    overlayClassName="w-auto"
    placement="bottomRight"
  >
    <div className="cursor-pointer text-xl">
      {icon ? (
        <>{icon}</>
      ) : (
        <ConfigProvider theme={{ components: { Space: {} } }}>
          <Space>
            <MoreOutlined
              className="text-xl"
              style={{ color: color || "#1996a6" }}
            />
          </Space>
        </ConfigProvider>
      )}
    </div>
  </Dropdown>
);

export default DropDownMenu;
