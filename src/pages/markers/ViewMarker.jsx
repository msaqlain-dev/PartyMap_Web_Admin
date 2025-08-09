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
  Image,
  Descriptions,
  Spin,
  Alert,
  Statistic,
  Divider,
  Tooltip,
  Empty,
  Modal,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { markerService } from "../../services/markerService";

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

export default function ViewMarker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarker = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await markerService.getMarker(id);
        console.log("API Response:", response);
        setMarker(response.data);
      } catch (err) {
        console.error("Error fetching marker:", err);
        setError(err.message || "Failed to load marker data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMarker();
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/markers/edit/${id}`);
  };

  const handleDelete = () => {
    confirm({
      title: "Delete Marker",
      icon: <ExclamationCircleOutlined />,
      content: `Are you sure you want to delete "${marker?.placeName}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      confirmLoading: deleteLoading,
      onOk: async () => {
        setDeleteLoading(true);
        try {
          await markerService.deleteMarker(id);
          message.success("Marker deleted successfully");
          navigate("/markers");
        } catch (error) {
          console.error("Delete error:", error);
          message.error(error.message || "Error deleting marker");
        } finally {
          setDeleteLoading(false);
        }
      },
    });
  };

  const getMarkerTypeColor = (type) => {
    const colors = {
      party: "#e10098",
      bar: "#722ed1",
      restaurant: "#fa541c",
      club: "#1890ff",
      event_hall: "#52c41a",
    };
    return colors[type] || "#d9d9d9";
  };

  const getPartyTimeColor = (time) => {
    const colors = {
      morning: "#faad14",
      afternoon: "#1890ff",
      evening: "#722ed1",
      night: "#262626",
      late_night: "#000000",
    };
    return colors[time] || "#d9d9d9";
  };

  const getTotalTickets = () => {
    if (!marker?.tickets || !Array.isArray(marker.tickets)) return 0;
    return marker.tickets.reduce(
      (total, ticket) => total + (ticket.availableTickets || 0),
      0
    );
  };

  const getPeakHours = () => {
    if (!marker?.tickets || !Array.isArray(marker.tickets)) return [];

    const sortedTickets = [...marker.tickets]
      .filter((ticket) => ticket.availableTickets > 0)
      .sort((a, b) => b.availableTickets - a.availableTickets)
      .slice(0, 3);

    return sortedTickets.map((ticket) => {
      let hour;
      if (typeof ticket.hour === "string") {
        const timeMatch = ticket.hour.match(/(\d+):00\s*(AM|PM)/i);
        if (timeMatch) {
          hour = parseInt(timeMatch[1]);
          if (timeMatch[2].toUpperCase() === "PM" && hour !== 12) {
            hour += 12;
          } else if (timeMatch[2].toUpperCase() === "AM" && hour === 12) {
            hour = 0;
          }
        } else {
          hour = parseInt(ticket.hour);
        }
      } else {
        hour = parseInt(ticket.hour);
      }

      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? "AM" : "PM";
      return `${displayHour}:00 ${ampm}`;
    });
  };

  const parseTicketHour = (ticketHour) => {
    if (typeof ticketHour === "string") {
      const timeMatch = ticketHour.match(/(\d+):00\s*(AM|PM)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        if (timeMatch[2].toUpperCase() === "PM" && hour !== 12) {
          hour += 12;
        } else if (timeMatch[2].toUpperCase() === "AM" && hour === 12) {
          hour = 0;
        }
        return hour;
      } else {
        return parseInt(ticketHour.replace(/[^\d]/g, ""));
      }
    }
    return parseInt(ticketHour);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <Spin size="large" />
            <div className="mt-4">
              <Text className="text-gray-600">Loading marker details...</Text>
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
          onClick={() => navigate("/markers")}
          className="mb-4"
        >
          Back to Markers
        </Button>

        <Alert
          message="Error Loading Marker"
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

  if (!marker) {
    return (
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/markers")}
          className="mb-4"
        >
          Back to Markers
        </Button>
        <Empty description="Marker not found" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate("/markers")}
              className="h-10 w-10 rounded-lg border-gray-300"
            />
            <div>
              <Title level={2} className="mb-1 text-gray-800">
                {marker.placeName}
              </Title>
              <Text className="text-gray-600 text-base">
                {marker.markerLabel}
              </Text>
            </div>
          </div>

          <Space size="middle" className="flex-shrink-0">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={handleEdit}
              className="h-10 px-6 border-primary text-primary hover:bg-primary hover:text-white rounded-lg"
            >
              Edit Marker
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
            extra={
              <Space>
                <Tag
                  color={getMarkerTypeColor(marker.markerType)}
                  className="capitalize px-3 py-1 rounded-full border-0 font-medium"
                >
                  {marker.markerType?.replace("_", " ")}
                </Tag>
                <Tag
                  color={getPartyTimeColor(marker.partyTime)}
                  className="capitalize px-3 py-1 rounded-full border-0 font-medium"
                >
                  {marker.partyTime?.replace("_", " ")}
                </Tag>
              </Space>
            }
          >
            <Descriptions
              column={{ xs: 1, sm: 2, lg: 2 }}
              className="marker-descriptions"
            >
              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    <EnvironmentOutlined className="mr-2" />
                    Location
                  </span>
                }
              >
                <div className="font-mono text-sm">
                  <div>Lat: {marker.latitude}</div>
                  <div>Lng: {marker.longitude}</div>
                </div>
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    <ClockCircleOutlined className="mr-2" />
                    Party Time
                  </span>
                }
              >
                <span className="capitalize text-gray-800 font-medium">
                  {marker.partyTime?.replace("_", " ")}
                </span>
              </Descriptions.Item>

              {marker.website && (
                <Descriptions.Item
                  label={
                    <span className="text-gray-600 font-medium">
                      <LinkOutlined className="mr-2" />
                      Website
                    </span>
                  }
                >
                  <a
                    href={marker.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary-600 underline"
                  >
                    Visit Website
                  </a>
                </Descriptions.Item>
              )}

              <Descriptions.Item
                label={
                  <span className="text-gray-600 font-medium">
                    <CalendarOutlined className="mr-2" />
                    Created
                  </span>
                }
              >
                {marker.createdAt
                  ? new Date(marker.createdAt).toLocaleDateString()
                  : "N/A"}
              </Descriptions.Item>
            </Descriptions>

            {marker.partyDescription && (
              <>
                <Divider className="my-4" />
                <div>
                  <Text strong className="text-gray-700 mb-2 block">
                    Description
                  </Text>
                  <Paragraph className="text-gray-600 whitespace-pre-wrap">
                    {marker.partyDescription}
                  </Paragraph>
                </div>
              </>
            )}
          </Card>

          {/* Media Gallery */}
          <Card
            title="Media Gallery"
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            <Row gutter={[16, 16]}>
              {marker.partyIcon && (
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text strong className="block mb-2 text-gray-700">
                      Party Icon
                    </Text>
                    <Image
                      src={marker.partyIcon}
                      alt="Party Icon"
                      className="rounded-lg border border-gray-200"
                      style={{ maxHeight: 120, objectFit: "cover" }}
                    />
                  </div>
                </Col>
              )}

              {marker.placeImage && (
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text strong className="block mb-2 text-gray-700">
                      Place Image
                    </Text>
                    <Image
                      src={marker.placeImage}
                      alt="Place"
                      className="rounded-lg border border-gray-200"
                      style={{ maxHeight: 120, objectFit: "cover" }}
                    />
                  </div>
                </Col>
              )}

              {marker.partyImage && (
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text strong className="block mb-2 text-gray-700">
                      Party Image
                    </Text>
                    <Image
                      src={marker.partyImage}
                      alt="Party"
                      className="rounded-lg border border-gray-200"
                      style={{ maxHeight: 120, objectFit: "cover" }}
                    />
                  </div>
                </Col>
              )}
            </Row>

            {!marker.partyIcon && !marker.placeImage && !marker.partyImage && (
              <Empty description="No images available" className="py-8" />
            )}
          </Card>
        </Col>

        {/* Right Column */}
        <Col xs={24} lg={8}>
          {/* Quick Stats */}
          <Card
            title="Quick Stats"
            className="mb-6 shadow-sm border-0 rounded-lg"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Total Tickets"
                  value={getTotalTickets()}
                  valueStyle={{
                    color: "#e10098",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Peak Hours"
                  value={getPeakHours().length}
                  valueStyle={{
                    color: "#722ed1",
                    fontSize: "20px",
                    fontWeight: "bold",
                  }}
                />
              </Col>
            </Row>

            {getPeakHours().length > 0 && (
              <>
                <Divider className="my-4" />
                <div>
                  <Text strong className="block mb-2 text-gray-700">
                    Peak Hours
                  </Text>
                  <Space wrap>
                    {getPeakHours().map((hour, index) => (
                      <Tag
                        key={index}
                        color="gold"
                        className="px-2 py-1 rounded border-0"
                      >
                        {hour}
                      </Tag>
                    ))}
                  </Space>
                </div>
              </>
            )}
          </Card>

          {/* Ticket Availability */}
          <Card
            title="Hourly Ticket Availability"
            className="shadow-sm border-0 rounded-lg"
          >
            {marker.tickets &&
            Array.isArray(marker.tickets) &&
            marker.tickets.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {Array.from({ length: 24 }, (_, i) => {
                  const ticket = marker.tickets.find((t) => {
                    const ticketHour = parseTicketHour(t.hour);
                    return ticketHour === i;
                  });
                  const availableTickets = ticket?.availableTickets || 0;
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const ampm = i < 12 ? "AM" : "PM";
                  const timeLabel = `${hour}:00 ${ampm}`;

                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">
                        {timeLabel}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            availableTickets > 50
                              ? "text-green-600"
                              : availableTickets > 20
                              ? "text-yellow-600"
                              : availableTickets > 0
                              ? "text-orange-600"
                              : "text-red-500"
                          }`}
                        >
                          {availableTickets}
                        </span>
                        <div
                          className={`w-2 h-2 rounded-full ${
                            availableTickets > 50
                              ? "bg-green-500"
                              : availableTickets > 20
                              ? "bg-yellow-500"
                              : availableTickets > 0
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>
                  );
                }).filter((_, i) => {
                  // Show only hours with tickets or peak hours
                  const ticket = marker.tickets.find((t) => {
                    const ticketHour = parseTicketHour(t.hour);
                    return ticketHour === i;
                  });
                  return (ticket?.availableTickets || 0) > 0;
                })}
              </div>
            ) : (
              <Empty description="No ticket data available" className="py-8" />
            )}
          </Card>
        </Col>
      </Row>

      {/* Full Ticket Schedule (Mobile/Desktop optimized) */}
      <Card
        title="Complete Ticket Schedule"
        className="mt-6 shadow-sm border-0 rounded-lg"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
          {Array.from({ length: 24 }, (_, i) => {
            const ticket = marker.tickets?.find((t) => {
              const ticketHour = parseTicketHour(t.hour);
              return ticketHour === i;
            });
            const availableTickets = ticket?.availableTickets || 0;
            const hour = i % 12 === 0 ? 12 : i % 12;
            const ampm = i < 12 ? "AM" : "PM";
            const timeLabel = `${hour}:00 ${ampm}`;

            return (
              <Tooltip
                key={i}
                title={`${timeLabel}: ${availableTickets} tickets available`}
              >
                <div
                  className={`
                  p-3 rounded-lg border-2 text-center transition-all duration-200 cursor-pointer
                  ${
                    availableTickets > 50
                      ? "border-green-200 bg-green-50 hover:bg-green-100"
                      : availableTickets > 20
                      ? "border-yellow-200 bg-yellow-50 hover:bg-yellow-100"
                      : availableTickets > 0
                      ? "border-orange-200 bg-orange-50 hover:bg-orange-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }
                `}
                >
                  <div className="text-xs font-medium text-gray-600 mb-1">
                    {timeLabel}
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      availableTickets > 50
                        ? "text-green-600"
                        : availableTickets > 20
                        ? "text-yellow-600"
                        : availableTickets > 0
                        ? "text-orange-600"
                        : "text-gray-400"
                    }`}
                  >
                    {availableTickets}
                  </div>
                  <div className="text-xs text-gray-500">
                    {availableTickets === 0 ? "Sold Out" : "Available"}
                  </div>
                </div>
              </Tooltip>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Text strong className="block mb-3 text-gray-700">
            Availability Legend:
          </Text>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <Text className="text-sm text-gray-600">High (50+)</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <Text className="text-sm text-gray-600">Medium (21-50)</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <Text className="text-sm text-gray-600">Low (1-20)</Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <Text className="text-sm text-gray-600">Sold Out (0)</Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
