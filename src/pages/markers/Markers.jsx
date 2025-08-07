import { useState, useEffect, useCallback, useRef, Fragment, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Space,
  Button,
  Modal,
  message,
  Tag,
  Tooltip,
  Typography,
  Card,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  CustomTable,
  SearchField,
  TableCustomizeColumnMenu,
} from "../../components";
import DropDownMenu from "../../components/DropDownMenu";
import { MarkersTableColumn } from "../../content/TableCustomizeColumnData";
import { MarkersDefaultFilter } from "../../content/DefaultFilters";
import { markersOptions } from "../../content/DropDownData";
import { markerService } from "../../services/markerService";
import * as Loader from "../../components/Loaders";
import { calculateMarkerStats, createDebouncedCallback, formatCoordinate, getMarkerTypeColor, getPartyTimeColor, handleApiError } from "../../utils";
const { Title, Text } = Typography;
const { confirm } = Modal;

const Markers = () => {
  const [checkedTableMenuColumn, setCheckedTableMenuColumn] =
    useState(MarkersTableColumn);
  const [filter, setFilter] = useState(MarkersDefaultFilter);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ data: [], metaData: {} });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    party: 0,
    bar: 0,
    restaurant: 0,
  });

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

  // Handle menu actions
  const handleMenuClick = (key, record) => {
    switch (key) {
      case "view":
        navigate(`/markers/view/${record._id}`);
        break;
      case "edit":
        navigate(`/markers/edit/${record._id}`);
        break;
      case "delete":
        handleDeleteSingle(record);
        break;
      default:
        break;
    }
  };

  // Handle single delete
  const handleDeleteSingle = (record) => {
    confirm({
      title: "Delete Marker",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${record.placeName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteMarker(record._id),
    });
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedRowKeys.length === 0) return;

    confirm({
      title: "Delete Selected Markers",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete ${selectedRowKeys.length} selected marker(s)? This action cannot be undone.`,
      okText: "Delete All",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteMarkers(selectedRowKeys),
    });
  };

  // Delete single marker
  const deleteMarker = async (id) => {
    try {
      await markerService.deleteMarker(id);
      message.success("Marker deleted successfully");
      fetchMarkers();
    } catch (error) {
      message.error(handleApiError(error));
    }
  };

  // Delete multiple markers
  const deleteMarkers = async (ids) => {
    try {
      await markerService.deleteMarkers(ids);
      message.success(`${ids.length} marker(s) deleted successfully`);
      setSelectedRowKeys([]);
      fetchMarkers();
    } catch (error) {
      message.error(handleApiError(error));
    }
  };

  // Row selection
  const onRowSelectionChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onRowSelectionChange,
  };

  // Search functionality using utility
  const performSearch = useCallback((searchValue) => {
    setFilter((prev) => ({
      ...prev,
      search: searchValue,
      page: 1,
    }));
  }, []);

  // useEffect(() => {
  //   // Clear existing timeout
  //   if (debouncedSearchRef.current) {
  //     debouncedSearchRef.current.cancel();
  //   }

  //   // Create new debounced function
  //   debouncedSearchRef.current = createDebouncedCallback(performSearch, 500);

  //   // Execute debounced search
  //   debouncedSearchRef.current(search);

  //   // Cleanup
  //   return () => {
  //     if (debouncedSearchRef.current) {
  //       debouncedSearchRef.current.cancel();
  //     }
  //   };
  // }, [search, performSearch]);
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
          <span className="text-xs text-gray-500">{record.markerLabel}</span>
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
      title: "Actions",
      dataIndex: "action",
      loader: <Loader.TableActionLoader />,
      render: (_, record) => (
        <DropDownMenu
          menuItems={markersOptions}
          onMenuClick={(actionKey) => handleMenuClick(actionKey, record)}
          color="#666666"
          className="dropdown-trigger"
        />
      ),
    },
  ];

  return (
    <Fragment>
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
                onClick={handleBulkDelete}
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
    </Fragment>
  );
};

export default Markers;
