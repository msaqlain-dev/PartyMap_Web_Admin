import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tag,
  Space,
  Descriptions,
  Spin,
  Alert,
  Statistic,
  Divider,
  Table,
  Modal,
  message,
  Badge,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import { polygonService } from "../../services/polygonService";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export default function ViewPolygon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [polygon, setPolygon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPolygon = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await polygonService.getPolygon(id);
        console.log("API Response:", response);
        setPolygon(response.data);
      } catch (err) {
        console.error("Error fetching polygon:", err);
        setError(err.message || "Failed to load polygon data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPolygon();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/polygons/edit/${id}`);
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Polygon",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${polygon?.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      confirmLoading: deleteLoading,
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await polygonService.deletePolygon(id);
          message.success("Polygon deleted successfully");
          navigate("/polygons");
        } catch (error) {
          console.error("Delete error:", error);
          message.error(error.message || "Error deleting polygon");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

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

  const getTotalCoordinates = () => {
    if (!polygon?.geometry?.coordinates) return 0;
    let total = 0;
    polygon.geometry.coordinates.forEach((ring) => {
      total += ring.length;
    });
    return total;
  };

  const copyCoordinates = () => {
    if (!polygon?.geometry?.coordinates) return;

    const coordText = JSON.stringify(polygon.geometry.coordinates, null, 2);
    navigator.clipboard
      .writeText(coordText)
      .then(() => {
        message.success("Coordinates copied to clipboard");
      })
      .catch(() => {
        message.error("Failed to copy coordinates");
      });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4">
              <Text className="text-gray-600">Loading polygon details...</Text>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/polygons")}
          className="mb-4"
        >
          Back to Polygons
        </Button>

        <Alert
          message="Error Loading Polygon"
          description={error}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        />
      </div>
    );
  }

  if (!polygon) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/polygons")}
          className="mb-4"
        >
          Back to Polygons
        </Button>
        <Alert
          message="Polygon Not Found"
          description="The requested polygon could not be found."
          type="warning"
          showIcon
        />
      </div>
    );
  }

  // Prepare coordinates table data
  const coordinatesData =
    polygon.geometry?.coordinates?.[0]?.map((coord, index) => ({
      key: index,
      index: index + 1,
      longitude: coord[0],
      latitude: coord[1],
      isFirst: index === 0,
      isLast: index === polygon.geometry.coordinates[0].length - 1,
    })) || [];

  const coordinatesColumns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (text, record) => (
        <Badge
          count={record.isFirst ? "Start" : record.isLast ? "End" : ""}
          color={record.isFirst ? "green" : record.isLast ? "blue" : ""}
        >
          <span className="font-mono">{text}</span>
        </Badge>
      ),
    },
    {
      title: "Longitude",
      dataIndex: "longitude",
      render: (text) => <span className="font-mono">{text.toFixed(6)}</span>,
    },
    {
      title: "Latitude",
      dataIndex: "latitude",
      render: (text) => <span className="font-mono">{text.toFixed(6)}</span>,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/polygons")}
              className="h-10 w-10 rounded-lg border-gray-300"
            />
            <div>
              <Title level={2} className="mb-1 text-gray-800">
                {polygon.name}
              </Title>
              <div className="flex items-center gap-2">
                <Tag
                  color={getPolygonTypeColor(polygon.polygonType)}
                  className="capitalize font-medium px-3 py-1 rounded-full border-0"
                >
                  {polygon.polygonType?.replace("_", " ")}
                </Tag>
                {polygon.isVisible ? (
                  <Tag color="success" icon={<EyeOutlined />}>
                    Visible
                  </Tag>
                ) : (
                  <Tag color="default" icon={<EyeInvisibleOutlined />}>
                    Hidden
                  </Tag>
                )}
                {polygon.isInteractive && <Tag color="blue">Interactive</Tag>}
              </div>
            </div>
          </div>

          <Space size="middle" className="flex-shrink-0">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="h-10 px-6 border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
            >
              Edit Polygon
            </Button>
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              loading={deleteLoading}
              className="h-10 px-6 rounded-lg"
            >
              Delete
            </Button>
          </Space>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Left Column */}
        <Col xs={24} lg={16}>
          {/* Basic Information */}
          <Card
            title="Basic Information"
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            <Descriptions
              column={{ xs: 1, sm: 2, lg: 2 }}
              className="polygon-descriptions"
            >
              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    <EnvironmentOutlined className="mr-2" />
                    Type
                  </span>
                }
              >
                <Tag
                  color={getPolygonTypeColor(polygon.polygonType)}
                  className="capitalize"
                >
                  {polygon.polygonType?.replace("_", " ")}
                </Tag>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    Associated Marker
                  </span>
                }
              >
                {polygon.marker ? (
                  <div className="flex items-center gap-2">
                    <LinkOutlined className="text-blue-500" />
                    <span className="text-blue-600 font-medium">
                      {polygon.marker.placeName}
                    </span>
                    <Tag size="small">{polygon.marker.markerType}</Tag>
                  </div>
                ) : (
                  <Text type="secondary">No associated marker</Text>
                )}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">Created</span>
                }
              >
                {polygon.createdAt
                  ? new Date(polygon.createdAt).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    Last Updated
                  </span>
                }
              >
                {polygon.updatedAt
                  ? new Date(polygon.updatedAt).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {polygon.description && (
              <>
                <Divider className="my-4" />
                <div>
                  <Text strong className="text-gray-700 mb-2 block">
                    Description
                  </Text>
                  <Paragraph className="text-gray-600 whitespace-pre-wrap">
                    {polygon.description}
                  </Paragraph>
                </div>
              </>
            )}
          </Card>

          {/* Geometry Details */}
          <Card
            title={
              <div className="flex items-center justify-between">
                <span>Geometry & Coordinates</span>
                <Button
                  type="text"
                  icon={<CopyOutlined />}
                  onClick={copyCoordinates}
                  size="small"
                >
                  Copy Coordinates
                </Button>
              </div>
            }
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            <div className="mb-4">
              <Row gutter={[16, 16]}>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Min Zoom"
                    value={polygon.minZoom || 0}
                    valueStyle={{ color: "#722ed1", fontSize: "18px" }}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Statistic
                    title="Max Zoom"
                    value={polygon.maxZoom || 24}
                    valueStyle={{ color: "#fa541c", fontSize: "18px" }}
                  />
                </Col>
              </Row>
            </div>

            <Divider />

            <div className="max-h-96 overflow-auto">
              <Table
                columns={coordinatesColumns}
                dataSource={coordinatesData}
                pagination={false}
                size="small"
                scroll={{ x: true }}
                className="coordinate-table"
              />
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <Text className="text-xs text-blue-600">
                <strong>Note:</strong> Coordinates are in [longitude, latitude]
                format. First and last coordinates are the same to close the
                polygon.
              </Text>
            </div>
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Visual Properties */}
          <Card
            title="Visual Properties"
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            {/* Fill Properties */}
            <div className="mb-4">
              <Text strong className="block mb-2 text-gray-700">
                Fill Properties
              </Text>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: polygon.style?.fillColor }}
                    />
                    <Text code className="text-xs">
                      {polygon.style?.fillColor}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Opacity:</span>
                  <Text className="text-sm">
                    {Math.round((polygon.style?.fillOpacity || 0) * 100)}%
                  </Text>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* Stroke Properties */}
            <div className="mb-4">
              <Text strong className="block mb-2 text-gray-700">
                Stroke Properties
              </Text>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: polygon.style?.strokeColor }}
                    />
                    <Text code className="text-xs">
                      {polygon.style?.strokeColor}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Width:</span>
                  <Text className="text-sm">
                    {polygon.style?.strokeWidth}px
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Opacity:</span>
                  <Text className="text-sm">
                    {Math.round((polygon.style?.strokeOpacity || 0) * 100)}%
                  </Text>
                </div>
              </div>
            </div>

            <Divider className="my-4" />

            {/* 3D Extrusion */}
            <div>
              <Text strong className="block mb-2 text-gray-700">
                3D Extrusion
              </Text>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Height:</span>
                  <Text className="text-sm font-medium">
                    {polygon.extrusion?.height || 0}m
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base:</span>
                  <Text className="text-sm">
                    {polygon.extrusion?.base || 0}m
                  </Text>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Color:</span>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: polygon.extrusion?.color }}
                    />
                    <Text code className="text-xs">
                      {polygon.extrusion?.color}
                    </Text>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Opacity:</span>
                  <Text className="text-sm">
                    {Math.round((polygon.extrusion?.opacity || 0) * 100)}%
                  </Text>
                </div>
              </div>
            </div>
          </Card>

          {/* Settings */}
          <Card
            title="Settings & Visibility"
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text strong className="text-sm">
                    Visible on Map
                  </Text>
                  <div className="text-xs text-gray-500">
                    Whether the polygon is visible on the map
                  </div>
                </div>
                <div>
                  {polygon.isVisible ? (
                    <Tag color="success" icon={<EyeOutlined />}>
                      Visible
                    </Tag>
                  ) : (
                    <Tag color="default" icon={<EyeInvisibleOutlined />}>
                      Hidden
                    </Tag>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text strong className="text-sm">
                    Interactive
                  </Text>
                  <div className="text-xs text-gray-500">
                    Whether users can interact with the polygon
                  </div>
                </div>
                <div>
                  <Tag color={polygon.isInteractive ? "blue" : "default"}>
                    {polygon.isInteractive ? "Interactive" : "Static"}
                  </Tag>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Text strong className="text-sm">
                    Zoom Range
                  </Text>
                  <div className="text-xs text-gray-500">
                    Visible zoom levels
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {polygon.minZoom} - {polygon.maxZoom}
                  </div>
                  <div className="text-xs text-gray-500">zoom levels</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card title="Quick Actions" className="shadow-sm border-0 rounded-lg">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="default"
                icon={<EditOutlined />}
                onClick={handleEdit}
                block
                className="h-10"
              >
                Edit Polygon
              </Button>

              {polygon.marker && (
                <Button
                  type="default"
                  icon={<LinkOutlined />}
                  onClick={() =>
                    navigate(`/markers/view/${polygon.marker._id}`)
                  }
                  block
                  className="h-10"
                >
                  View Associated Marker
                </Button>
              )}

              <Button
                type="default"
                icon={<CopyOutlined />}
                onClick={copyCoordinates}
                block
                className="h-10"
              >
                Copy Coordinates
              </Button>

              <Divider className="my-3" />

              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
                loading={deleteLoading}
                block
                className="h-10"
              >
                Delete Polygon
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* GeoJSON Export */}
      <Card
        title="GeoJSON Export"
        className="mt-6 shadow-sm border-0 rounded-lg"
      >
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <Text strong>GeoJSON Format</Text>
            <Button
              type="text"
              icon={<CopyOutlined />}
              onClick={() => {
                const geoJSON = {
                  type: "Feature",
                  geometry: polygon.geometry,
                  properties: {
                    id: polygon._id,
                    name: polygon.name,
                    description: polygon.description,
                    polygonType: polygon.polygonType,
                    ...polygon.style,
                    ...polygon.extrusion,
                    isVisible: polygon.isVisible,
                    isInteractive: polygon.isInteractive,
                    minZoom: polygon.minZoom,
                    maxZoom: polygon.maxZoom,
                  },
                };
                navigator.clipboard
                  .writeText(JSON.stringify(geoJSON, null, 2))
                  .then(() => message.success("GeoJSON copied to clipboard"))
                  .catch(() => message.error("Failed to copy GeoJSON"));
              }}
              size="small"
            >
              Copy GeoJSON
            </Button>
          </div>
          <pre className="text-xs text-gray-600 whitespace-pre-wrap max-h-32 overflow-auto">
            {JSON.stringify(
              {
                type: "Feature",
                geometry: polygon.geometry,
                properties: {
                  id: polygon._id,
                  name: polygon.name,
                  polygonType: polygon.polygonType,
                },
              },
              null,
              2
            )}
          </pre>
        </div>
      </Card>
    </div>
  );
}
