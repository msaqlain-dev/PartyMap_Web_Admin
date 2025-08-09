import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import {
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  message,
  Spin,
  Alert,
} from "antd";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  EditOutlined,
} from "@ant-design/icons";
import {
  FormikInput,
  FormikSelect,
  FormikTextArea,
  FormikUpload,
  FormikInputNumber,
} from "../../components/forms";
import { markerValidationSchema } from "../../validation/schemas";
import { markerService } from "../../services/markerService";

const { Title, Text } = Typography;

export default function EditMarker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialValues, setInitialValues] = useState(null);

  const markerTypeOptions = [
    { label: "Party", value: "party" },
    { label: "Bar", value: "bar" },
    { label: "Restaurant", value: "restaurant" },
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

        const res = await markerService.getMarker(id);
        const data = res.data;

        console.log("Fetched marker data: ", data);

        // Prepare initial values for Formik
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
            // Parse hour from ticket data more safely
            const ticket = data.tickets?.find((t) => {
              // Handle both string and number hour formats
              let ticketHour;
              if (typeof t.hour === "string") {
                // Extract hour from string format like "10:00 AM"
                const timeMatch = t.hour.match(/(\d+):00\s*(AM|PM)/i);
                if (timeMatch) {
                  ticketHour = parseInt(timeMatch[1]);
                  if (
                    timeMatch[2].toUpperCase() === "PM" &&
                    ticketHour !== 12
                  ) {
                    ticketHour += 12;
                  } else if (
                    timeMatch[2].toUpperCase() === "AM" &&
                    ticketHour === 12
                  ) {
                    ticketHour = 0;
                  }
                } else {
                  ticketHour = parseInt(t.hour.replace(/[^\d]/g, ""));
                }
              } else {
                ticketHour = parseInt(t.hour);
              }
              return ticketHour === i;
            });
            return ticket ? ticket.availableTickets : 0;
          }),
          partyIcon: data.partyIconUrl
            ? [
                {
                  uid: "party-icon",
                  name: "Party Icon",
                  status: "done",
                  url: data.partyIconUrl,
                },
              ]
            : [],
          placeImage: data.placeImageUrl
            ? [
                {
                  uid: "place-image",
                  name: "Place Image",
                  status: "done",
                  url: data.placeImageUrl,
                },
              ]
            : [],
          partyImage: data.partyImageUrl
            ? [
                {
                  uid: "party-image",
                  name: "Party Image",
                  status: "done",
                  url: data.partyImageUrl,
                },
              ]
            : [],
        };

        setInitialValues(formData);
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
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Add form values
      Object.entries(values).forEach(([key, value]) => {
        if (
          key !== "tickets" &&
          key !== "partyIcon" &&
          key !== "placeImage" &&
          key !== "partyImage" &&
          value !== undefined &&
          value !== null &&
          value !== ""
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

  if (!initialValues) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert
          message="Marker Not Found"
          description="The requested marker could not be found."
          type="warning"
          showIcon
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

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={markerValidationSchema}
        onSubmit={() => {}} // Empty onSubmit to prevent auto-submission
        enableReinitialize
      >
        {({ values, errors, touched, isSubmitting }) => (
          <div>
            <Row gutter={[24, 24]}>
              {/* Basic Information */}
              <Col xs={24}>
                <Card title="Basic Information" className="mb-6">
                  <Row gutter={[24, 16]}>
                    <Col xs={24} md={12}>
                      <FormikSelect
                        name="markerType"
                        label="Marker Type"
                        placeholder="Select marker type"
                        options={markerTypeOptions}
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <FormikInput
                        name="markerLabel"
                        label="Marker Label"
                        placeholder="Enter marker label"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <FormikInput
                        name="latitude"
                        label="Latitude"
                        placeholder="e.g., 40.7128"
                      />
                    </Col>

                    <Col xs={24} md={12}>
                      <FormikInput
                        name="longitude"
                        label="Longitude"
                        placeholder="e.g., -74.0060"
                      />
                    </Col>

                    <Col xs={24}>
                      <FormikInput
                        name="placeName"
                        label="Place Name"
                        placeholder="Enter place name"
                      />
                    </Col>

                    <Col xs={24}>
                      <FormikInput
                        name="website"
                        label="Website URL"
                        placeholder="https://example.com"
                        type="url"
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
                      <FormikUpload
                        name="partyIcon"
                        label="Party Icon"
                        accept="image/*"
                        maxCount={1}
                        uploadType="drag"
                        dragText="Click or drag icon to upload"
                        hint="PNG, JPG, SVG up to 2MB"
                      />
                    </Col>

                    <Col xs={24} md={8}>
                      <FormikUpload
                        name="placeImage"
                        label="Place Image"
                        accept="image/*"
                        maxCount={1}
                        uploadType="drag"
                        dragText="Click or drag image to upload"
                        hint="High quality venue photo"
                      />
                    </Col>

                    <Col xs={24} md={8}>
                      <FormikUpload
                        name="partyImage"
                        label="Party Image"
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
                      <FormikSelect
                        name="partyTime"
                        label="Party Time"
                        placeholder="Select party time"
                        options={partyTimeOptions}
                      />
                    </Col>

                    <Col xs={24}>
                      <FormikTextArea
                        name="partyDescription"
                        label="Party Description"
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
                          <FormikInputNumber
                            name={`tickets.${i}`}
                            label={timeLabel}
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
                    loading={isSubmitting}
                    onClick={() => handleSubmit(values)}
                  >
                    Update Marker
                  </Button>
                </Space>
              </div>
            </Card>
          </div>
        )}
      </Formik>
    </div>
  );
}
