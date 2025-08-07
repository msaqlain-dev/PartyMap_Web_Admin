import { Dropdown, Checkbox, Space, Row, Col, ConfigProvider } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import "../styles/FilterDropdown.css";

const TableCustomizeColumnMenu = ({
  setCheckedTableMenuColumn,
  checkedTableMenuColumn,
}) => {
  const onChange = (checkedValues) => {
    setCheckedTableMenuColumn((prevColumns) =>
      prevColumns.map((column) => ({
        ...column,
        visible: checkedValues.includes(column.id),
      }))
    );
  };

  const handleRowClick = (value, e) => {
    e.stopPropagation(); // Stop the event from closing the dropdown
    setCheckedTableMenuColumn((prevColumns) =>
      prevColumns.map((column) =>
        column.id === value ? { ...column, visible: !column.visible } : column
      )
    );
  };

  const generateCheckboxOptions = () =>
    checkedTableMenuColumn.map((column) => ({
      label: column.label,
      value: column.id,
    }));

  const generateMenuItems = () => {
    let items = [];

    // Title Section
    items.push({
      key: "filter-title",
      label: (
        <strong className="block text-sm font-normal text-gray-400 px-1 mb-2">
          CUSTOMIZE:
        </strong>
      ),
      type: "group",
    });

    // Checkbox Options
    items.push({
      key: "checkbox-options",
      label: (
        <Checkbox.Group
          value={checkedTableMenuColumn
            .filter((col) => col.visible)
            .map((col) => col.id)}
          onChange={onChange}
          style={{ width: "100%" }}
        >
          <Row gutter={[0, 6]}>
            {generateCheckboxOptions().map((option, index) => (
              <Col span={24} key={index}>
                <div
                  className="flex justify-between items-center px-1 py-[2px] rounded-md cursor-pointer hover:bg-transparent"
                  onClick={(e) => handleRowClick(option.value, e)}
                >
                  <span className="text-sm">
                    {option.label}
                  </span>
                  <Checkbox
                    className={`custom-checkbox-light`}
                    value={option.value}
                    checked={
                      checkedTableMenuColumn.find(
                        (col) => col.id === option.value
                      )?.visible
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      ),
    });

    return items;
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Checkbox: {
            colorPrimary: "#E10098",
            colorPrimaryHover: "#E10098",
          },
        },
      }}
    >
      <Dropdown
        trigger={["click"]}
        dropdownRender={(menu) => (
          <div style={{ marginTop: "10px" }}>
            <div className="p-3 border bg-white rounded-lg no-hover-bg">
              {generateMenuItems().map((item) => (
                <div key={item.key}>{item.label}</div>
              ))}
            </div>
          </div>
        )}
        overlayClassName="w-56 mb-10 hover:bg-transparent"
      >
        <div className="cursor-pointer flex items-center justify-center hover:bg-transparent">
          <Space>
            <span>
              <MoreOutlined className="text-xl" style={{ color: "#E10098" }} />
            </span>
          </Space>
        </div>
      </Dropdown>
    </ConfigProvider>
  );
};

export default TableCustomizeColumnMenu;
