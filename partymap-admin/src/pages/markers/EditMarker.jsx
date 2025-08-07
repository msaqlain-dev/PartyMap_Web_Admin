import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  message,
  Alert,
  Spin,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  Input,
  Select,
  TextArea,
  Upload,
  InputNumber,
  validationRules,
} from "../../components/forms";
import { markerService } from "../../services/markerService";

const { Title, Text } = Typography;

export default function EditMarker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);

  const markerTypeOptions = [
    { label: "Party", value: "party" },
    { label: "Bar", value: "bar" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Club", value: "club" },
    { label: "Event Hall", value: "event_hall" },
  ];

  const partyTimeOptions = [
    { label: "Morning (6 AM - 12 PM)", value: "morning" },
    { label: "Afternoon (12 PM - 6 PM)", value: "afternoon" },
    { label: "Evening (6 PM - 10 PM)", value: "evening" },
    { label: "Night (10 PM - 2 AM)", value: "night" },
    { label: "Late Night (2 AM - 6 AM)", value: "late_night" },
  ];

  useEffect(() => {
    const fetchMarkerData = async () => {
      try {
        setInitialLoading(true);
        setError(null);

        const data = await markerService.getMarker(id);

        // Prepare form data
        const formData = {
          markerType: data.markerType || "party",
          markerLabel: data.markerLabel || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
          placeName: data.placeName || "",
          website: data.website || "",
          partyDescription: data.partyDescription || "",
          partyTime: data.partyTime || "evening",
          tickets: Array.from({ length: 24 }, (_, i) => {
            const ticket = data.tickets?.find((t) => parseInt(t.hour) === i);
            return ticket ? ticket.availableTickets : 0;
          }),
        };

        // Set existing images if available
        if (data.partyIconUrl) {
          formData.partyIcon = [
            {
              uid: "party-icon",
              name: "Party Icon",
              status: "done",
              url: data.partyIconUrl,
            },
          ];
        }

        if (data.placeImageUrl) {
          formData.placeImage = [
            {
              uid: "place-image",
              name: "Place Image",
              status: "done",
              url: data.placeImageUrl,
            },
          ];
        }

        if (data.partyImageUrl) {
          formData.partyImage = [
            {
              uid: "party-image",
              name: "Party Image",
              status: "done",
              url: data.partyImageUrl,
            },
          ];
        }

        // Set form values
        form.setFieldsValue(formData);
      } catch (err) {
        console.error("Error fetching marker data:", err);
        setError(err.message || "Failed to load marker data");
        message.error("Failed to load marker data");
      } finally {
        setInitialLoading(false);
      }
    };

    if (id) {
      fetchMarkerData();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      // Add form values
      Object.entries(values).forEach(([key, value]) => {
        if (
          key !== "tickets" &&
          key !== "partyIcon" &&
          key !== "placeImage" &&
          key !== "partyImage" &&
          value !== undefined
        ) {
          formData.append(key, value);
        }
      });

      // Add ticket data
      if (values.tickets) {
        values.tickets.forEach((ticket, index) => {
          formData.append(`tickets[${index}]`, ticket || 0);
        });
      }

      // Add files (only new uploads)
      if (values.partyIcon?.[0]?.originFileObj) {
        formData.append("partyIcon", values.partyIcon[0].originFileObj);
      }
      if (values.placeImage?.[0]?.originFileObj) {
        formData.append("placeImage", values.placeImage[0].originFileObj);
      }
      if (values.partyImage?.[0]?.originFileObj) {
        formData.append("partyImage", values.partyImage[0].originFileObj);
      }

      await markerService.updateMarker(id, formData);

      message.success("Marker updated successfully!");
      navigate("/markers");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error updating marker");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <Spin size="large" />
          <div className="mt-4">
            <Text>Loading marker data...</Text>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/markers")}
          className="mb-4"
        >
          Back to Markers
        </Button>

        <Title level={2} className="mb-2">
          <EditOutlined className="mr-2" />
          Edit Marker
        </Title>
        <Text type="secondary">Update marker information and media files</Text>
      </div>

      {/* Form */}
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <Row gutter={[24, 24]}>
          {/* Basic Information */}
          <Col xs={24}>
            <Card title="Basic Information" className="mb-6">
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Select
                    label="Marker Type"
                    name="markerType"
                    placeholder="Select marker type"
                    options={markerTypeOptions}
                    rules={[
                      validationRules.required("Please select marker type"),
                    ]}
                  />
                </Col>

                <Col xs={24} md={12}>
                  <Input
                    label="Marker Label"
                    name="markerLabel"
                    placeholder="Enter marker label"
                    rules={[
                      validationRules.required("Please enter marker label"),
                    ]}
                  />
                </Col>

                <Col xs={24} md={12}>
                  <Input
                    label="Latitude"
                    name="latitude"
                    placeholder="e.g., 40.7128"
                    rules={[
                      validationRules.required("Please enter latitude"),
                      validationRules.pattern(
                        /^-?([1-8]?[0-9]\.{1}\d{1,6}$|90\.{1}0{1,6}$)/,
                        "Invalid latitude format"
                      ),
                    ]}
                  />
                </Col>

                <Col xs={24} md={12}>
                  <Input
                    label="Longitude"
                    name="longitude"
                    placeholder="e.g., -74.0060"
                    rules={[
                      validationRules.required("Please enter longitude"),
                      validationRules.pattern(
                        /^-?([1-9]?[0-9]\.{1}\d{1,6}$|1[0-7][0-9]\.{1}\d{1,6}$|180\.{1}0{1,6}$)/,
                        "Invalid longitude format"
                      ),
                    ]}
                  />
                </Col>

                <Col xs={24}>
                  <Input
                    label="Place Name"
                    name="placeName"
                    placeholder="Enter place name"
                    rules={[
                      validationRules.required("Please enter place name"),
                    ]}
                  />
                </Col>

                <Col xs={24}>
                  <Input
                    label="Website URL"
                    name="website"
                    placeholder="https://example.com"
                    rules={[validationRules.url("Please enter a valid URL")]}
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Media Upload */}
          <Col xs={24}>
            <Card title="Media Files" className="mb-6">
              <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                  <Upload
                    label="Party Icon"
                    name="partyIcon"
                    accept="image/*"
                    maxCount={1}
                    uploadType="drag"
                    dragText="Click or drag icon to upload"
                    hint="PNG, JPG, SVG up to 2MB"
                  />
                </Col>

                <Col xs={24} md={8}>
                  <Upload
                    label="Place Image"
                    name="placeImage"
                    accept="image/*"
                    maxCount={1}
                    uploadType="drag"
                    dragText="Click or drag image to upload"
                    hint="High quality venue photo"
                  />
                </Col>

                <Col xs={24} md={8}>
                  <Upload
                    label="Party Image"
                    name="partyImage"
                    accept="image/*"
                    maxCount={1}
                    uploadType="drag"
                    dragText="Click or drag image to upload"
                    hint="Party atmosphere photo"
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Party Details */}
          <Col xs={24}>
            <Card title="Party Information" className="mb-6">
              <Row gutter={[24, 16]}>
                <Col xs={24} md={12}>
                  <Select
                    label="Party Time"
                    name="partyTime"
                    placeholder="Select party time"
                    options={partyTimeOptions}
                  />
                </Col>

                <Col xs={24}>
                  <TextArea
                    label="Party Description"
                    name="partyDescription"
                    placeholder="Describe the party atmosphere, music, crowd, special features..."
                    rows={4}
                    maxLength={500}
                    showCount
                  />
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Ticket Availability */}
          <Col xs={24}>
            <Card title="Ticket Availability (Hourly)" className="mb-6">
              <Text
                type="secondary"
                style={{ marginBottom: 16, display: "block" }}
              >
                Set the number of available tickets for each hour of the day
              </Text>

              <Row gutter={[16, 16]}>
                {Array.from({ length: 24 }, (_, i) => {
                  const hour = i % 12 === 0 ? 12 : i % 12;
                  const ampm = i < 12 ? "AM" : "PM";
                  const timeLabel = `${hour}:00 ${ampm}`;

                  return (
                    <Col xs={12} sm={8} md={6} lg={4} key={i}>
                      <InputNumber
                        label={timeLabel}
                        name={["tickets", i]}
                        min={0}
                        max={9999}
                        placeholder="0"
                      />
                    </Col>
                  );
                })}
              </Row>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Card>
          <div className="flex justify-end">
            <Space>
              <Button size="large" onClick={() => navigate("/markers")}>
                Cancel
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<SaveOutlined />}
                loading={loading}
                htmlType="submit"
              >
                Update Marker
              </Button>
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
}
