import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
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
  Select,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  LinkOutlined,
  DisconnectOutlined,
} from "@ant-design/icons";
import {
  CustomTable,
  SearchField,
  TableCustomizeColumnMenu,
} from "../../components";
import { PolygonsTableColumn } from "../../content/TableCustomizeColumnData";
import { PolygonsDefaultFilter } from "../../content/DefaultFilters";
import { polygonService } from "../../services/polygonService";
import { markerService } from "../../services/markerService";
import * as Loader from "../../components/Loaders";
import { createDebouncedCallback, handleApiError } from "../../utils";

const { Title, Text } = Typography;
const { Option } = Select;

const Polygons = () => {
  const [checkedTableMenuColumn, setCheckedTableMenuColumn] =
    useState(PolygonsTableColumn);
  const [filter, setFilter] = useState(PolygonsDefaultFilter);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ data: [], meta: {} });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [markersLoading, setMarkersLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    building: 0,
    area: 0,
    zone: 0,
    venue: 0,
    visible: 0,
  });

  // Modal states
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [bulkDeleteModalVisible, setBulkDeleteModalVisible] = useState(false);
  const [associateModalVisible, setAssociateModalVisible] = useState(false);
  const [polygonToDelete, setPolygonToDelete] = useState(null);
  const [polygonToAssociate, setPolygonToAssociate] = useState(null);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const navigate = useNavigate();

  // Get polygon type color
  const getPolygonTypeColor = (type) => {
    const colors = {
      building: "#1890ff",
      area: "#52c41a",
      zone: "#faad14",
      boundary: "#722ed1",
      venue: "#e10098",
      park: "#52c41a",
      parking: "#13c2c2",
      other: "#d9d9d9",
    };
    return colors[type] || "#d9d9d9";
  };

  // Calculate polygon stats
  const calculatePolygonStats = (polygons) => {
    const stats = {
      total: polygons.length,
      building: 0,
      area: 0,
      zone: 0,
      venue: 0,
      visible: 0,
    };

    polygons.forEach((polygon) => {
      if (stats.hasOwnProperty(polygon.polygonType)) {
        stats[polygon.polygonType]++;
      }
      if (polygon.isVisible) {
        stats.visible++;
      }
    });

    return stats;
  };

  // Fetch polygons data
  const fetchPolygons = useCallback(async () => {
    setLoading(true);
    try {
      const response = await polygonService.getPolygons(filter);
      const formattedData = response.data.map((polygon) => ({
        name: polygon.name,
        polygonType: polygon.polygonType,
        marker: polygon.marker || null,
        isVisible: polygon.isVisible,
        height: polygon.extrusion?.height || 0,
        geometry: polygon.geometry,
        _id: polygon._id,
        description: polygon.description || "No description",
        createdAt: polygon.createdAt,
        updatedAt: polygon.updatedAt,
      }));
      setData(formattedData);

      const calculatedStats = calculatePolygonStats(response.data || []);
      setStats(calculatedStats);
    } catch (error) {
      console.error("Error fetching polygons:", error);
      message.error(handleApiError(error));
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Fetch markers for association
  const fetchMarkers = useCallback(async () => {
    try {
      setMarkersLoading(true);
      const response = await markerService.getMarkers({ limit: 1000 }); // Get all markers
      console.log("Fetched markers for association:", response);
      setMarkers(response.data || []);
    } catch (error) {
      console.error("Error fetching markers:", error);
      message.error("Failed to load markers for association");
    } finally {
      setMarkersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolygons();
  }, [fetchPolygons]);

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

  // Delete functions
  const deletePolygon = async (id) => {
    setDeleteLoading(true);
    try {
      await polygonService.deletePolygon(id);
      message.success("Polygon deleted successfully");
      fetchPolygons();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error("Delete error:", error);
      message.error(handleApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  const deletePolygons = async (ids) => {
    setDeleteLoading(true);
    try {
      await polygonService.deletePolygons(ids);
      message.success(`${ids.length} polygon(s) deleted successfully`);
      setSelectedRowKeys([]);
      fetchPolygons();
    } catch (error) {
      console.error("Bulk delete error:", error);
      message.error(handleApiError(error));
    } finally {
      setDeleteLoading(false);
    }
  };

  // Action handlers
  const handleView = (record) => {
    navigate(`/polygons/view/${record._id}`);
  };

  const handleEdit = (record) => {
    navigate(`/polygons/edit/${record._id}`);
  };

  const handleDelete = (record) => {
    setPolygonToDelete(record);
    setDeleteModalVisible(true);
  };

  const handleAssociate = (record) => {
    setPolygonToAssociate(record);
    setSelectedMarkerId(record.marker?._id || null);
    setAssociateModalVisible(true);
  };

  const handleDissociate = async (record) => {
    try {
      await polygonService.dissociateFromMarker(record._id);
      message.success("Polygon dissociated from marker successfully");
      fetchPolygons();
    } catch (error) {
      message.error(handleApiError(error));
    }
  };

  // Modal handlers
  const handleDeleteSingle = () => {
    if (polygonToDelete) {
      deletePolygon(polygonToDelete._id);
      setDeleteModalVisible(false);
      setPolygonToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select polygons to delete");
      return;
    }
    setBulkDeleteModalVisible(true);
  };

  const confirmBulkDelete = () => {
    deletePolygons(selectedRowKeys);
    setBulkDeleteModalVisible(false);
  };

  const handleAssociateConfirm = async () => {
    if (!polygonToAssociate || !selectedMarkerId) {
      message.error("Please select a marker");
      return;
    }

    try {
      await polygonService.associateWithMarker(
        polygonToAssociate._id,
        selectedMarkerId
      );
      message.success("Polygon associated with marker successfully");
      setAssociateModalVisible(false);
      setPolygonToAssociate(null);
      setSelectedMarkerId(null);
      fetchPolygons();
    } catch (error) {
      message.error(handleApiError(error));
    }
  };

  // Dropdown menu items
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
          <span>Edit Polygon</span>
        </div>
      ),
      onClick: () => handleEdit(record),
    },
    {
      key: "associate",
      label: (
        <div className="flex items-center gap-2">
          <LinkOutlined />
          <span>{record.marker ? "Change Marker" : "Associate Marker"}</span>
        </div>
      ),
      onClick: () => handleAssociate(record),
    },
    ...(record.marker
      ? [
          {
            key: "dissociate",
            label: (
              <div className="flex items-center gap-2">
                <DisconnectOutlined />
                <span>Dissociate Marker</span>
              </div>
            ),
            onClick: () => handleDissociate(record),
          },
        ]
      : []),
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

  // Search functionality
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

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      loader: <Loader.TableRowLoader />,
      render: (name, record) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <span className="text-xs text-gray-500 truncate max-w-48">
            {record.description || "No description"}
          </span>
        </div>
      ),
    },
    {
      title: "Type",
      dataIndex: "polygonType",
      loader: <Loader.TableRowLoader />,
      render: (type) => (
        <Tag
          color={getPolygonTypeColor(type)}
          className="capitalize font-medium px-3 py-1 rounded-full border-0"
        >
          {type?.replace("_", " ")}
        </Tag>
      ),
    },
    {
      title: "Coordinates",
      dataIndex: "coordinateCount",
      loader: <Loader.TableRowLoader />,
      render: (_, record) => {
        const outerCount = record.geometry?.coordinates?.[0]?.length || 0;
        const totalRings = record.geometry?.coordinates?.length || 0;
        return (
          <div className="text-xs text-gray-600">
            <div>{outerCount} points</div>
            <div className="text-gray-400">
              {totalRings} ring{totalRings !== 1 ? "s" : ""}
            </div>
          </div>
        );
      },
    },
    {
      title: "Associated Marker",
      dataIndex: "marker",
      loader: <Loader.TableRowLoader />,
      render: (marker) =>
        marker ? (
          <Tag color="blue" className="text-xs">
            <LinkOutlined className="mr-1" />
            {marker.placeName}
          </Tag>
        ) : (
          <Text type="secondary" className="text-xs">
            No marker
          </Text>
        ),
    },
    {
      title: "Visibility",
      dataIndex: "isVisible",
      loader: <Loader.TableRowLoader />,
      render: (isVisible) => (
        <Tag color={isVisible ? "success" : "default"} className="text-xs">
          {isVisible ? "Visible" : "Hidden"}
        </Tag>
      ),
    },
    {
      title: "Height",
      dataIndex: "height",
      loader: <Loader.TableRowLoader />,
      render: (height) => {
        return <span className="text-xs text-gray-600">{height || 0}m</span>;
      },
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
              Polygon Management
            </Title>
            <Text className="text-gray-600">
              Manage 3D polygons and building shapes for your map
            </Text>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate("/polygons/add")}
            className="bg-primary border-primary hover:bg-opacity-90 h-10 px-6 rounded-lg font-medium"
          >
            Add New Polygon
          </Button>
        </div>

        {/* Stats Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={12} sm={6} lg={5}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Total Polygons"
                value={stats.total}
                valueStyle={{
                  color: "#e10098",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Buildings"
                value={stats.building}
                valueStyle={{
                  color: "#1890ff",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Areas"
                value={stats.area}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Venues"
                value={stats.venue}
                valueStyle={{
                  color: "#e10098",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={6} lg={4}>
            <Card className="text-center border-0 shadow-sm rounded-lg hover:shadow-md transition-shadow">
              <Statistic
                title="Visible"
                value={stats.visible}
                valueStyle={{
                  color: "#52c41a",
                  fontSize: "24px",
                  fontWeight: "bold",
                }}
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
                placeholder="Search by name, description, or type..."
                value={search}
                onChange={handleSearchChange}
                onClear={handleSearchClear}
                size="large"
              />
            </div>
            <div>
              <Select
                placeholder="Filter by type"
                allowClear
                style={{ width: 160 }}
                value={filter.type || undefined}
                onChange={(value) => handleFilter("type", value || "")}
              >
                <Option value="building">Building</Option>
                <Option value="area">Area</Option>
                <Option value="zone">Zone</Option>
                <Option value="boundary">Boundary</Option>
                <Option value="venue">Venue</Option>
                <Option value="park">Park</Option>
                <Option value="parking">Parking</Option>
                <Option value="other">Other</Option>
              </Select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {selectedRowKeys.length > 0 && (
              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleBulkDelete}
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
            dataSource={data || []}
            pagination={{
              current: filter.page,
              pageSize: filter.limit,
              total: data?.meta?.totalRecords || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} polygons`,
              className: "px-4 py-3",
            }}
            rowSelection={rowSelection}
            setPagination={(pagination) =>
              handleFilter("pagination", pagination)
            }
            isLoading={loading}
            rowKey="_id"
            className="polygons-table"
          />
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Polygon"
        open={deleteModalVisible}
        onOk={handleDeleteSingle}
        onCancel={() => {
          setDeleteModalVisible(false);
          setPolygonToDelete(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        confirmLoading={deleteLoading}
      >
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined className="text-orange-500 text-xl" />
          <span>Are you sure you want to delete this polygon?</span>
        </div>
        {polygonToDelete && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="font-medium">{polygonToDelete.name}</div>
            <div className="text-sm text-gray-500">
              Type: {polygonToDelete.polygonType}
            </div>
            <div className="text-sm text-gray-500">
              Coordinates:{" "}
              {polygonToDelete.geometry?.coordinates?.[0]?.length || 0} points
            </div>
          </div>
        )}
        <div className="mt-3 text-sm text-red-600">
          This action cannot be undone.
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        title="Delete Selected Polygons"
        open={bulkDeleteModalVisible}
        onOk={confirmBulkDelete}
        onCancel={() => setBulkDeleteModalVisible(false)}
        okText="Delete All"
        cancelText="Cancel"
        okButtonProps={{ danger: true, loading: deleteLoading }}
        confirmLoading={deleteLoading}
      >
        <div className="flex items-center gap-3 mb-4">
          <ExclamationCircleOutlined className="text-orange-500 text-xl" />
          <span>
            Are you sure you want to delete {selectedRowKeys.length} selected
            polygon(s)?
          </span>
        </div>
        <div className="mt-3 text-sm text-red-600">
          This action cannot be undone.
        </div>
      </Modal>

      {/* Associate with Marker Modal */}
      <Modal
        title="Associate Polygon with Marker"
        open={associateModalVisible}
        onOk={handleAssociateConfirm}
        onCancel={() => {
          setAssociateModalVisible(false);
          setPolygonToAssociate(null);
          setSelectedMarkerId(null);
        }}
        okText="Associate"
        cancelText="Cancel"
        confirmLoading={deleteLoading}
      >
        <div className="flex items-center gap-3 mb-4">
          <LinkOutlined className="text-blue-500 text-xl" />
          <span>Associate polygon with a marker</span>
        </div>
        {polygonToAssociate && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <div className="font-medium">{polygonToAssociate.name}</div>
            <div className="text-sm text-gray-500">
              Type: {polygonToAssociate.polygonType}
            </div>
          </div>
        )}
        <Select
          placeholder={
            markersLoading ? "Loading markers..." : "Select a marker"
          }
          style={{ width: "100%" }}
          value={selectedMarkerId || undefined}
          onChange={(value) => setSelectedMarkerId(value)}
          loading={markersLoading}
          disabled={markersLoading}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.children ?? "").toLowerCase().includes(input.toLowerCase())
          }
        >
          {markers.map((marker) => (
            <Option key={marker._id} value={marker._id}>
              <div>
                <div className="font-medium">{marker.placeName}</div>
                <div className="text-xs text-gray-500">
                  {marker.markerType} • {marker.markerLabel}
                </div>
              </div>
            </Option>
          ))}
        </Select>
        {markersLoading && (
          <div className="mt-2 text-xs text-gray-500">
            Loading available markers...
          </div>
        )}
        {!markersLoading && markers.length === 0 && (
          <div className="mt-2 text-xs text-red-500">
            No markers available. Please create some markers first.
          </div>
        )}
        <div className="mt-3 text-sm text-gray-600">
          This will associate the polygon with the selected marker.
        </div>
      </Modal>
    </div>
  );
};

export default Polygons;
