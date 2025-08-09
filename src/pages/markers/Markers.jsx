import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Button,
  Modal,
  message,
  Tag,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  CustomTable,
  SearchField,
  TableCustomizeColumnMenu,
} from "../../components";
import { MarkersTableColumn } from "../../content/TableCustomizeColumnData";
import { MarkersDefaultFilter } from "../../content/DefaultFilters";
import { markerService } from "../../services/markerService";
import * as Loader from "../../components/Loaders";
import {
  calculateMarkerStats,
  createDebouncedCallback,
  formatCoordinate,
  getMarkerTypeColor,
  getPartyTimeColor,
  handleApiError,
} from "../../utils";

const { Title, Text } = Typography;

const Markers = () => {
  const [checkedTableMenuColumn, setCheckedTableMenuColumn] =
    useState(MarkersTableColumn);
  const [filter, setFilter] = useState(MarkersDefaultFilter);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ data: [], metaData: {} });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    party: 0,
    bar: 0,
    restaurant: 0,
  });

  // Modal state for delete confirmations
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [markerToDelete, setMarkerToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch markers data
  const fetchMarkers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await markerService.getMarkers(filter);
      setData(response);

      // Calculate stats using utility function
      const calculatedStats = calculateMarkerStats(response.data || []);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching markers:", error);
      message.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMarkers();
  }, [fetchMarkers]);

  // Handle filter change
  const handleFilter = (name, value) => {
    if (name === "filter") {
      setFilter((prev) => ({
        ...prev,
        ...value,
        page: 1,
      }));
    } else if (name === "pagination") {
      setFilter((prev) => ({
        ...prev,
        page: value.current,
        limit: value.pageSize,
      }));
    } else {
      setFilter((prev) => ({
        ...prev,
        [name]: value,
        page: 1,
      }));
    }
    setSelectedRowKeys([]);
  };

  // Delete single marker
  const deleteMarker = async (id) => {
    console.log("deleteMarker called with id:", id);
    setDeleteLoading(true);
    try {
      console.log("Calling markerService.deleteMarker...");
      const result = await markerService.deleteMarker(id);
      console.log("Delete result:", result);
      message.success("Marker deleted successfully");
      fetchMarkers();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Delete error:", error);
      message.error(handleApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  // Delete multiple markers
  const deleteMarkers = async (ids) => {
    console.log("deleteMarkers called with ids:", ids);
    setDeleteLoading(true);
    try {
      console.log("Calling markerService.deleteMarkers...");
      const result = await markerService.deleteMarkers(ids);
      console.log("Bulk delete result:", result);
      message.success(`${ids.length} marker(s) deleted successfully`);
      setSelectedRowKeys([]);
      fetchMarkers();
    } catch (error) {
      console.error("Bulk delete error:", error);
      message.error(handleApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  // Simple action handlers for debugging
  const handleView = (record) => {
    console.log("View clicked for:", record);
    navigate(`/markers/view/${record._id}`);
  };

  const handleEdit = (record) => {
    console.log("Edit clicked for:", record);
    navigate(`/markers/edit/${record._id}`);
  };

  const handleDelete = (record) => {
    console.log("Delete clicked for:", record);
    setMarkerToDelete(record);
    setDeleteModalVisible(true);
  };

  // Handle single delete
  const handleDeleteSingle = () => {
    console.log("handleDeleteSingle called with:", markerToDelete);
    if (markerToDelete) {
      deleteMarker(markerToDelete._id);
      setDeleteModalVisible(false);
      setMarkerToDelete(null);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    console.log("handleBulkDelete called, selectedRowKeys:", selectedRowKeys);

    if (selectedRowKeys.length === 0) {
      message.warning("Please select markers to delete");
      return;
    }

    setBulkDeleteModalVisible(true);
  };

  // Confirm bulk delete
  const confirmBulkDelete = () => {
    console.log("Bulk delete confirmed for:", selectedRowKeys);
    deleteMarkers(selectedRowKeys);
    setBulkDeleteModalVisible(false);
  };

  // Create dropdown menu items
  const getDropdownItems = (record) => [
    {
      key: "view",
      label: (
        <div className="flex items-center gap-2">
          <EyeOutlined />
          <span>View Details</span>
        </div>
      ),
      onClick: () => handleView(record),
    },
    {
      key: "edit",
      label: (
        <div className="flex items-center gap-2">
          <EditOutlined />
          <span>Edit Marker</span>
        </div>
      ),
      onClick: () => handleEdit(record),
    },
    {
      key: "delete",
      label: (
        <div className="flex items-center gap-2 text-red-500">
          <DeleteOutlined />
          <span>Delete</span>
        </div>
      ),
      onClick: () => handleDelete(record),
    },
  ];

  // Row selection
  const onRowSelectionChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelectionChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // Search functionality using utility
  const performSearch = useCallback((searchValue) => {
    setFilter((prev) => ({
      ...prev,
      search: searchValue,
      page: 1,
    }));
  }, []);

  const debouncedSearch = useMemo(
    () => createDebouncedCallback(performSearch, 500),
    [performSearch]
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search, debouncedSearch]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleSearchClear = () => {
    setSearch("");
  };

  // Table columns using utility functions
  const columns = [
    {
      title: "Type",
      dataIndex: "markerType",
      loader: <Loader.TableRowLoader />,
      render: (type) => (
        <Tag
          color={getMarkerTypeColor(type)}
          className="capitalize font-medium px-3 py-1 rounded-full border-0"
        >
          {type?.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Place",
      dataIndex: "placeName",
      loader: <Loader.TableRowLoader />,
      render: (placeName, record) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            {placeName}
          </span>
          <span className="text-xs text-gray-500">Label: {record.markerLabel}</span>
        </div>
      ),
    },
    {
      title: "Party Time",
      dataIndex: "partyTime",
      loader: <Loader.TableRowLoader />,
      render: (time) => (
        <Tag
          color={getPartyTimeColor(time)}
          className="capitalize px-3 py-1 rounded-full text-xs font-semibold border-0"
        >
          {time?.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Location",
      dataIndex: "latitude",
      loader: <Loader.TableRowLoader />,
      render: (lat, record) => (
        <div className="text-xs text-gray-600 font-mono">
          <div>Lat: {formatCoordinate(lat)}</div>
          <div>Lng: {formatCoordinate(record.longitude)}</div>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      loader: <Loader.TableRowLoader />,
      render: (status = "active") => (
        <Tag
          color={status === "active" ? "success" : "default"}
          className="capitalize"
        >
          {status}
        </Tag>
      ),
    },
    {
      dataIndex: "action",
      loader: <Loader.TableActionLoader />,
      render: (_, record) => (
        <Dropdown
          menu={{ items: getDropdownItems(record) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="text"
            icon={<MoreOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mb-4 md:mb-0">
            <Title level={2} className="mb-2 text-gray-800">
              Markers Management
            </Title>
            <Text className="text-gray-600">
              Manage your party venue markers and locations
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/markers/add")}
            className="bg-primary border-primary hover:bg-opacity-90 h-10 px-6 rounded-lg font-medium"
          >
            Add New Marker
          </Button>
        </div>

        {/* Enhanced Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6} lg={6}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Total Markers"
                value={stats.total}
                valueStyle={{
                  color: "#e10098",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix={<span className="text-xs text-gray-500">markers</span>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Parties"
                value={stats.party}
                valueStyle={{
                  color: "#722ed1",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix={<span className="text-xs text-gray-500">venues</span>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Bars"
                value={stats.bar}
                valueStyle={{
                  color: "#fa541c",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix={<span className="text-xs text-gray-500">venues</span>}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={6}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Restaurants"
                value={stats.restaurant}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
                suffix={<span className="text-xs text-gray-500">venues</span>}
              />
            </Card>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <Card className="border-0 shadow-lg rounded-lg">
        {/* Table Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6 p-4 border-b border-gray-100">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <SearchField
                placeholder="Search by type, place, time or label..."
                mobilePlaceholder="Search markers..."
                value={search}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                size="large"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  console.log(
                    "Bulk delete button clicked, selectedRowKeys:",
                    selectedRowKeys
                  );
                  handleBulkDelete();
                }}
                loading={deleteLoading}
                className="h-10 px-4 rounded-lg"
              >
                Delete Selected ({selectedRowKeys.length})
              </Button>
            )}
            <TableCustomizeColumnMenu
              setCheckedTableMenuColumn={setCheckedTableMenuColumn}
              checkedTableMenuColumn={checkedTableMenuColumn}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden">
          <CustomTable
            columns={columns.filter(
              (column) =>
                column.dataIndex === "action" ||
                checkedTableMenuColumn.some(
                  (col) => col.dataIndex === column.dataIndex && col.visible
                )
            )}
            dataSource={data?.data || []}
            pagination={{
              current: filter.page,
              pageSize: filter.limit,
              total: data?.metaData?.totalRecords || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} markers`,
              className: "px-4 py-3",
            }}
            rowSelection={rowSelection}
            setPagination={(pagination) =>
              handleFilter("pagination", pagination)
            }
            isLoading={loading}
            rowKey="_id"
            className="markers-table"
          />
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Marker"
        open={deleteModalVisible}
        onOk={handleDeleteSingle}
        onCancel={() => {
          setDeleteModalVisible(false);
          setMarkerToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: deleteLoading,
        }}
        confirmLoading={deleteLoading}
      >
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined className="text-orange-500 text-xl" />
          <span>Are you sure you want to delete this marker?</span>
        </div>
        {markerToDelete && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium">{markerToDelete.placeName}</div>
            <div className="text-sm text-gray-500">
              {markerToDelete.markerLabel}
            </div>
          </div>
        )}
        <div className="mt-3 text-sm text-red-600">
          This action cannot be undone.
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        title="Delete Selected Markers"
        open={bulkDeleteModalVisible}
        onOk={confirmBulkDelete}
        onCancel={() => setBulkDeleteModalVisible(false)}
        okText="Delete All"
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          loading: deleteLoading,
        }}
        confirmLoading={deleteLoading}
      >
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined className="text-orange-500 text-xl" />
          <span>
            Are you sure you want to delete {selectedRowKeys.length} selected
            marker(s)?
          </span>
        </div>
        <div className="text-sm text-red-600">
          This action cannot be undone.
        </div>
      </Modal>
    </div>
  );
};

export default Markers;
