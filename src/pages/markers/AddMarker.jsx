import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import {
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
  FormikInput,
  FormikSelect,
  FormikTextArea,
  FormikUpload,
  FormikInputNumber,
} from "../../components/forms";
import {
  markerValidationSchema,
  markerStepValidationSchemas,
} from "../../validation/schemas";
import { markerService } from "../../services/markerService";

const { Title, Text } = Typography;

export default function AddMarker() {
  const navigate = useNavigate();
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

  const initialValues = {
    markerType: "party",
    markerLabel: "",
    latitude: "",
    longitude: "",
    placeName: "",
    website: "",
    partyDescription: "",
    partyTime: "evening",
    partyIcon: [],
    placeImage: [],
    partyImage: [],
    tickets: Array(24).fill(0),
  };

  const handleFinalSubmit = async (values) => {
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

      // Add files
      if (values.partyIcon?.[0]?.originFileObj) {
        formData.append("partyIcon", values.partyIcon[0].originFileObj);
      }
      if (values.placeImage?.[0]?.originFileObj) {
        formData.append("placeImage", values.placeImage[0].originFileObj);
      }
      if (values.partyImage?.[0]?.originFileObj) {
        formData.append("partyImage", values.partyImage[0].originFileObj);
      }

      await markerService.createMarker(formData);
      message.success("Marker added successfully!");
      navigate("/markers");
    } catch (error) {
      console.error(error);
      message.error(error.message || "Error adding marker");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async (validateForm, values) => {
    const stepSchema = markerStepValidationSchemas[`step${currentStep + 1}`];

    try {
      if (stepSchema) {
        await stepSchema.validate(values, { abortEarly: false });
      }
      setCurrentStep(currentStep + 1);
    } catch (error) {
      if (error.inner) {
        // Yup validation errors
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        validateForm();
      }
      message.error("Please fill in all required fields correctly");
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderBasicInfo = () => (
    <Card>
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
  );

  const renderMediaUpload = () => (
    <Card>
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
  );

  const renderPartyDetails = () => (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="Party Information">
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

      {/* Formik Form */}
      <Formik
        initialValues={initialValues}
        validationSchema={markerValidationSchema}
        onSubmit={() => {}} // Empty onSubmit to prevent auto-submission
        enableReinitialize
      >
        {({ values, errors, touched, validateForm, isSubmitting }) => (
          <div>
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
                    <Button
                      type="primary"
                      size="large"
                      onClick={() => handleNext(validateForm, values)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      icon={<SaveOutlined />}
                      loading={loading}
                      onClick={() => handleFinalSubmit(values)}
                    >
                      Create Marker
                    </Button>
                  )}
                </Space>
              </div>
            </Card>
          </div>
        )}
      </Formik>
    </div>
  );
}
