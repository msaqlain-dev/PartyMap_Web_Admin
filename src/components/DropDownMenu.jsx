import React from "react";
import {
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Dropdown, Space, ConfigProvider } from "antd";

const DropDownMenu = ({
  menuItems,
  onMenuClick = () => {},
  color,
  icon,
  placement = "bottomRight",
  className = "",
}) => {
  // Enhanced menu items with icons
  const enhancedItems = menuItems.map((item) => {
    if (item.type === "divider") {
      return item;
    }

    // Add icons based on key
    let itemIcon = null;
    switch (item.key) {
      case "view":
        itemIcon = <EyeOutlined className="mr-2" />;
        break;
      case "edit":
        itemIcon = <EditOutlined className="mr-2" />;
        break;
      case "delete":
        itemIcon = <DeleteOutlined className="mr-2" />;
        break;
      default:
        itemIcon = item.icon || null;
    }

    return {
      ...item,
      label: (
        <div className="flex items-center py-1 px-2">
          {itemIcon}
          {item.label}
        </div>
      ),
      onClick: () => onMenuClick(item.key),
      className: `dropdown-menu-item ${
        item.key === "delete" ? "dropdown-menu-item-danger" : ""
      }`,
    };
  });

  return (
    <ConfigProvider
      theme={{
        components: {
          Dropdown: {
            borderRadius: 8,
            boxShadow:
              "0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)",
          },
        },
      }}
    >
      <Dropdown
        menu={{
          items: enhancedItems,
          className: "custom-dropdown-menu",
        }}
        overlayClassName="custom-dropdown-overlay"
        placement={placement}
        trigger={["click"]}
        arrow={{ pointAtCenter: true }}
      >
        <div
          className={`cursor-pointer hover:bg-gray-100 rounded-full p-2 transition-all duration-200 ${className}`}
        >
          {icon ? (
            <>{icon}</>
          ) : (
            <Space>
              <MoreOutlined
                className="text-lg"
                style={{
                  color: color || "#666666",
                  transition: "all 0.2s ease",
                }}
              />
            </Space>
          )}
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default DropDownMenu;
