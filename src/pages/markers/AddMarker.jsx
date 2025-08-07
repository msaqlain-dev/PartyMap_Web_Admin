import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Steps,
  message,
} from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import {
  Input,
  Select,
  TextArea,
  Upload,
  InputNumber,
  validationRules,
} from "../../components/forms";
import apiClient from "../../config/api";

const { Title, Text } = Typography;

export default function AddMarker() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      title: "Basic Info",
      description: "Marker type and location",
    },
    {
      title: "Media",
      description: "Images and icons",
    },
    {
      title: "Party Details",
      description: "Description and schedule",
    },
  ];

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

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Create FormData
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

      // Add files
      if (values.partyIcon?.originFileObj) {
        formData.append("partyIcon", values.partyIcon[0].originFileObj);
      }
      if (values.placeImage?.[0]?.originFileObj) {
        formData.append("placeImage", values.placeImage[0].originFileObj);
      }
      if (values.partyImage?.[0]?.originFileObj) {
        formData.append("partyImage", values.partyImage[0].originFileObj);
      }

      // Use apiClient for the request
      await apiClient.post("/markers", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      message.success("Marker added successfully!");
      navigate("/markers");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error adding marker");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    try {
      if (currentStep === 0) {
        await form.validateFields([
          "markerType",
          "markerLabel",
          "latitude",
          "longitude",
          "placeName",
        ]);
      } else if (currentStep === 1) {
        // Media step - optional validation
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      message.error("Please fill in all required fields");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderBasicInfo = () => (
    <Card>
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Select
            label="Marker Type"
            name="markerType"
            placeholder="Select marker type"
            options={markerTypeOptions}
            rules={[validationRules.required("Please select marker type")]}
          />
        </Col>

        <Col xs={24} md={12}>
          <Input
            label="Marker Label"
            name="markerLabel"
            placeholder="Enter marker label"
            rules={[validationRules.required("Please enter marker label")]}
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
            rules={[validationRules.required("Please enter place name")]}
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
  );

  const renderMediaUpload = () => (
    <Card>
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
  );

  const renderPartyDetails = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="Party Information">
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

      <Card title="Ticket Availability (Hourly)">
        <Text type="secondary" style={{ marginBottom: 16, display: "block" }}>
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
    </Space>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderBasicInfo();
      case 1:
        return renderMediaUpload();
      case 2:
        return renderPartyDetails();
      default:
        return renderBasicInfo();
    }
  };

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
          Add New Marker
        </Title>
        <Text type="secondary">
          Create a new party venue marker with detailed information and media
        </Text>
      </div>

      {/* Steps */}
      <Card className="mb-6">
        <Steps current={currentStep} items={steps} className="mb-6" />
      </Card>

      {/* Form */}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          markerType: "party",
          partyTime: "evening",
          tickets: Array(24).fill(0),
        }}
      >
        {renderStepContent()}

        {/* Navigation Buttons */}
        <Card className="mt-6">
          <div className="flex justify-between">
            <div>
              {currentStep > 0 && (
                <Button size="large" onClick={handlePrev}>
                  Previous
                </Button>
              )}
            </div>

            <Space>
              {currentStep < steps.length - 1 ? (
                <Button type="primary" size="large" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button
                  type="primary"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={loading}
                  htmlType="submit"
                >
                  Create Marker
                </Button>
              )}
            </Space>
          </div>
        </Card>
      </Form>
    </div>
  );
}
